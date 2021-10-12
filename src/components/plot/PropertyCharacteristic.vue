<template>
  <q-card style='width: 100%'>
    <q-card-section>
      <div class='text-h6 '>
        <span class='text-grey-7'>Predio: &nbsp;</span>
        <span class='text-h5 text-weight-bold'>{{ propertyDescription.pre_nombre }}</span>
      </div>
    </q-card-section>
    <q-card-section class='q-ma-none q-pa-none'>
      <q-splitter
        v-model='splitterModel'
        horizontal
      >

        <template v-slot:before>
          <q-tabs
            v-model='propertyCharacteristicTab'
            class='text-green'
            no-caps
          >
            <q-tab name='indices' icon='fas fa-chart-area' label='Indices'>
            </q-tab>
            <q-tab name='general' icon='fas fa-home' label='General' />
          </q-tabs>
        </template>
        <template v-slot:after>
          <q-tab-panels
            v-model='propertyCharacteristicTab'
            animated
            swipeable
            transition-prev='jump-up'
            transition-next='jump-up'
          >
            <q-tab-panel name='indices'>

              <div class='row'>
                <div class='col q-mb-md'>

                  <q-select dense v-model='selectIndexModel' map-options :options='propertyIndexOptions'
                            label='Seleccionar indices'
                            :options-html='optionsHtml' />
                </div>
              </div>
              <div class='row'>
                <div class='col q-mb-md'>
                  <VButtonDate v-model:date='propertyDateModel' v-model:options='propertyDateOptions' />
                </div>
              </div>

              <vue-highcharts
                type='chart'
                style='width: 100%;'
                :options='chartOptions'
                :redrawOnUpdate='true'
                :oneToOneUpdate='false'
                :animateOnUpdate='true' />
              <span class='text-uppercase'>Leyenda</span>
              <q-separator />
              <div class='row'>
                <div class='col '>
                  <span class='text-h6 text-bold'>Promedio: </span>
                </div>
                <div class='col text-center q-mt-xs'>
                  <span>{{legendAverage}}</span>
                </div>
              </div>

            </q-tab-panel>
            <q-tab-panel name='general'>
              <span>Información general del predio:</span>
              <ul>
                <li><span class='text-bold '>Cultivo:</span>{{ propertyDescription.cultivo }}</li>
                <li><span class='text-bold '>Variedad: </span>{{ propertyDescription.variedad }}</li>
                <li><span class='text-bold '> Ubicación:</span>
                  <ul>
                    <li><span class='text-bold '>Región:</span> {{ propertyDescription.region }}</li>
                    <li><span class='text-bold '>Provincia:</span> {{ propertyDescription.provincia }}</li>
                    <li><span class='text-bold '>Comuna:</span> {{ propertyDescription.comuna }}</li>
                  </ul>

                </li>
                <li><span class='text-bold '>Area:</span>{{ propertyDescription.area }}</li>
                <li><span class='text-bold '>Fecha de plantación:</span></li>
              </ul>
            </q-tab-panel>
          </q-tab-panels>
        </template>

      </q-splitter>

    </q-card-section>
  </q-card>
</template>

<script lang='ts'>
import VueHighcharts from 'vue3-highcharts';
import exporting from 'highcharts/modules/exporting';
import offlineExporting from 'highcharts/modules/offline-exporting';
import Highcharts from 'highcharts';
import stockInit from 'highcharts/modules/stock';
import { computed, defineComponent, inject, reactive, ref, watch } from 'vue';
import VButtonDate from 'components/date/VButtonDate.vue';
import useAverageIndexLandLot from 'src/composables/useAverageIndexLandLot';
import moment from 'moment';
import { date } from 'quasar';
import useIndicatorLandPlot from 'src/composables/useIndicatorLandPlot';

stockInit(Highcharts);
exporting(Highcharts);
offlineExporting(Highcharts);


const propertyIndexOptions = [
  { label: '<span class="text-caption text-black">Índices</span>', value: null, html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [NDVI]</span>', value: 'ndvi', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [NDRE]</span>', value: 'ndre', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [MSAVI2]</span>', value: 'msavi2', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Estrés hídrico [NDII]</span>', value: 'ndii', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Estrés hídrico [NDWI]</span>', value: 'ndwi', html: true },
  { label: '<span class="text-caption text-black">Anomalías</span>', value: null, html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [NDVI]</span>', value: 'v_ndvi', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [NDRE]</span>', value: 'v_ndre', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Vegetación [MSAVI2]</span>', value: 'v_msavi2', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Estrés hídrico [NDII]</span>', value: 'v_ndii', html: true },
  { label: '<span class="text-caption text-grey-7 q-ml-md">Estrés hídrico [NDWI]</span>', value: 'v_ndwi', html: true }
];

export default defineComponent({
  components: {
    VButtonDate,

    VueHighcharts
  },
  setup() {

    const chartOptions = {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false,
            format: '<b>{point.name}</b>: {point.percentage:.1f} %'
          }
        }
      },
      series: [{
        name: 'Brands',
        colorByPoint: true,
        data: [{
          name: 'Chrome',
          y: 61.41,
          sliced: true,
          selected: true
        }, {
          name: 'Internet Explorer',
          y: 11.84
        }, {
          name: 'Firefox',
          y: 10.85
        }, {
          name: 'Edge',
          y: 4.67
        }]
      }]
    };
    const propertyCharacteristicTab = ref('indices');
    const splitterModel = ref(12);
    const selectIndexModel = ref(null);
    const optionsHtml = ref(false);

    const propertyDateModel = ref('');
    const propertyDateOptions = ref<Array<string>>([]);
    const propertyDateConvert = ref<any>([]);

    const legendAverage = ref('');


    const { getIndicators, getIndicatorsLegend } = useIndicatorLandPlot();
    const plotServiceProvider: any = inject('PlotServiceProvider');
    let propertyDescription = reactive({
      pre_nombre: '',
      cultivo: '',
      variedad: '',
      region: '',
      provincia: '',
      comuna: '',
      area: '',
      pre_id: ''
    });

    watch(plotServiceProvider, (val) => {
      Object.assign(propertyDescription, val.properties);
      for (const valKey in propertyDescription) {
        if (!propertyDescription[valKey]) propertyDescription[valKey] = '-';
      }
    });

    const { getAvgIndex, avgIndex } = useAverageIndexLandLot();
    watch(selectIndexModel, async (val: any) => {
      if (val && propertyDescription.pre_id) {
        await getAvgIndex(propertyDescription.pre_id, val.value);
      }
    });

    watch(avgIndex, (val: Array<string>) => {
      propertyDateOptions.value = [];
      propertyDateConvert.value = [];
      val.forEach((value) => {
        let date = moment(value[0]).format('YYYY/MM/DD');
        propertyDateOptions.value.push(date);
        propertyDateConvert.value.push({ date, avg: value[1] });
      });
      propertyDateModel.value = moment(propertyDateOptions.value.reverse()[0]).format("DD/MM/YYYY");
    });

    // eslint-disable-next-line @typescript-eslint/require-await
    watch(propertyDateModel, async(value) => {
      if (value){
        let normalizeDate=date.formatDate(value.split('/').reverse().join('/'),'YYYY/MM/DD')
        let finder=propertyDateConvert.value.find((val)=>{
          return val.date===normalizeDate
        })
        legendAverage.value=finder?.avg
        let normalizeDateWithDash= date.formatDate(normalizeDate,'YYYY-MM-DD')

        let selectedIndex:any=selectIndexModel.value
        await getIndicators(propertyDescription.pre_id,selectedIndex.value,normalizeDateWithDash,normalizeDateWithDash,normalizeDateWithDash)
        await getIndicatorsLegend(propertyDescription.pre_id,selectedIndex.value,normalizeDateWithDash,normalizeDateWithDash,normalizeDateWithDash)
      }else{
        legendAverage.value=''
      }



    });

    return {
      propertyCharacteristicTab,
      splitterModel,
      chartOptions,
      propertyIndexOptions,
      selectIndexModel,
      optionsHtml, plotServiceProvider,
      propertyDescription,
      avgIndex,
      propertyDateModel,
      propertyDateOptions,
      legendAverage
    };
  }
});
</script>
