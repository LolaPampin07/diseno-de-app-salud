<template>
  <q-page class="flex flex-center column q-gutter-md">

    <!-- Logo -->
    <img
      alt="Logo App"
      src="~assets/logoapp.png"
      style="width: 200px; height: auto"
    />

    <!-- Formulario -->
    <q-form
      class="q-gutter-md"
      style="width: 300px"
      @submit.prevent="onSubmit"
    >
          <!-- Tipo de usuario -->
      <q-select
        filled
        v-model="tipoUsuario"
        label="Tipo de usuario"
        :options="tiposUsuario"
        :rules="[val => !!val || 'Seleccioná un tipo de usuario']"
      />
      <q-input
        filled
        v-model="usuario"
        label="Usuario"
        :rules="[val => !!val || 'El usuario es obligatorio']"
      />

      <q-input
        filled
        type="password"
        v-model="password"
        label="Contraseña"
        :rules="[val => !!val || 'La contraseña es obligatoria']"
      />

      <q-btn
        label="Ingresar"
        type="submit"
        color="primary"
        class="full-width"
      />
    </q-form>

  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'

const router = useRouter()

const usuario = ref('')
const password = ref('')
const tipoUsuario = ref(null)

const tiposUsuario = [
  { label: 'Médico', value: 'medico' },
  { label: 'Consultante', value: 'consultante' }
]

const onSubmit = () => {
  if (usuario.value && password.value && tipoUsuario.value) {
    Notify.create({
      type: 'positive',
      message: `Bienvenido ${tipoUsuario.value.label}`
    })

    // Redirección según tipo de usuario (opcional)
    router.push('/')
  } else {
    Notify.create({
      type: 'negative',
      message: 'Completá todos los campos'
    })
  }
}
</script>