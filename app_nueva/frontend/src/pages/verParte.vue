<template>
  <q-page class="page">

    <!-- HEADER -->
    <div class="header">
      <q-icon
        name="arrow_back"
        size="20px"
        @click="goBack"
      />

      <div class="header-text">
        <div class="title">Parte médico</div>
        <div class="subtitle">Historial del paciente</div>
      </div>

      <q-space />
    </div>

    <!-- PDF -->
    <div class="pdf-container">
      <iframe
        :src="pdfUrl + '#zoom=page-width'"
        class="pdf-frame"
      />
    </div>

  </q-page>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const pdfUrl = route.query.url
const id_paciente = route.query.id_paciente

const goBack = () => {
  router.push(`/miPaciente/${id_paciente}`)
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

.pdf-container {
  flex: 1;
  margin-top: 12px;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  display: flex;
}

.pdf-frame {
  width: 100%;
  height: 100%;
  border: none;
}
</style>