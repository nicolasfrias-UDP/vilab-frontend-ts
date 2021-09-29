<template>
  <QBtn class="btn-default" label="Cancelar" size="md"
        @click="$router.back()"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'CancelButton'
})
</script>
