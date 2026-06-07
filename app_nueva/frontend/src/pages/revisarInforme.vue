<template>
  <q-page class="page column">

    <!-- HEADER -->
    <div class="header">
      <q-icon name="arrow_back" size="20px" @click="goBack" />

      <div class="header-text">
        <div class="title">Vista previa del informe</div>
        <div class="subtitle">Revisá antes de generar el PDF</div>
      </div>

      <q-space />
    </div>

    <!-- CONTENIDO -->
    <div class="content">

      <div class="doc-container">
        <div
          class="doc"
          v-html="contenidoHtml"
        ></div>
      </div>

      <div class="hint">
        Si necesitás cambiar algo, tocá "Editar"
      </div>

    </div>

    <!-- BOTONES -->
    <div class="actions">
      <q-btn
        label="Editar"
        flat
        class="btn-secondary"
        @click="handleEditar"
      />

      <q-btn
        label="Generar PDF"
        class="btn-primary"
        @click="handleGenerarPDF"
      />
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

/* FECHA */
const fecha = new Date().toLocaleDateString()

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
    [Especialidad]
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
        //id_medico: 
      }
    })

    localStorage.removeItem(`informeDraft_${route.params.id}`)

  } catch (error) {
    console.error('Error generando PDF', error)
  }
}
</script>

<style scoped>
.page {
  background: #f5f7fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

/* HEADER */
.header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 12px;
  border-bottom: 1px solid #ddd;
}

.header-text {
  display: flex;
  flex-direction: column;
}

.title {
  font-weight: 600;
}

.subtitle {
  font-size: 12px;
  color: #777;
}

/* CONTENIDO */
.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px 0;
}

/* DOCUMENTO */
.doc-container {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px;
  height: 420px;
  overflow-y: auto;
}

.doc {
  font-family: Arial;
  line-height: 1.5;
}

/* HINT */
.hint {
  text-align: center;
  margin-top: 10px;
  font-size: 13px;
  color: #777;
}

/* BOTONES */
.actions {
  display: flex;
  gap: 10px;
  margin-top: auto;
}

.btn-secondary {
  flex: 1;
  border: 1px solid #cfd8dc;
  color: #607d8b;
}

.btn-primary {
  flex: 1;
  background: #5c6bc0;
  color: white;
}
</style>
