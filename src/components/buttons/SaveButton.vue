<template>
        <QBtn class="btn-default" label="Guardar" size="md"
              type="submit" :loading="$store.state['user/buttonLoadingState']" />
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { useStore } from 'vuex'
export default defineComponent({
  name: 'SaveButton',
  props: {
    loading: {
      type: Boolean,
      default: false
    }
  }
})
</script>
