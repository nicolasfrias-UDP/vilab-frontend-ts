<template>
  <div>

    <QCard v-if='filterEnable' bordered class=' q-my-md' flat>
      <QCardSection>
        <div class='row q-col-gutter-md justify-between'>

          <div class='col-md-4 col-xs-12'>
            <q-input v-model='searchText' clearable :placeholder='filterSearchPlaceholder ' dense>
              <template v-slot:before>
                <q-btn round dense flat @click='doFilter' icon="fas fa-search" />
              </template>
            </q-input>
          </div>
          <!--          <div class='col-md-3 col-xs-12 '>-->
          <!--            <DenseSelect v-if='filterStatus' :options='prop_filterStatus' :text.sync='status' label='Estado' map-options-->
          <!--                         option-label='name' option-value='code' />-->
          <!--          </div>-->
        </div>
      </QCardSection>

    </QCard>
    <q-table
      :columns='prop_columns'
      v-model:rows='rows'
      :filter='filter'
      :loading='visible'
      :pagination='prop_pagination'
      :row-key="rowKey?rowKey:'id'"
      table-header-class="text-black text-capitalize text-weight-bold"

      class='q-mt-md'
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
          <QBtn v-if='edit' class='text-blue-3' dense fab-mini flat @click='doEdit(cell.row)'>
            <q-icon name='edit' style='font-size: 20px' />
            <QTooltip>Editar</QTooltip>
          </QBtn>
          <QBtn v-if='remove' class='text-red'  dense fab-mini flat @click='doRemove(cell.row.id)'>
            <q-icon name='delete' style='font-size: 20px' />
            <QTooltip>Eliminar</QTooltip>
          </QBtn>
        </QTd>
      </template>
      <template v-slot:body-cell="props">
         <q-td
         :props="props"
         >
           {{ props.value }}
         <q-popup-edit v-model="rows[props.rowIndex][props.col.name]" buttons>
           <q-input v-model="rows[props.rowIndex][props.col.name]"  dense autofocus counter />
         </q-popup-edit>
         </q-td>
     </template>
    </q-table>
    <div class='q-pa-lg flex flex-center'>
      <QPagination
        v-if='lastpage>0'
        v-model='current'
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
import DenseButton from 'components/buttons/DenseButton.vue';

export default defineComponent({
  name: 'GenericTableBackend',
//components: { DenseButton },
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
    filterSearchPlaceholder: {
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

    let filterSearch = ref('');
    let searchText = ref('');
    let priority = ref({});
    let status = reactive({});
    let dateFilter = reactive({});
    let lastpage = ref(0);
    let current = ref(1);
    let visible = ref(false);
    let rows = ref<Record<any, any>>([]);

    let prop_pagination = computed({
      get: () => props.pagination,
      set: (value) => emit('update:pagination', value)
    });
    let prop_filterStatus = computed({
      get: () => props.filterStatus,
      set: (value) => emit('update:filterStatus', value)
    });
    let prop_filterPriority = computed({
      get: () => props.filterPriority,
      set: (value) => emit('update:filterPriority', value)
    });
    let filter = ref('');

    // let _filterSearchValue = computed({
    //   get: () => props.filterSearchValue,
    //   set: (value) => emit('update:filterSearchValue', value)
    // });
    let prop_filterSearchCriteria = computed({
      get: () => props.filterSearchCriteria,
      set: (value) => emit('update:filterSearchCriteria', value)
    });

    let prop_columns = computed({
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


    onMounted(() => {
      getData(props.endpoint);
    });

    watch(current, (next) => {
      console.log(next);
      getData(props.endpoint, Number(next));
    });

    function doVisibleTable(value){
      visible.value=value
    }

    function getData(endpoint = '', page = 1) {
      doVisibleTable(true);

      let requestUrl = endpoint + '?page=' + String(page) + filterSearch.value;
      api.get(requestUrl).then(({ data }) => {
        doVisibleTable(false);
        const paginationContext = data;
        rows.value = paginationContext.data;
        if (checkIfEmpty(rows.value)) {
          prop_columns.value = [];
        }
        console.log(paginationContext);
        lastpage.value = paginationContext.last_page;
        prop_pagination.value.rowsPerPage = lastpage.value;
      }).catch(() => {
        doVisibleTable(true);
      });
    }

    function doFilter() {
      let filters = '';
        props.filterModel?.forEach((value: { model: any; type: any }) => {
          filters += makeQueryParam(value.model, value.type);
        });
        let searchFilterValues = makeQueryParam(prop_filterSearchCriteria.value, 'search_criteria');
        let searchFilterText = makeQueryParam(searchText.value??'', 'search_text');
        filterSearch.value = searchFilterValues + searchFilterText + filters;

      getData(props.endpoint);
    }

    let prop_filterModel = computed({
      get: () => props.filterModel,
      set: (value) => emit('update:filterModel', value)
    });

    function doClean() {
      searchText.value = '';
    }
    return {
      prop_filterModel,
      searchText,
      status,
      prop_filterStatus,
      prop_filterPriority,
      doClean,
      doFilter,
      priority,
      dateFilter,
      visible,
      prop_columns,
      current,
      lastpage,
      doView,
      doEdit,
      doRemove,
      doActive,
      filter,
      doPlatform,
      doValues,
      prop_pagination,
      rows
    };
  }
});
</script>

<style scoped>

</style>
