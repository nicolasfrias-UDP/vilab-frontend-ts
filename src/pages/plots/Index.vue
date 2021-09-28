<template>
  <q-page class='q-ma-md' >


    <q-form ref='myform' class='q-gutter-md' @submit='submit'>
      <span class='text-h5'>Crear predio</span>
      <div class='row'>
        <div class='col-12 col-md-5 col-sm-12 q-mr-md q-mt-md'>
          <q-input rounded outlined v-model='title' label='Nombre de predio' />
        </div>
        <div class='col-12 col-md-5 col-sm-12 q-mr-md q-mt-md'>

          <q-input rounded outlined v-model='route' label='Tipo de cultivo' />
        </div>
      </div>
      <div class='row'>
        <div class='col-12 col-md-5 col-sm-12 q-mr-md '>
          <q-input rounded outlined v-model='title' label='Variedades' />
        </div>
        <div class='col-12 col-md-5 col-sm-12 q-mr-md'>

          <q-input rounded outlined v-model='route' label='Area (m2)' type='number' />
        </div>
      </div>

      <div class='row'>
        <div class='col-12 col-md-5 col-sm-12 q-mr-md '>
            <q-select rounded outlined v-model='title' label='Estación metereológica' />
        </div>
        <div class='col-12 col-md-5 col-sm-12 q-mr-md'>

          <q-input rounded outlined v-model='route' label='Escala' type='number' />
        </div>
      </div>
      <div class='row'>
        <div class='col-12 col-md-5 col-sm-12 q-mr-md '>
            <q-select rounded outlined v-model='title' label='Comuna' />
        </div>
        <div class='col-12 col-md-5 col-sm-12 q-mr-md'>

          <q-input rounded outlined v-model='route' label='Región' />
        </div>
      </div>
      <div class='row'>
        <div class='col-12 col-md-5 col-sm-12 q-mr-md '>
          <q-input rounded outlined    :rules="['date']" label='Fecha de plantación'>
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy ref="qDateProxy" transition-show="scale" transition-hide="scale">
                  <q-date v-model="date">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
        </div>
        <div class='col-12 col-md-5 col-sm-12 q-mr-md'>

          <q-select rounded outlined v-model='route' label='Estado' :options='["activo","inactivo"]' />
        </div>
      </div>
      <div class='row'>
        <div class='col-12 col-md-5 col-sm-12 q-mr-md '>
            <q-date rounded outlined v-model='title' label='División' />
        </div>
        <div class='col-12 col-md-5 col-sm-12 q-mr-md'>

          <q-select rounded outlined v-model='route' label='Tamaño'  type='number'/>
        </div>
        <div class='col-12 col-md-5 col-sm-12 q-mr-md'>

          <q-select rounded outlined v-model='route' label='Lote' />
        </div>
      </div>

      <q-btn type='submit' color='secondary' icon='far fa-save' label='Guardar' rounded />


    </q-form>
    <br>
    <l-map style="height:500px" :zoom="5" :center="[-33.4430, -70.6538]">
    <l-tile-layer url='https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}'
                  :max-zoom="18"></l-tile-layer>
    <l-geo-json :geojson="geojson" :options="geojsonOptions"/>
    <l-polyline :options="{ position: 'bottomright' }"></l-polyline>
    <l-control position="bottomleft">
      <button @click="clickHandler">
        I am a useless button!
      </button>
    </l-control>
    <l-marker :lat-lng="[-33.4430, -70.6538]"></l-marker>
    <l-circle-marker :lat-lng="[-33.4430, -70.6538]" :radius="50" color="red"/>
  </l-map>
  </q-page>
</template>

<script lang="ts">
import { LCircleMarker, LControl, LGeoJson, LMap, LMarker, LPolyline, LTileLayer } from '@vue-leaflet/vue-leaflet'
import { defineComponent } from 'vue'
export default defineComponent({
  name: 'PlotIndex',
  components: {
    LMap,
    LGeoJson,
    LTileLayer,
    LPolyline,
    LControl,
    LCircleMarker,
    LMarker
  },
  data () {
    return {
      geojson: {
        type: 'FeatureCollection',
        features: []
      },
      geojsonOptions: {
        pointToLayer: Object
      }
    }
  },
  async beforeMount () {
    // HERE is where to load Leaflet components!
    // const { circleMarker } = await import('leaflet/dist/leaflet-src.esm')

    // And now the Leaflet circleMarker function can be used by the options:
    // this.geojsonOptions.pointToLayer = (latLng) =>
    //   circleMarker(latLng, { radius: 8 })
  },
  setup(){
    function submit(){
      console.log("submit");
    }

    return {
      submit
    }
  }
})
</script>
