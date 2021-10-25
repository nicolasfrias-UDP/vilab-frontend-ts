cd <template>
  <q-page class='q-pa-md'>
    <!-- content -->

    <q-btn label="Agregar usuario"  icon='far fa-save' color="secondary" @click="prompt = true" />

    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Your address</div>
        </q-card-section>
        <div class='col-12 col-md-5 col-sm-12'>
          <q-input  rounded outlined v-model="id" label="Id" autofocus @keyup.enter="prompt = false" :rules="[ val => val && val.length > 0 || 'Please type something']" />
        </div>
        <div class='col-12 col-md-5 col-sm-12'>
        <q-input rounded outlined v-model="mail" label="Correo" autofocus @keyup.enter="prompt = false" :rules="[ val => val && val.length > 0 || 'Please type something']" />
        </div>
        <div class='col-12 col-md-5 col-sm-12'>
          <q-input rounded outlined v-model="password" label="Contraseña" autofocus @keyup.enter="prompt = false"  :rules="[ val => val && val.length > 0 || 'Please type something']"/>
        </div>
        <q-card-actions align="right" class="text-primary">
          <q-btn flat label="Cancel" v-close-popup />
          <q-btn flat label="agregar usuario" @click="submit" />
        </q-card-actions>
      </q-card>
    </q-dialog>
      <GenericTableBackend
        :columns='columns'
        endpoint='http://[::1]/app_vilab/index.php/Nicolas/get_users_axios'
        :filter-enable='true'
        filter-search-placeholder='Ingresar busqueda'
        :filter-search-criteria='["usu_mail"]'
        :edit='edit'
        :remove='remove'
      >
    </GenericTableBackend>


  </q-page>
</template>


<script lang='ts'>
import {ref, onMounted} from 'vue';
import {useQuasar } from 'quasar';
import GenericTableBackend from 'components/tables/GenericTableBackend.vue';
import { api } from 'boot/axios';
import axios from 'axios';
export default {
  name:'user_table',
  components: { GenericTableBackend },
  setup (){
    const $q = useQuasar();
    const id = ref('');
    const mail = ref('');
    const password = ref('');
    const myform = ref('');
    const info = ref([]);
    const filter = ref('');
    const loading = ref(false);
    const pagination = ref({
    sortBy: 'desc',
    descending: false,
    page: 1,
    rowsPerPage: 10,
    rowsNumber: 10
  });
  const prompt = ref(false);
  function edit(row) {

  console.log(row);
  }
  function remove(usu_id) {
    console.log(usu_id);
  }
  function submit() {
    if(id.value == '' || mail.value == '' || password.value == ''){
      $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Debe rellenar todos los campos en rojo'
          })
    }else{
          void axios({
            'method':'POST',
            'url': 'http://[::1]/app_vilab/index.php/Nicolas/add_user_axios',
            'data':JSON.stringify({
              'id':id.value,
              'mail':mail.value,
              'pass':password.value
            })
          }).then(function (response){
            console.log(response.data);
            $q.notify({
                  color: 'green-4',
                  textColor: 'white',
                  icon: 'cloud_done',
                  message: 'Usuario agregado correctamente'
                });
                prompt.value = false;
                setTimeout(() => {
                  //window.location.reload()
                }, 2000);

          })
          .catch(function (error) {
              console.log(error.response);
            });
          //window.location.reload()
    }


  }
  /*function onrequest(props){
    const { page, rowsPerPage, sortBy, descending } = props.pagination
    //const filter = props.filter
    loading.value = true
    const startRow = (page - 1) * rowsPerPage
    api.post('http://[::1]/app_vilab/index.php/Nicolas/get_users_axios',{
      start:startRow,
      rows:rowsPerPage,
      sortBy:sortBy,
      descending:descending
    })
      .then( function(response) {
        info.value = response.data
        console.log(response)
      })
      .catch(err => (console.log(err)
    ))
  }
  onMounted(()=>{
    //let vue = this;
    onrequest({
      pagination: pagination.value,
      filter: undefined
    })

  })
*/

    return {
      info,
      filter,
      loading,
      pagination,
      columns:[
        { name: 'actions', align: 'center', label: 'Acciones', field: 'actions', sortable: false},
        { name:'usu_id', label:'user id', field:'usu_id', align:'left', sortable:true,},
        {name:'usu_mail',  label:'user mail',  field:'usu_mail',  align:'left'},
        {name:'usu_pass',  label:'user password',  field:'usu_pass',  align:'left'},
        ],
      edit,
      remove,
      submit,
      id,
      mail,
      password,
      myform,
      $q,
      prompt,
  //onrequest,
    };
  },

}
</script>
