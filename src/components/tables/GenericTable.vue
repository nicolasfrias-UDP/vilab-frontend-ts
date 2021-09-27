<template>
  <QTable
    class="q-mt-md"
    :columns="columns"
    :data="objectData"
    :row-key="rowKey?rowKey:'name'"
    :filter="filter"
    :pagination="pagination"
  >
    <template v-slot:top-right>
      <q-input borderless dense debounce="300" v-model="filter" placeholder="Buscar...">
        <template v-slot:append>
          <q-icon name="search"/>
        </template>
      </q-input>
    </template>

    <template v-slot:body-cell-actions="cell" >
      <QTd auto-width>

        <QBtn v-if="view" color="black" dense fab-mini flat @click="doView(cell.row.id)">
          <q-icon name="visibility" style="font-size: 20px"/>
          <QTooltip>Ver</QTooltip>
        </QBtn>

        <QBtn v-if="seen" :color="cell.row.read_at ? 'black' : 'grey'" dense fab-mini flat @click="doSeen(cell.row.id)">
          <q-icon name="visibility" style="font-size: 20px"/>
          <QTooltip>Ver</QTooltip>
        </QBtn>

        <QBtn v-if="active" :color="cell.row.active ? 'black' : 'grey'" dense fab-mini flat @click="doActive(cell.row.id)">
          <q-icon :name="cell.row.active ? 'check_circle' : 'block'" style="font-size: 20px"/>
          <QTooltip>{{ cell.row.active ? 'Activo' : 'Inactivo' }}</QTooltip>
        </QBtn>

        <QBtn v-if="edit" color="black" dense fab-mini flat @click="doEdit(cell.row.id)">
          <q-icon name="edit" style="font-size: 20px"/>
          <QTooltip>Editar</QTooltip>
        </QBtn>

        <QBtn v-if="platform" color="black" dense fab-mini flat @click="doPlatform(cell.row.platform.id)">
          <q-icon name="fas fa-cog" style="font-size: 20px"/>
          <QTooltip>Plataforma</QTooltip>
        </QBtn>

        <QBtn v-if="advanced" color="black" dense fab-mini flat @click="doAdvanced(cell.row.id)">
          <q-icon name="fas fa-cog" style="font-size: 20px"/>
          <QTooltip>Avanzado</QTooltip>
        </QBtn>

        <QBtn v-if="payment" color="black" dense fab-mini flat @click="doPayment(cell.row.id)">
          <q-icon name="payments" style="font-size: 20px"/>
          <QTooltip>Pagos</QTooltip>
        </QBtn>

        <QBtn v-if="remove" color="black" dense fab-mini flat @click="doRemove(cell.row.id)">
          <q-icon name="delete" style="font-size: 20px"/>
          <QTooltip>Eliminar</QTooltip>
        </QBtn>
      </QTd>
    </template>
  </QTable>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'GenericTable',
  props: {
    objectData: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    pagination: {
      type: [Array, Object],
      required: false
    },
    view: {
      type: Function
    },
    edit: {
      type: Function
    },
    remove: {
      type: Function
    },
    active: {
      type: Function
    },
    payment: {
      type: Function
    },
    advanced: {
      type: Function
    },
    platform: {
      type: Function
    },
    seen: {
      type: Function
    },
    rowKey: {
      type: String
    }
  },

  setup (props:any) {
    let filter = ref('')

    function doView (row: bigint) {
      props.view(row)
    }

    function doSeen (row: bigint) {
      props.seen(row)
    }

    function doEdit (row: bigint) {
      props.edit(row)
    }

    function doRemove (row: bigint) {
      props.remove(row)
    }

    function doActive (row: bigint) {
      props.active(row)
    }

    function doPayment (row: bigint) {
      props.payment(row)
    }

    function doAdvanced (row: bigint) {
      props.advanced(row)
    }

    function doPlatform (row: bigint) {
      props.platform(row)
    }

    return { doView, doEdit, doRemove, doActive, doPayment, doAdvanced, doPlatform, doSeen, filter }
  }
})
</script>

<style scoped>

</style>
