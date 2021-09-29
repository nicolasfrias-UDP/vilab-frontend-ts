<template>
  <div>
    <div class='row q-ma-md justify-center'>
      <CancelButton class='q-mr-md'/>
      <SaveButton :loading='myLoading' class='q-mr-md'/>
    </div>
  </div>
</template>

<script lang='ts'>
import { computed, defineComponent } from 'vue'
import CancelButton from 'components/buttons/CancelButton.vue'
import SaveButton from 'components/buttons/SaveButton.vue'

export default defineComponent({
  name: 'CombinedButton',
  props: {
    position: {
      type: String,
      default: 'justify-center'
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  components: {
    SaveButton,
    CancelButton
  },
  setup (props, {
    emit
  }) {
    const myLoading = computed({
      get: () => props.loading,
      set: (value) => emit('update:loading', value)
    })

    return { myLoading }
  }
})
</script>
