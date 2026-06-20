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
          {{ nombreSeparado.nombre }}
          {{ nombreSeparado.apellido }}
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
      Informe generado
    </div>

    <div class="col full-width bg-white caja-redondeada shadow-1 overflow-hidden flex">
      <iframe
        :src="pdfUrl + '#zoom=page-width'"
        class="full-width full-height"
        style="border: none;"
      ></iframe>
    </div>

    <q-btn
      label="ENVIAR"
      unelevated
      class="full-width q-mt-xl q-py-sm text-weight-bold caja-redondeada card-interactiva"
      style="background-color: #0098BF; color: white; letter-spacing: 1px;"
      @click="handleShare"
    />

  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { API_URL } from 'src/config/api'

const router = useRouter()
const route = useRoute()

const pdfUrl = route.query.url
const filename = route.query.filename
const id_paciente = route.query.id_paciente
const pacienteNombre = route.query.nombre || 'Paciente'
const nroCama = route.query.cama

const token = localStorage.getItem('token')

/* Formatea el nombre recibido para romperlo limpiamente en dos líneas en el header */
const nombreSeparado = computed(() => {
  const partes = pacienteNombre.split(' ')
  return {
    nombre: partes[0] || '',
    apellido: partes.slice(1).join(' ') || ''
  }
})

const goBack = async () => {
   try {
    await fetch(`http://${API_URL}:3001/api/delete-pdf`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        filename
      })
    })
  } catch (err) {
    console.error(err)
  }
  router.back()
}

const handleShare = async () => {
    console.log(filename)
    try {
       
      const response = await fetch(`http://${API_URL}:3001/api/send-pdf`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        id_paciente,
        fileName: filename
      })
    })

    if(!response.ok) {
        console.log("Error enviando PDF")
    }

    } catch (err) {
      console.error('Error compartiendo', err)
    }

    try {
        console.log(id_paciente)
        console.log(filename)
      const response = await fetch(`http://${API_URL}:3001/api/generar-parte`, {
      method: 'POST',
     headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
      body: JSON.stringify({
        id_paciente,
        nombreArchivo: filename
      })
    })

    if (!response.ok) {
      console.error("Backend respondió mal")
      throw new Error('Error en backend')
    }
    router.push({ name: 'successPage',
    query: {
        id_paciente: id_paciente
        }
     })

    } catch (err) {
      console.error('Error generando parte', err)
    }
}
</script>



