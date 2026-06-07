<template>
  <q-page class="flex flex-center column q-gutter-md">

    <!-- Logo -->
    <img alt="Logo App" src="~assets/logoapp.png" style="width: 200px; height: auto" />

    <!-- Formulario -->
    <q-form class="q-gutter-md" style="width: 300px" @submit.prevent="login">
      <q-input filled v-model="credentials.username" label="Usuario" :rules="[val => !!val || 'El usuario es obligatorio']" />

      <q-input filled type="password" v-model="credentials.password" label="Contraseña"
        :rules="[val => !!val || 'La contraseña es obligatoria']" />

      <q-btn label="Ingresar" type="submit" color="primary" class="full-width" />
    </q-form>

  </q-page>
</template>

<script setup>
import axios from 'axios'
import { Notify } from 'quasar'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { API_URL } from 'src/config/api'


const router = useRouter()

const credentials = ref({
  username: '',
  password: ''
})

const loading = ref(false)
const login = async () => {
  loading.value = true
  try {
    const { data } = await axios.post(`http://${API_URL}:3001/api/login`, credentials.value)
    localStorage.setItem('username', credentials.value.username)
    localStorage.setItem('token', data.token)

    Notify.create({
      type: 'positive',
      message: `Bienvenido ${credentials.value.username}`
    })
    router.push('/')
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Credenciales inválidas'
    Notify.create({
      type: 'negative',
      message: errorMessage
    })
  } finally {
    loading.value = false
  }
}

</script>
