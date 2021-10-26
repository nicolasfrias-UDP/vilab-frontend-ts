<template>
  <q-page padding>

    <div class='row q-mb-md justify-between'>
      <div class='col col-md-7 col-xs-6 text-h5 text-bold'>Proyectos</div>
      <div class='col q-gutter-md col-2 col-md-2 col-xs-12'>
        <div class='text-bold '>
          <span class='text-green  text-h4'>{{ totalPlots }}</span>
          Proyectos
        </div>
        <div class='text-bold '>
          <span class='text-green  text-h4' style='text-overflow: ellipsis; overflow:hidden'>{{ totalHectare }}</span>
          Hectáreas
        </div>
      </div>

    </div>
    <q-separator />
    <br>
    <div class='row justify-between q-col-gutter-xs'>
      <div class='col-2 col-md-2 col-xs-12'>
        <QSelect label='Temporada' :options='projectOptions.season' map-options dense rounded standout
                 v-model='projectOptionsModel.season' bg-color='grey-3'
                 label-color='black'>
        </QSelect>
      </div>
      <div class='col-2 col-md-2 col-xs-12'>
        <QSelect :options='projectOptions.options' label='Opciones'
                 v-model='projectOptionsModel.options' bg-color='grey-3' label-color='black'
                 multiple
                 rounded
                 standout
                 emit-value
                 map-options
                 dense
        >
          <template v-slot:option='{ itemProps, opt, selected, toggleOption }'>
            <q-item v-bind='itemProps'>
              <q-item-section>
                <q-item-label v-html='opt.label' />
              </q-item-section>
              <q-item-section side>
                <q-toggle :model-value='selected' @update:model-value='toggleOption(opt)' />
              </q-item-section>
            </q-item>
          </template>
        </QSelect>
      </div>
    </div>
    <br>

    <q-separator />
    <br>
    <div class='row q-col-gutter-md'>
      <div class='col col-4 col-md-4 col-sm-12 col-xs-12'>
        <QTable
          style='width: 100%;max-height: 700px'
          title='Predios'
          :columns='plotColumns'
          :filter='filter'
          :rows='plotData' :pagination='plotPagination'
          @row-click='rowClick'
        >
          <template v-slot:top-right>
            <q-input borderless dense debounce='300' v-model='filter' placeholder='Search'>
              <template v-slot:append>
                <q-icon name='search' />
              </template>
            </q-input>
          </template>
        </QTable>
      </div>

      <q-btn label='CLICK HERE' @click='toggleApi'/>

      <div class='col' style='width: 100%;'>
          <div class="fullscreen-wrapper">
          <l-map ref='mapRef' id='mapRef'
                 style='height:700px' :zoom='zoom' @ready='onLeafletReady'
                 @click='onLeafletClick'>

            <template v-if='leafletReady'>
              <l-tile-layer url='https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
                            :max-zoom='20' layer-type='base'>
                <l-popup :lat-lng='mapPopUp.coord' :content='mapPopUp.content'></l-popup>
              </l-tile-layer>
              <l-geo-json :geojson='geoJSONObject' :options='geoJSONOptions' />
              <l-control position='topright'>
                <VButtonIcon round class='bg-white text-blue-7' icon-name='fas fa-map-pin' tooltip='Agregar'>
                </VButtonIcon>
              </l-control>
              <l-control position='topright'>
                <VButtonIcon round class='bg-white text-blue-7 ' icon-name='layers'>
                </VButtonIcon>
              </l-control>
              <l-control position='topright'>
                <VButtonIcon round class='bg-white text-blue-7' icon-name='open_in_full'>
                </VButtonIcon>
              </l-control>
              <l-control position='topright'>
                <VButtonIcon round class='bg-white text-blue-7' icon-name='my_location'
                             @click='navigateToCoord(geolocation.latitude,geolocation.longitude)'>
                </VButtonIcon>
              </l-control>
              <l-control position='topright'>
                <VButtonIcon round class='bg-white text-blue-7' icon-name='fas fa-ruler' tooltip='Medir'>
                </VButtonIcon>
              </l-control>

              <l-image-overlay v-if="$store.getters['project/getProjectIndexImage'].png"
                               :url="$store.getters['project/getProjectIndexImage'].png"
                               :bounds="$store.getters['project/getProjectIndexImage'].bounds"></l-image-overlay>


              <l-marker v-for='(feature,index) in plotData' :key='index'
                        :lat-lng='[feature.geometry.coordinates[1],feature.geometry.coordinates[0]]'>
                <l-popup>
                  <h5><b>{{ feature.properties.pre_nombre }}</b></h5>
                  <b>Comuna:</b> {{ feature.properties.comuna }}<br>
                  <b>Cultivo:</b> {{ feature.properties.cultivo }}<br>
                  <b>Variedad:</b> {{ feature.properties.variedad }}<br>
                  <b>Región:</b> {{ feature.properties.region }}<br>
                  <b>Provincia:</b> {{ feature.properties.provincia }}
                </l-popup>
              </l-marker>
            </template>
          </l-map>
          </div>
      </div>
      <div class='col col-3 col-md-3 col-sm-12 col-xs-12'>
        <fs v-model:fullscreen='fullscreen' :teleport='teleport' :page-only='pageOnly'>
        <PropertyCharacteristic />
        </fs>
      </div>
    </div>
  </q-page>
</template>

<script lang='ts'>

import HighCharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { LControl, LGeoJson, LImageOverlay, LMap, LMarker, LPopup, LTileLayer } from '@vue-leaflet/vue-leaflet';
import { defineComponent, nextTick, onMounted, provide, reactive, ref, toRefs, watch } from 'vue';
import useCustomRoute from 'src/composables/useCustomRoute';
import IFeatureCollectionGeoJson from 'src/interfaces/IFeatureCollectionGeoJson';
import PropertyCharacteristic from 'components/plot/PropertyCharacteristic.vue';
import VButtonIcon from 'components/buttons/VButtonIcon.vue';
import useLandLot from 'src/composables/useLandLot';
import useProjects from 'src/composables/useProjects';
import { useStore } from 'src/store';
import useGeolocation from 'src/composables/useGeolocation';
import 'leaflet-measure';
import 'leaflet-measure/dist/leaflet-measure';
import 'leaflet-measure/dist/leaflet-measure.css';
import 'leaflet/dist/leaflet.css';

const L = require('leaflet');
require('vue2-leaflet/dist/vue2-leaflet.min');


HighchartsMore(HighCharts);
const options = {
  position: 'topleft',            // Position to show the control. Values: 'topright', 'topleft', 'bottomright', 'bottomleft'
  unit: 'kilometres',             // Show imperial or metric distances. Values: 'kilometres', 'landmiles', 'nauticalmiles'
  clearMeasurementsOnStop: true,  // Clear all the measurements when the control is unselected
  showBearings: false,            // Whether bearings are displayed within the tooltips
  bearingTextIn: 'In',            // language dependend label for inbound bearings
  bearingTextOut: 'Out',          // language dependend label for outbound bearings
  tooltipTextFinish: 'Click to <b>finish line</b><br>',
  tooltipTextDelete: 'Press SHIFT-key and click to <b>delete point</b>',
  tooltipTextMove: 'Click and drag to <b>move point</b><br>',
  tooltipTextResume: '<br>Press CTRL-key and click to <b>resume line</b>',
  tooltipTextAdd: 'Press CTRL-key and click to <b>add point</b>',
  // language dependend labels for point's tooltips
  measureControlTitleOn: 'Turn on PolylineMeasure',   // Title for the Measure Control going to be switched on
  measureControlTitleOff: 'Turn off PolylineMeasure', // Title for the Measure Control going to be switched off
  measureControlLabel: '&#8614;', // Label of the Measure Control (Unicode symbols are possible)
  measureControlClasses: [],      // Classes to apply to the Measure Control
  showClearControl: false,        // Show a control to clear all the measurements
  clearControlTitle: 'Clear Measurements', // Title text to show on the Clear Control
  clearControlLabel: '&times',    // Label of the Clear Control (Unicode symbols are possible)
  clearControlClasses: [],        // Classes to apply to Clear Control
  showUnitControl: false,         // Show a control to change the units of measurements
  useSubunits: true,              // Use subunits (metres/feet) in tooltips if distances are less than 1 kilometre/landmile
  unitControlTitle: {             // Title texts to show on the Unit Control
    text: 'Change Units',
    kilometres: 'kilometres',
    landmiles: 'land miles',
    nauticalmiles: 'nautical miles'
  },
  unitControlLabel: {             // Unit symbols to show in the Unit Control and measurement labels
    metres: 'm',
    kilometres: 'km',
    feet: 'ft',
    landmiles: 'mi',
    nauticalmiles: 'nm'
  },
  unitControlClasses: [],         // Classes to apply to the Unit Control
  tempLine: {                     // Styling settings for the temporary dashed line
    color: '#00f',              // Dashed line color
    weight: 2                   // Dashed line weight
  },
  fixedLine: {                    // Styling for the solid line
    color: '#006',              // Solid line color
    weight: 2                   // Solid line weight
  },
  startCircle: {                  // Style settings for circle marker indicating the starting point of the polyline
    color: '#000',              // Color of the border of the circle
    weight: 1,                  // Weight of the circle
    fillColor: '#0f0',          // Fill color of the circle
    fillOpacity: 1,             // Fill opacity of the circle
    radius: 3                   // Radius of the circle
  },
  intermedCircle: {               // Style settings for all circle markers between startCircle and endCircle
    color: '#000',              // Color of the border of the circle
    weight: 1,                  // Weight of the circle
    fillColor: '#ff0',          // Fill color of the circle
    fillOpacity: 1,             // Fill opacity of the circle
    radius: 3                   // Radius of the circle
  },
  currentCircle: {                // Style settings for circle marker indicating the latest point of the polyline during drawing a line
    color: '#000',              // Color of the border of the circle
    weight: 1,                  // Weight of the circle
    fillColor: '#f0f',          // Fill color of the circle
    fillOpacity: 1,             // Fill opacity of the circle
    radius: 3                   // Radius of the circle
  },
  endCircle: {                    // Style settings for circle marker indicating the last point of the polyline
    color: '#000',              // Color of the border of the circle
    weight: 1,                  // Weight of the circle
    fillColor: '#f00',          // Fill color of the circle
    fillOpacity: 1,             // Fill opacity of the circle
    radius: 3                   // Radius of the circle
  }
};

const plotColumns = [
  { name: 'plot', align: 'center', label: 'PREDIO', field: row => row.properties.pre_nombre, sortable: true },
  { name: 'crop', align: 'center', label: 'CULTIVO', field: row => row.properties.cultivo, sortable: false }
];

const plotPagination = {
  sortBy: 'desc',
  descending: false,
  rowsPerPage: 15
};

export default defineComponent({
  name: 'PlotIndex',
  components: {
    VButtonIcon,
    PropertyCharacteristic,
    LMap,
    LGeoJson,
    LTileLayer,
    LControl, LPopup,
    LMarker, LImageOverlay
  },
  setup(props) {
    void props;

    const state = reactive({
      fullscreen: false,
      teleport: true,
      pageOnly: false
    });
    let mapPopUp = reactive({
      coord: [-32.80718755615862, -70.82175809968166],
      content: 'hello'
    });
    let leafletObject = ref<any>(null);
    let leafletReady = ref(false);
    let geoJSONObject = ref<any>(null);
    let geoJSONOptions = reactive({
      pointToLayer: Object,
      style: {
        'color': '#FFFFFF',
        'weight': 2,
        'opacity': 1,
        'fillOpacity': 0
      }
    });
    const plotData = ref();
    const geolocationPlot = ref([
      -32.227609138, -70.824386972]);
    const zoom = ref(7);
    const mapRef = ref();
    const filter = ref();
    const markerPopup = ref();
    const totalPlots = ref();
    const totalHectare = ref();
    const projectKml = ref<any>(null);
    const projectOptions = {
      season: [{ label: 'Temporada actual', value: 1 }],
      options: [
        { label: 'Mostrar lista', value: 1 },
        { label: 'Mostrar marcadores', value: 2 },
        { label: 'Mostrar proyecto', value: 3 }
      ]
    };
    const projectOptionsModel = reactive<any>({
      season: 1,
      options: []
    });

    let plotsFeatureCollection = ref<IFeatureCollectionGeoJson>({});

    const { toRoute } = useCustomRoute();
    const { landLot } = useLandLot();

    const useProject = new useProjects();
    const store = useStore();

    function addPlot() {
      toRoute('plot.add');
    }


    function rowClick(evt: any, row) {
      void evt;

      geolocationPlot.value = [];
      landLot.value = {};
      mapRef.value.leafletObject.setView([row.properties.pre_lat, row.properties.pre_long], 15);
      landLot.value = row;

    }

    watch(projectOptionsModel, async (value: any) => {

      if (value.options.includes(1)) { //desactivar mostrar lista

      }

      if (value.options.includes(2)) { //desactivar mostrar marcadores

      }

      if (value.options.includes(3)) { //mostrar predio

        const projectGeoJSON = await useProject.fetchProjectKml(landLot.value?.properties?.pre_id);
        geoJSONObject.value = projectGeoJSON;
        navigateToCoord(-32.81298707, -70.824951152);
      } else if (!value.options.includes(3)) {
        geoJSONObject.value = null;
      }
    });
    const { initGeolocationProcess, geolocation } = useGeolocation();
    onMounted(async () => {
      projectOptionsModel.options = [1, 2];//Opciones seleccionadas por defecto
      await useProject.getList();
      await useProject.fetchProjectListPaginate(15, 55, 1, 'asc', ''); // Obtener predios por paginacion
      const plotResponse = useProject.getPlotResponse();
      totalPlots.value = plotResponse.value.datos_usuario[0].cantidad;
      totalHectare.value = plotResponse.value.datos_usuario[0].hectareas;
      plotsFeatureCollection.value = useProject.getPlotFeatureCollection(); // Obtener FeatureCollection de predios
      plotData.value = plotsFeatureCollection.value.features;
      goToLeafletRoute(plotData.value[0]); // Seleccionar primer valor del array de predios
      initGeolocationProcess();
    });

    function goToLeafletRoute(projectValue) {
      let coord = [projectValue.properties.pre_lat, projectValue.properties.pre_long];
      mapRef.value.leafletObject.setView(coord, 15);
      landLot.value = projectValue;
    }

    function navigateToCoord(lat: number, long: number) {
      mapRef.value.leafletObject.setView([lat, long], 15);
    }


    function onLeafletReady() {
      void nextTick(() => {
        leafletObject.value = mapRef.value.leafletObject;
        leafletReady.value = true;

      });
    }
    function doFullscreen(){
      // Object.assign(state,{fullscreen: true})
      mapRef.value.requestFullscreen()

      console.log(state);
    }
    function onLeafletClick(e: any) {

      if (e.latlng) {
        console.log(e.latlng);
        Object.assign(mapPopUp, {
          coord: [e.latlng.lat, e.latlng.lng],
          content: 'Hello'
        });
      }
      //
      // if (e.pageY && e.pageX){
      //   console.log(e.pageX);
      //   console.log(e.pageY);
      //   // console.log(document.-e.pageX);
      //   console.log(window.innerHeight-e.pageY);
      //   // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      //   divMap.value.style.position='absolute'
      //   divMap.value.style.zIndex='9999'
      //   divMap.value.style.width='100px'
      //   divMap.value.style.height='100px'
      //   divMap.value.style.backgroundColor='white'
      //   // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      //   divMap.value.style.left=e.clientX+'px'
      //   // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      //   divMap.value.style.top=e.clientY+'px'
      //   divMap.value.innerHTML="my <b>GAAAAAAAAAA</b></large>";
      // }
    }


//Inject to children
    provide('PlotServiceProvider', landLot);

    return {
      doFullscreen,
      addPlot,
      ...toRefs(state),
      plotsFeatureCollection, plotColumns,
      plotData, plotPagination,
      geolocationPlot,
      rowClick,
      zoom,
      mapRef,
      filter,
      markerPopup,
      totalPlots,
      totalHectare,
      landLot,
      projectOptions,
      projectOptionsModel,
      projectKml,
      geoJSONObject,
      geoJSONOptions,
      onLeafletReady,
      onLeafletClick,
      leafletReady,
      mapPopUp,
      navigateToCoord,
      geolocation
    };
  }
});
</script>

<style>
@import '~leaflet/dist/leaflet.css';
@import "~leaflet.markercluster/dist/MarkerCluster.css";
@import "~leaflet.markercluster/dist/MarkerCluster.Default.css";
@import "~leaflet-measure/dist/leaflet-measure.css";

.vue-highcharts {
  width: 100%;
}
</style>
