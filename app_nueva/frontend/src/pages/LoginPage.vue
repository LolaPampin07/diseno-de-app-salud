<template>
<q-page class="page-standard">

  <div class="login-container">

    <!-- Logo -->
    <div class="text-center q-mb-xl">
      <img
        alt="Logo App"
        src="~assets/logoapp.png"
        style="width:180px;height:auto;"
      />
    </div>

    <div class="nombre-paciente text-center q-mb-xs">
      Bienvenido
    </div>

    <div class="texto-cama text-center q-mb-xl">
      Ingresá tus credenciales
    </div>
<q-form
  class="column"
  style="gap: 1rem;"
  @submit.prevent="login"
>

  <q-input
  v-model="credentials.username"
  outlined
  bg-color="white"
  placeholder="Usuario"
  class="input-login"
/>

<q-input
  v-model="credentials.password"
  outlined
  bg-color="white"
  type="password"
  placeholder="Contraseña"
  class="input-login"
/>

  <q-btn
    label="INGRESAR"
    type="submit"
    unelevated
    :loading="loading"
    class="full-width btn-login caja-redondeada card-interactiva text-weight-bold"
    style="background:#0098BF;color:white;"
  />

</q-form>
  

  </div>

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
