<template>
  <q-page>
    <q-card class='login-form absolute-center ' style='max-width: 350px; width: 100%; border-radius: 15px'>
      <q-card-section>
        <q-form
          class=' content-center justify-center'
          ref='form'
          @submit='OnSubmit'
        >
          <div class='content-center text-center'>
            <q-img
              src='https://www.vilab.cl/wp-content/uploads/2021/07/Logo-Vilab-1-transparent-e1627227582118.png'
              height='50px' width='80px'></q-img>

            <q-item-label class='text-grey-7 text-h5 caption'>Iniciar sesión</q-item-label>
          </div>
          <br>
          <q-separator />
          <br>
          <q-input
            v-model='user_login'
            label='Ingrese su usuario'
            lazy-rules
            outlined
            rounded
            clearable
            class='bg-white text-white'
            :rules="[ val => val && val.length > 0 || 'Please type something']"
          />
          <q-input
            outlined
            rounded
            type='password'
            v-model='user_password'
            label='Ingrese su password'
            lazy-rules
            clearable
            :rules="[
          val => val !== null && val !== '' || 'Por favor ingrese su password'
        ]"
          />
          <q-card-actions align='center'>

            <q-btn rounded label='Iniciar sesión' type='submit' color='secondary' />
            <q-btn label='Cancelar' type='reset' color='primary' flat class='q-ml-sm' />
          </q-card-actions>
        </q-form>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script lang='ts'>
import { defineComponent, ref } from 'vue';


function OnSubmit() {
  console.log('ga');
}

export default defineComponent({
  // name: 'PageName'
  setup() {
    const user_login = ref(null);
    const user_password = ref(null);

    return { user_login, user_password, OnSubmit };
  }
});
</script>
<style scoped>

.login-form {
  color: white;
}
</style>
