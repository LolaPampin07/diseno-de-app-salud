<template>
  <q-page class="bg-grey-2 q-pa-md column items-center justify-center" style="overflow-x: hidden; height: 100vh;">

    <div class="col column items-center justify-center text-center q-gutter-y-md">
      <div class="flex flex-center" style="border: 4px solid #4CAF50; border-radius: 50%; width: 140px; height: 140px; background-color: #E8F5E9;">
        <q-icon name="check" color="green" size="70px" />
      </div>

      <div class="text-h4 text-weight-bold text-black q-mt-lg">
        Informe enviado
      </div>

      <div class="text-subtitle1 text-grey-7">
        El informe fue enviado correctamente.
      </div>
    </div>

    <q-btn
      label="VOLVER AL INICIO"
      unelevated
      class="full-width q-py-sm text-weight-bold caja-redondeada card-interactiva"
      style="background-color: #0098BF; color: white; letter-spacing: 1px;"
      @click="irAlInicio"
    />

  </q-page>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const irAlInicio = () => {
  // Redirige al listado principal de pacientes
  router.push({ name: 'IndexPage' })
}
</script>


