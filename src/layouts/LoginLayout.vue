<template>
  <q-layout  class='full-height'> <!-- Be sure to play with the Layout demo on docs -->
    <q-page-container >
<!--      <q-img src='images/fondo.jpg'  />-->

      <q-header style=' height: 50px' bordered>
        <q-toolbar class='bg-white'  >
          <q-toolbar-title >
            <q-img src='https://www.vilab.cl/wp-content/uploads/2021/07/Logo-Vilab-1-transparent-e1627227582118.png' height='50px' width='80px'  style='opacity: 75%'></q-img>
          </q-toolbar-title>
          <span class='text-black text-center'>ViLab SpA</span>
          <q-space/>
        </q-toolbar>
      </q-header>
      <div id='login-layout' >
      <router-view />
      </div>
    </q-page-container>
  </q-layout>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue';

export default defineComponent({
  // name: 'LayoutName',

  setup() {
    const leftDrawer = ref(false);
    return { leftDrawer };
  }
});
</script>

<style scoped>

#login-layout{
  background-image: url('/images/fondo.jpg' ) !important;
  background-size: cover;
  background-repeat: no-repeat;
  height: 100%;
  width: 100%;
}
</style>
