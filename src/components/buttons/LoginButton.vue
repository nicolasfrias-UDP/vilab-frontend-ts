<template>
  <q-btn :label='textInput' :loading='loading' class='btn-default' rounded size='large' unelevated @click='isClicked' />
</template>

<script lang='ts'>
import { computed, defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'LoginButton',
  props: {
    text: {
      type: String,
      required: true
    }
  },
  setup (props, { emit }) {
    let loading = ref(false)
    let textInput = computed({
      get: () => props.text,
      set: (value) => emit('update:text', value)
    })

    function isClicked () {
      loading.value = true
      setTimeout(() => {
        loading.value = false
      }, 1200)
    }

    return { loading, isClicked, textInput }
  }
})
</script>
