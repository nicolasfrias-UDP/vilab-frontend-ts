<template>
  <q-btn color='primary' label='Cambiar idioma' flat no-caps>
    <q-menu>
      <q-list style='min-width: 100px'>
        <q-item clickable v-close-popup>
          <q-item-section>English</q-item-section>
        </q-item>
        <q-item clickable v-close-popup>
          <q-item-section>Español</q-item-section>
        </q-item>
      </q-list>
    </q-menu>
  </q-btn>
</template>

<script lang='ts'>
import { defineComponent } from 'vue';

export default defineComponent({
  setup() {
    console.log('');
  }
});
</script>
