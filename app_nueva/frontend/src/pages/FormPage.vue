<template>
  <q-page class="page column">

    <!-- HEADER -->
    <div class="header">
      <q-icon name="arrow_back" size="20px" @click="goBack" />
      <div class="header-subtitle">
        Para: {{ paciente ? paciente.nombre + ' ' + paciente.apellido : 'Cargando...' }}
      </div>
    </div>

    <!-- CONTENIDO -->
    <div class="content form-content">

      <q-input
        v-model="informe"
        label="Informe:"
        type="textarea"
        autogrow
        outlined
        class="full-width"
      />

    </div>

    <!-- BOTÓN -->
    <div class="actions">
      <q-btn
        label="Generar vista previa"
        class="btn-primary"
        @click="handlePreview"
      />
    </div>

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


/* 🔥 CLAVE POR PACIENTE */
const draftKey = `informeDraft_${route.params.id}`

/* ------------------ TRAER PACIENTE + RECUPERAR DRAFT ------------------ */
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

    /* ✅ RECUPERAR */
    const draft = localStorage.getItem(draftKey)
    if (draft) {
      const data = JSON.parse(draft)

      informe.value = data.informe || ''

    }

  } catch (error) {
    console.error('Error cargando paciente', error)
  }
})

/* ------------------ GUARDADO AUTOMÁTICO ------------------ */
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

/* ------------------ IR A PREVIEW ------------------ */
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
    nombre: paciente.value
      ? paciente.value.nombre + ' ' + paciente.value.apellido
      : '',
    id: route.params.id,
  }
  })
}

/* ------------------ NAV ------------------ */
const goBack = () => {
  router.back()
}
</script>

<style scoped>
.page {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ddd;
}

.header-subtitle {
  font-size: 14px;
}

.form-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 20px;
}

.actions {
  margin-top: 20px;
  width: 100%;
}

.btn-primary {
  background: #0098BF; 
  color: white;
  width: 100%;
  padding: 12px;
  border-radius: 8px;
}
</style>