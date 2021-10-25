<template>
  <q-table
      title="Ledger"
      :rows="data"
      :columns="columns"
      row-key="rowNumber"
  >
       <template v-slot:body-cell="props">
          <q-td
          :props="props"
          >
            {{ props.value }}
          <q-popup-edit v-model="data[props.rowIndex][props.col.name]" buttons>
            <q-input v-model="data[props.rowIndex][props.col.name]"  dense autofocus counter />
          </q-popup-edit>
          </q-td>
      </template>
  </q-table>
</template>

<script>
import {ref} from 'vue'
export default {
    setup() {
      const columns = ref([
        {
          name: 'rowNumber',
          required: true,
          align: 'left',
          label: 'Row #',
          field: row => row.rowNumber,
          sortable: true
        },
        { name: 'account', align: 'left', label: 'Account', field: 'account', sortable: true },
        { name: 'debit', align: 'left', label: 'Debit', field: 'debit', sortable: true },
        { name: 'credit', align: 'left', label: 'Credit', field: 'credit', sortable: true },
      ])
      const data = ref([
        {
          rowNumber: 1,
          account: 'Checkings',
          debit: 100,
          credit: 0,
        },
        {
          rowNumber: 2,
          account: 'Savings',
          debit: 1000,
          credit: 0,
        },
        {
          rowNumber: 3,
          account: 'Checkings',
          debit: 0,
          credit: 500,
        },
        {
          rowNumber: 4,
          account: 'Checkings',
          debit: 600,
          credit: 0,
        },
        {
          rowNumber: 5,
          account: 'Savings',
          debit: 1500,
          credit: 0,
        },
        {
          rowNumber: 6,
          account: 'Checkings',
          debit: 0,
          credit: 200,
        },
        {
          rowNumber: 7,
          account: 'Checkings',
          debit: 4500,
          credit: 0,
        },
        {
          rowNumber: 8,
          account: 'Savings',
          debit: 900,
          credit: 0,
        },
        {
          rowNumber: 9,
          account: 'Checkings',
          debit: 0,
          credit: 50,
        },
        {
          rowNumber: 10,
          account: 'Checkings',
          debit: 0,
          credit: 3200,
        },
      ])
    return {
      columns,
      data,
    }
  },
}
</script>
