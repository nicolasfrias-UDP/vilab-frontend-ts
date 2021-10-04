<template>
  <q-page padding class='q-pa-md'>

    <VButton text='Agregar predio' @action='addPlot' />
    <br>
    <br>
    <div class='row q-col-gutter-md'>
      <div class='col col-3'>
        <QTable
          style='max-width: 350px;width: 100%'
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
      <div class='col'>
        <l-map ref='mapRef' style='height:800px' :zoom='zoom' :center='geolocationPlot'>
          <l-tile-layer url='https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
                        :max-zoom='18'></l-tile-layer>
          <l-geo-json :geojson='geojson' :options='geojsonOptions' />
          <l-polyline :options="{ position: 'bottomright' }"></l-polyline>
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
            <p-popup :content="label" v-if="mapdata.with_popup"></p-popup>
            <p-tooltip2 :content="label" v-if="mapdata.with_tooltip"></p-tooltip2>
          </l-marker>
        </l-map>
      </div>
    </div>
  </q-page>
</template>

<script lang='ts'>
import { LCircleMarker, LControl, LGeoJson, LMap, LMarker, LPolyline, LTileLayer } from '@vue-leaflet/vue-leaflet';
import { defineComponent, onMounted, ref } from 'vue';
import VButtonIcon from 'components/buttons/VButtonIcon.vue';
import VButton from 'components/buttons/VButtonIcon.vue';

import useCustomRoute from 'src/composables/useCustomRoute';
import PlotService from 'src/services/PlotService';
import IFeatureCollectionGeoJson from 'src/interfaces/IFeatureCollectionGeoJson';

const plotColumns = [
  { name: 'plot', align: 'center', label: 'PREDIO', field: row => row.properties.pre_nombre, sortable: true },
  { name: 'crop', align: 'center', label: 'CULTIVO', field: row => row.properties.cultivo, sortable: false }
];

const plotPagination = {
  sortBy: 'desc',
  rowsPerPage: 15
};

export default defineComponent({
  name: 'PlotIndex',
  components: {
    VButtonIcon,
    VButton,
    LMap,
    LGeoJson,
    LTileLayer,
    LPolyline,
    LControl,
    LCircleMarker,
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

    const plotService = new PlotService();
    let plotsFeatureCollection = ref<IFeatureCollectionGeoJson>({});

    const { toRoute } = useCustomRoute();

    function submit() {
      console.log('submit');
    }

    function addPlot() {
      toRoute('plot.add');
    }

    function rowClick(evt: any, row) {
      void evt;

      let plotId = row.properties.pre_id;
      geolocationPlot.value = [row.properties.pre_lat, row.properties.pre_long];
      zoom.value = 8;

      console.log(geolocationPlot.value);
      console.log(mapRef.value.zoom);
    }

    onMounted(async () => {
      await plotService.getList();
      plotsFeatureCollection.value = plotService.getPlotFeatureCollection();
      console.log(plotsFeatureCollection.value.features);
      plotData.value = plotsFeatureCollection.value.features;
    });

    return {
      submit,
      addPlot,
      plotsFeatureCollection, plotColumns,
      plotData, plotPagination,
      geolocationPlot,
      rowClick,
      zoom,
      mapRef,
      filter
    };
  }
});
</script>
