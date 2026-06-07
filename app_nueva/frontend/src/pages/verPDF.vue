<template>
  <q-page class="page">

    <!-- HEADER -->
    <div class="header">
      <q-icon name="arrow_back" size="20px" @click="goBack" />

      <div class="header-text">
        <div class="title">Informe generado</div>
        <div class="subtitle">Podés revisarlo o compartirlo</div>
      </div>

      <q-space />
    </div>

    <!-- PDF -->
<div class="pdf-container">
  <iframe
    :src="pdfUrl + '#zoom=page-width'"
    class="pdf-frame"
  ></iframe>

  <div class="actions">
    <q-btn
      label="Enviar"
      class="btn-primary"
      @click="handleShare"
    />
  </div>

</div>

  </q-page>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const pdfUrl = route.query.url
const filename = route.query.filename
const id_paciente = route.query.id_paciente

const token = localStorage.getItem('token')
import { API_URL } from 'src/config/api'


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

<style scoped>
.page {
  background: #f5f7fa;
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 16px;
}

/* HEADER */
.header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid #e0e0e0;
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

/* PDF ocupa todo el espacio disponible */
.pdf-container {
  flex: 1;
  margin-top: 12px;
  display: flex;
  flex-direction: column; /* <- importante */
  background: white;
  border-radius: 12px;
  overflow: hidden;
}

.pdf-frame {
  flex: 1;
  width: 100%;
  border: none;
  min-height: 0;
}
/* BOTONES ABAJO */
.actions {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.btn-primary {
  width: 100%;
  background: #5c6bc0;
  color: white;
  padding: 14px;
  border-radius: 10px;
}

.btn-secondary {
  width: 100%;
  border: 1px solid #cfd8dc;
  padding: 14px;
  border-radius: 10px;
}
</style>
