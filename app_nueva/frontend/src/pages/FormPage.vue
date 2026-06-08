
<template>
  <q-page class="bg-grey-2 q-pa-md column" style="overflow-x: hidden;">

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
          {{ paciente ? paciente.nombre : 'Cargando...' }}
          {{ paciente ? paciente.apellido : '' }}
        </div>
      </div>

      <div class="column items-end col-auto">
        <span class="texto-cama text-uppercase">
          Cama
        </span>
        <span class="texto-numero">
          {{ paciente ? String(paciente.nro_cama) : '...' }}
        </span>
      </div>
      
    </div>

    <div class="col column">
      <q-input
        v-model="informe"
        label="Escribí el informe acá..."
        type="textarea"
        autogrow
        outlined
        bg-color="white"
        class="full-width"
      />
    </div>

    <q-space />

    <q-btn
      label="GENERAR VISTA PREVIA"
      unelevated
      class="full-width q-mt-xl q-py-sm text-weight-bold caja-redondeada card-interactiva"
      style="background-color: #0098BF; color: white; letter-spacing: 1px;"
      @click="handlePreview"
    />

  </q-page>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { Notify } from 'quasar'
import { API_URL } from 'src/config/api'

const router = useRouter()
const route = useRoute()

const paciente = ref(null)
const informe = ref('')


const draftKey = `informeDraft_${route.params.id}`

onMounted(async () => {
  try {
    const token = localStorage.getItem('token')

    const res = await axios.get(
      `http://${API_URL}:3001/api/paciente/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    paciente.value = res.data

    const draft = localStorage.getItem(draftKey)
    if (draft) {
      const data = JSON.parse(draft)
      informe.value = data.informe || ''
    }

  } catch (error) {
    console.error('Error cargando paciente', error)
  }
})

watch(
  [informe],
  () => {
    localStorage.setItem(
      draftKey,
      JSON.stringify({
        informe: informe.value
      })
    )
  },
  { deep: true }
)

const handlePreview = () => {
  if (!informe.value) {
    Notify.create({
      type: 'warning',
      message: 'Completá todos los campos',
      position: 'bottom'
    })
    return
  }

  router.push({
    name: 'revisarInforme',
    params: {
      id: route.params.id
    },
    query: {
      informe: informe.value,
      nombre: paciente.value ? `${paciente.value.nombre} ${paciente.value.apellido}` : '',
      cama: String(paciente.value.nro_cama),
      id: route.params.id
    }
  })
}

const goBack = () => {
  router.back()
}
</script>




