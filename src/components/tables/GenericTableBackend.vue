<template>
  <div>
    <q-table
      :columns='_columns'
      v-model:rows='rows'
      :filter='filter'
      :loading='visible'
      :pagination='_pagination'
      :row-key="rowKey?rowKey:'id'"
      table-header-class="text-black text-capitalize text-weight-bold"
      bordered
      class='q-mt-md'
      flat
      loading-label='Loading, please wait...'
      no-data-label='No hay datos que mostrar.'
    >
      <template v-slot:body-cell-actions='cell'>
        <QTd auto-width>
          <QBtn v-if='view' color='black' dense fab-mini flat @click='doView(cell.row.id)'>
            <q-icon name='visibility' style='font-size: 20px' />
            <QTooltip>Ver</QTooltip>
          </QBtn>
          <QBtn v-if='active' :color="cell.row.active ? 'black' : 'grey'" dense fab-mini flat
                @click='doActive(cell.row.id)'>
            <q-icon :name="cell.row.active ? 'check_circle' : 'block'" style='font-size: 20px' />
            <QTooltip>{{ cell.row.active ? 'Activo' : 'Inactivo' }}</QTooltip>
          </QBtn>
          <QBtn v-if='edit' class='text-blue-3' dense fab-mini flat @click='doEdit(cell.row.id)'>
            <q-icon name='edit' style='font-size: 20px' />
            <QTooltip>Editar</QTooltip>
          </QBtn>
          <QBtn v-if='remove' class='text-red'  dense fab-mini flat @click='doRemove(cell.row.id)'>
            <q-icon name='delete' style='font-size: 20px' />
            <QTooltip>Eliminar</QTooltip>
          </QBtn>
        </QTd>
      </template>
    </q-table>
    <div class='q-pa-lg flex flex-center'>
      <QPagination
        v-if='lastpage>0'
        :model-value='current'
        :max='lastpage'
        active-color='black'
        boundary-links
        color='black'
        direction-links/>
    </div>

  </div>
</template>

<script lang='ts'>
import { computed, defineComponent, onMounted, reactive, ref, watch } from 'vue';
import { confirmDialog } from 'src/utils/Alerts';
import { QTable, useQuasar } from 'quasar';
import { checkIfEmpty, makeQueryParam } from 'src/utils/Helpers';
import { api } from 'boot/axios';

export default defineComponent({
  name: 'GenericTableBackend',
  components: {},
  extend: QTable,
  props: {
    columns: {
      type: Array,
      required: true
    },
    pagination: {
      type: [Array, Object, String, Number],
      default() {
        return { rowsPerPage: 10 };
      }
    },
    view: {
      type: Function
    },
    edit: {
      type: Function
    },
    remove: {
      type: Function
    },
    active: {
      type: Function
    },
    platform: {
      type: Function
    },
    payment: {
      type: Function
    },
    prices: {
      type: Function
    },
    values: {
      type: Function
    },
    rowKey: {
      type: String
    },
    endpoint: {
      type: String
    },
    filterSearchCriteria: {
      type: [Array, String]
    },
    filterSearchText: {
      type: String
    },
    filterStatus: {
      type: [String, Object]
    },
    filterModel: {
      type: [String, Object, Array]
    },
    filterEnable: {
      type: Boolean,
      default: false
    }
  },

  setup(props: any, {
    emit
  }) {
    const $q = useQuasar();
    let visible = ref(false);
    let rows = ref<Record<any, any>>([]);
    let _pagination = computed({
      get: () => props.pagination,
      set: (value) => emit('update:pagination', value)
    });
    let _filterStatus = computed({
      get: () => props.filterStatus,
      set: (value) => emit('update:filterStatus', value)
    });
    let _filterPriority = computed({
      get: () => props.filterPriority,
      set: (value) => emit('update:filterPriority', value)
    });
    let filter = ref('');

    // let _filterSearchValue = computed({
    //   get: () => props.filterSearchValue,
    //   set: (value) => emit('update:filterSearchValue', value)
    // });
    let _filterSearchCriteria = computed({
      get: () => props.filterSearchCriteria,
      set: (value) => emit('update:filterSearchCriteria', value)
    });

    let _columns = computed({
      get: () => props.columns,
      set: (value) => emit('update:columns', value)
    });

    function doView(row: bigint) {
      props.view(row);
    }

    function doEdit(row: bigint) {
      // Loading.show()
      $q.loading.show();
      setTimeout(() => {
        // Loading.hide()
        $q.loading.hide();
      }, 1000);
      props.edit(row);
    }

    function doRemove(row: bigint) {
      confirmDialog(() => {
        props.remove(row).then(() => {
          current.value = 1;
          getData(props.endpoint);
        });
      }, 'Eliminar elemento', '¿Está seguro que desea borrar el elemento?');
    }

    function doActive(row: bigint) {
      confirmDialog(() => {
        props.active(row);
        // current.value = 0;
        // current.value = 1;
        getData(props.endpoint);
      }, 'Cambiar estado', '¿Está seguro que desea cambiar el estado del elemento?');
    }


    function doPlatform(row: bigint) {
      props.platform(row);
    }


    function doValues(row: bigint) {
      props.values(row);
    }

    let lastpage = ref(0);

    let current = ref(1);

    onMounted(() => {
      getData(props.endpoint);
    });

    watch(current, (next) => {
      getData(props.endpoint, Number(next));
    });

    //

    function getData(endpoint = '', page = 1) {
      visible.value = true;

      let requestUrl = endpoint + '?page=' + String(page) + filterSearch.value;
      api.get(requestUrl).then(({ data }) => {

        visible.value = false;
        const paginationContext = data.data;
        rows.value = paginationContext;
        if (checkIfEmpty(rows.value)) {
          _columns.value = [];
        }
        lastpage.value = paginationContext.last_page;
        _pagination.value.rowsPerPage = lastpage.value;
      }).catch(() => {
        visible.value = true;
      });
    }

    function doFilter() {
      let filters = '';
      props.filterModel?.forEach((value: { model: any; type: any }) => {
        filters += makeQueryParam(value.model, value.type);
      });
      let searchFilterValues = makeQueryParam(_filterSearchCriteria.value, 'search_criteria');
      let searchFilterText = makeQueryParam(searchText.value, 'search_text');
      filterSearch.value = searchFilterValues + searchFilterText + filters;

      getData(props.endpoint);
    }

    let _filterModel = computed({
      get: () => props.filterModel,
      set: (value) => emit('update:filterModel', value)
    });

    function doClean() {
      searchText.value = '';
    }

    let filterSearch = ref('');
    let searchText = ref('');
    let priority = ref({});
    let status = reactive({});
    let dateFilter = reactive({});
    return {
      _filterModel,
      searchText,
      status,
      _filterStatus,
      _filterPriority,
      doClean,
      doFilter,
      priority,
      dateFilter,
      visible,
      _columns,
      current,
      lastpage,
      doView,
      doEdit,
      doRemove,
      doActive,
      filter,
      doPlatform,
      doValues,
      _pagination,
      rows
    };
  }
});
</script>

<style scoped>

</style>
