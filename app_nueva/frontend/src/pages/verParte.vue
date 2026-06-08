<template>
  <q-page class="bg-grey-2 q-pa-md column" style="overflow-x: hidden; height: 100vh;">

    <div class="row items-center justify-between full-width q-mb-lg no-wrap">
      
      <div class="row items-center no-wrap col q-pr-sm">
        <q-btn 
          round
          class="btn-back card-interactiva q-mr-md flex flex-center q-pa-none"
          @click="goBack" 
        >
          <q-icon name="arrow_back" style="color: #616161;" size="36px" />
        </q-btn>

        <div class="nombre-paciente text-capitalize ellipsis">
          {{ nombrePaciente }}
        </div>
      </div>
      
      <div class="column items-end col-auto">
        <span class="texto-cama text-uppercase">
          Cama
        </span>
        <span class="texto-numero">
          {{ nroCama || '...' }}
        </span>
      </div>

    </div>

    <div class="text-h6 text-weight-bold q-mb-sm text-black full-width">
      Parte médico
    </div>

    <div class="col full-width bg-white caja-redondeada shadow-1 overflow-hidden flex">
      <iframe
        :src="pdfUrl + '#zoom=page-width'"
        class="full-width full-height"
        style="border: none;"
      ></iframe>
    </div>

  </q-page>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// Levantamos todas las variables enviadas por la URL desde miPaciente.vue
const pdfUrl = route.query.url
const id_paciente = route.query.id_paciente
const nombrePaciente = route.query.nombre
const nroCama = route.query.cama

const goBack = () => {
  router.push(`/miPaciente/${id_paciente}`)
}
</script>

<style scoped>
/* Totalmente limpio. Todo se hereda de app.scss corporativo */
</style>

