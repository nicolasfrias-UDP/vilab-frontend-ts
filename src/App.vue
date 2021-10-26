<template>
  <router-view />
</template>
<script lang='ts'>
import { defineComponent } from 'vue';

import 'leaflet';
import 'leaflet-measure';
import 'leaflet-measure/dist/leaflet-measure.css';
import 'leaflet/dist/leaflet.css';
import 'leaflet/dist/leaflet-src.esm';
import 'leaflet.markercluster';
import 'leaflet.markercluster/dist/leaflet.markercluster.js';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';
import 'leaflet-fullscreen/dist/leaflet.fullscreen.css';
import 'leaflet-fullscreen/dist/Leaflet.fullscreen.min.js';
import './Control.FullScreen.js'
export default defineComponent({
  name: 'App'
});
</script>
