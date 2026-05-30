<template>
  <q-page class="page column">

    <!-- HEADER -->
    <div class="header">
      <q-icon name="arrow_back" size="20px" @click="goBack" />

      <div class="header-text">
        <div class="title">Revisar mensaje</div>
        <div class="subtitle">Tocá el texto para editar</div>
      </div>

      <q-space />
    </div>

    <!-- CONTENIDO -->
    <div class="content">

      <div class="doc-container">
        <div
          ref="docRef"
          contenteditable="true"
          class="doc"
        >
          <p><b>Hospital Municipal Dr. Bernardo Houssay Vicente Lopez</b></p>

          <p>Fecha: DD/MM/AAAA</p>

          <p>Estimada familia de {{ pacienteTexto }}:</p>

          <p><b>🏥 ESTADO ACTUAL DEL PACIENTE Y EVOLUCIÓN DEL DÍA:</b><br/>
          [Constantes y situación actual del paciente]<br/>
          [Descripción honesta de la situación médica actual]</p>

          <p><b>📋 ESTUDIOS REALIZADOS:</b><br/>
          Tipo de estudio: _______<br/>
          Fecha: _______<br/>
          Servicio: _______<br/>
          Hallazgos: [Resultados relevantes]</p>

          <p><b>💊 TRATAMIENTO:</b><br/>
          [Medicamentos y dosis]</p>

          <p><b>⏰ PRONÓSTICO:</b><br/>
          [Cómo evoluciona]<br/>
          En las próximas 24-48 horas: _______</p>

          <p><i>
            💬 "Recuerden que este mensaje es solo un complemento..."
          </i></p>

          <p>Horario: _______</p>

          <p>
            👨‍⚕️ Dr./Dra. [Nombre]<br/>
            [Especialidad]
          </p>
        </div>
      </div>

      <div class="hint">
        Editá el texto antes de enviarlo
      </div>

    </div>

    <!-- BOTONES -->
    <div class="actions">
      <q-btn
        label="Re-grabar"
        flat
        class="btn-secondary"
        @click="handleReset"
      />

      <q-btn
        label="Enviar"
        class="btn-primary"
        @click="handleSend"
      />
    </div>

  </q-page>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const docRef = ref(null)
const paciente = ref(null)

const pacienteTexto = computed(() => {
  return paciente.value
    ? paciente.value.nombre + ' ' + paciente.value.apellido
    : ''
})

onMounted(() => {
  const pacienteData = localStorage.getItem('paciente')
  if (pacienteData) {
    paciente.value = JSON.parse(pacienteData)
  }
})

const goBack = () => {
  router.back()
}

const handleReset = () => {
  localStorage.removeItem('audio')
  router.back()
}

const handleSend = () => {
  console.log("Texto final:", docRef.value.innerText)
}
</script>

<style>
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

/* CAJA DOCUMENTO */
.doc-container {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 12px;

  /* 🔥 altura fija */
  height: 420px;

  /* 🔥 scroll interno */
  overflow-y: auto;
}

/* TEXTO */
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