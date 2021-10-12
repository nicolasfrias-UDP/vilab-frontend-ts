<template>
  <q-page padding>


    <span class='text-h5'>Proyectos</span>
    <q-separator />
    <div class='row justify-between'>
      <div class='col q-pt-md'>
        <VButton text='Agregar predio' class='flex-center ' @action='addPlot' />
      </div>
      <div class='flex q-gutter-md justify-end col-4'>
        <span class='text-bold'>
          <div class='text-green text-h5'>
            {{ totalPlots }}
          </div>
          Predios
        </span>
        <span class='text-bold'>
          <div class='text-green text-h5'>
            {{ totalHectare }}
          </div>
          Hectáreas
        </span>
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
      <div class='col' style='width: 100%;'>
        <l-map ref='mapRef' id='mymap' style='height:700px' :zoom='zoom' :center='geolocationPlot'>
          <l-tile-layer url='https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
                        :max-zoom='20'></l-tile-layer>
          <l-geo-json :geojson='geojson' :options='geojsonOptions' />
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
            <VButtonIcon round class='bg-white text-blue-7' icon-name='my_location'>
            </VButtonIcon>
          </l-control>
          <l-control position='topright'>
            <VButtonIcon round class='bg-white text-blue-7' icon-name='fas fa-ruler' tooltip='Medir'>
            </VButtonIcon>
          </l-control>
          <l-marker :lat-lng='geolocationPlot'>
            <l-popup>
              <div v-html='markerPopup'></div>
            </l-popup>
          </l-marker>
          <!--          <l-control-polyline-measure />-->
        </l-map>
      </div>
      <div class='col col-3 col-md-3 col-sm-12 col-xs-12'>

        <PropertyCharacteristic />
      </div>
    </div>
  </q-page>
</template>

<script lang='ts'>

import HighCharts from 'highcharts';
import HighchartsMore from 'highcharts/highcharts-more';
import { LControl, LGeoJson, LMap, LMarker, LPopup, LTileLayer } from '@vue-leaflet/vue-leaflet';
import { defineComponent, onMounted, provide, ref } from 'vue';
import VButton from 'components/buttons/VButton.vue';
import useCustomRoute from 'src/composables/useCustomRoute';
import PlotService from 'src/services/PlotService';
import IFeatureCollectionGeoJson from 'src/interfaces/IFeatureCollectionGeoJson';
import LPolylineMeasure from 'leaflet.polylinemeasure';
import PropertyCharacteristic from 'components/plot/PropertyCharacteristic.vue';
import VButtonIcon from 'components/buttons/VButtonIcon.vue';
import useLandLot from 'src/composables/useLandLot';
import useIndicatorLandPlot from 'src/composables/useIndicatorLandPlot';

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
    VButton,
    LMap,
    LGeoJson,
    LTileLayer,
    LControl, LPopup,
    LMarker
  },
  data() {
    return {
      geojson: {
        type: 'FeatureCollection',
        features: []
      },
      geojsonOptions: {
        pointToLayer: Object
      }
    };
  },
  async beforeMount() {
    // HERE is where to load Leaflet components!
    // const { circleMarker } = await import('leaflet/dist/leaflet-src.esm')

    // And now the Leaflet circleMarker function can be used by the options:
    // this.geojsonOptions.pointToLayer = (latLng) =>
    //   circleMarker(latLng, { radius: 8 })

  },
  setup() {

    const plotData = ref();
    const geolocationPlot = ref([
      -32.227609138, -70.824386972]);
    const zoom = ref(7);
    const mapRef = ref();
    const filter = ref();
    const markerPopup = ref();
    const totalPlots = ref();
    const totalHectare = ref();
    const plotService = new PlotService();
    let plotsFeatureCollection = ref<IFeatureCollectionGeoJson>({});

    const { toRoute } = useCustomRoute();

    const { saveLandLot, landLot } = useLandLot();
    // var myMap = L.map('mymap', options);
    // L.control.polylineMeasure(options).addTo(mapRef.value.mapObject);


    function addPlot() {
      toRoute('plot.add');
    }

    async function rowClick(evt: any, row) {
      void evt;
      geolocationPlot.value = [row.properties.pre_lat, row.properties.pre_long];
      zoom.value = 8;
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      markerPopup.value = `<h4>${row.properties.pre_nombre}</h4>  <hr/> <b>Cultivo:</b>  ${row.properties.cultivo} `;
      landLot.value = row;
    }

    onMounted(async () => {
      await plotService.getList();
      const plotResponse = plotService.getPlotResponse();
      plotsFeatureCollection.value = plotService.getPlotFeatureCollection();
      plotData.value = plotsFeatureCollection.value.features;
      totalPlots.value = plotResponse.value.datos_usuario[0].cantidad;
      totalHectare.value = plotResponse.value.datos_usuario[0].hectareas;
      mapRef.value.mapObject = new LPolylineMeasure(options);
    });

//Inject to children
    provide('PlotServiceProvider', landLot);

    return {
      addPlot,
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
      landLot
    };
  }
});
</script>

<style>
@import '~leaflet/dist/leaflet.css';

.vue-highcharts {
  width: 100%;
}
</style>
