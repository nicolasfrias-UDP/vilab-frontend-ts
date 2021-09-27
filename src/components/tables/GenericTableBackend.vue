<template>
  <div>

    <QTable
      :columns='_columns'
      :rows='objData'
      :filter='filter'
      :loading='visible'
      :pagination='_pagination'
      :row-key="rowKey?rowKey:'id'"
      bordered
      class='q-mt-md'
      flat
      loading-label='Loading, please wait...'
      no-data-label='No hay datos que mostrar.'
    >
      <template v-slot:body-cell-prices='cell'>
        <QTd auto-width>
          <li v-for='(item,index) in cell.row.prices' :key='index'>{{ item.interval.name }} - {{ item.name }}
            ({{ item.price }})
            {{ item.currency }})
          </li>
        </QTd>
      </template>
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
          <QBtn v-if='edit' color='black' dense fab-mini flat @click='doEdit(cell.row.id)'>
            <q-icon name='edit' style='font-size: 20px' />
            <QTooltip>Editar</QTooltip>
          </QBtn>
          <QBtn v-if='platform' color='black' dense fab-mini flat @click='doPlatform(cell.row.platform.id)'>
            <q-icon name='fas fa-cog' style='font-size: 20px' />
            <QTooltip>Plataforma</QTooltip>
          </QBtn>
          <QBtn v-if='payment' color='black' dense fab-mini flat @click='doPayment(cell.row.id)'>
            <q-icon name='payments' style='font-size: 20px' />
            <QTooltip>Pagos</QTooltip>
          </QBtn>
          <QBtn v-if='prices' color='black' dense fab-mini flat @click='doPrices(cell.row.id)'>
            <q-icon name='payments' style='font-size: 20px' />
            <QTooltip>Precios</QTooltip>
          </QBtn>
          <QBtn v-if='values' :disabled='!cell.row.show_in_segmentation_value' dense fab-mini flat
                @click='doValues(cell.row.id)'>
            <q-icon name='fas fa-bezier-curve' style='font-size: 20px' />
            <QTooltip>Valores</QTooltip>
          </QBtn>
          <QBtn v-if='remove' color='black' dense fab-mini flat @click='doRemove(cell.row.id)'>
            <q-icon name='delete' style='font-size: 20px' />
            <QTooltip>Eliminar</QTooltip>
          </QBtn>
        </QTd>
      </template>
    </QTable>
    <div class='q-pa-lg flex flex-center'>
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
    let objData = ref([]);
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

    let _filterSearchValue = computed({
      get: () => props.filterSearchValue,
      set: (value) => emit('update:filterSearchValue', value)
    });
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
      $q.loading.show();
      setTimeout(() => {
        $q.loading.hide();
      }, 1000);
      props.edit(row);
    }

    function doRemove(row: bigint) {
      confirmDialog(() => {
        props.remove(row).then(() => {
          // console.log(data);
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

    function doPayment(row: bigint) {
      props.payment(row);
    }

    function doPlatform(row: bigint) {
      props.platform(row);
    }

    function doPrices(row: bigint) {
      props.prices(row);
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

    function getData(endpoint: String, page: Number = 1) {
      visible.value = true;

      let requestUrl = endpoint + '?page=' + page + filterSearch.value;

      console.log(requestUrl);
      api.get(requestUrl).then(({ data }) => {
        visible.value = false;
        const paginationContext = data.data;
        console.log(paginationContext);
        objData.value = paginationContext.data;
        if (checkIfEmpty(objData.value)) {
          console.log(objData);
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
      doPayment,
      filter,
      doPlatform,
      doPrices,
      doValues,
      _pagination,
      objData
    };
  }
});
</script>

<style scoped>

</style>
