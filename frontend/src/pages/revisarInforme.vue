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
      Vista previa del informe
    </div>

    <div class="col column">
      <div
        class="bg-white caja-redondeada card-interactiva q-pa-md col"
        style="overflow-y:auto;"
      >
        <div
          class="texto-1rem"
          v-html="contenidoHtml"
        />
      </div>

      <div class="texto-cama text-center q-mt-sm">
        Si necesitás cambiar algo, tocá "Editar"
      </div>
    </div>

    <div class="row q-col-gutter-sm q-mt-md">
      <div class="col">
        <q-btn
          label="Editar"
          outline
          class="full-width caja-redondeada card-interactiva"
          color="grey-7"
          @click="handleEditar"
        />
      </div>

      <div class="col">
        <q-btn
          label="Generar PDF"
          unelevated
          class="full-width caja-redondeada card-interactiva"
          style="background:#0098BF;color:white; letter-spacing: 1px;"
          @click="handleGenerarPDF"
        />
      </div>
    </div>

  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { API_URL } from 'src/config/api'

const router = useRouter()
const route = useRoute()

/* DATOS DEL FORM */
const informe = route.query.informe || ''
const pacienteNombre = route.query.nombre || 'Paciente'
const nroCama = route.query.cama

/* Formatea el nombre recibido para romperlo limpiamente en dos líneas en el header */
const nombreSeparado = computed(() => {
  const partes = pacienteNombre.split(' ')
  return {
    nombre: partes[0] || '',
    apellido: partes.slice(1).join(' ') || ''
  }
})

/* FECHA */
const fecha = new Date().toLocaleDateString('es-AR')

/* CONTENIDO HTML */
const contenidoHtml = computed(() => `
  <p><b>Hospital Municipal Dr. Bernardo Houssay Vicente Lopez</b></p>
  <p>Fecha: ${fecha}</p>
  <p>Estimada familia de ${pacienteNombre}:</p>
  <p>
    ${informe}
  </p>
  <p><i>
    💬 "Este informe es un complemento de la comunicación médica presencial."
  </i></p>
  <p>
    👨‍⚕️ Dr./Dra. [Nombre]<br/>
  </p>
`)

/* NAV */
const goBack = () => {
  router.back()
}

const handleEditar = () => {
  router.back()
}

/* GENERAR PDF Y REDIRIGIR */
const handleGenerarPDF = async () => {
  try {
    console.log(route.query) // DEBUG
    console.log(route.params)

    const token = localStorage.getItem('token')

    const response = await fetch(
      `http://${API_URL}:3001/api/generar-pdf`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id_paciente: route.params.id,
          informe: informe
        })
      }
    )

    if (!response.ok) {
      console.error("Backend respondió mal")
      throw new Error('Error en backend')
    }

    const blob = await response.blob()
    const url = URL.createObjectURL(blob)
    const fileName = response.headers.get('X-File-Name')

    console.log("PDF generado") // DEBUG
    console.log(fileName)

    router.push({
      name: 'verPDF',
      query: {
        url: url,
        filename: fileName,
        id_paciente: route.params.id,
        nombre: pacienteNombre,
        cama: nroCama
      }
    })

    localStorage.removeItem(`informeDraft_${route.params.id}`)

  } catch (error) {
    console.error('Error generando PDF', error)
  }
}
</script>

<style scoped>
:deep(p) {
  margin-bottom: 14px;
}

:deep(b) {
  font-weight: 700;
}

:deep(i) {
  color: #616161;
}
</style>

