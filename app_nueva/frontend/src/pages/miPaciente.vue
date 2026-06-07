<template>
  <div class="page">

    <!-- HEADER -->
    <div class="topbar">
      <q-icon
        name="arrow_back"
        size="22px"
        @click="$router.push({ name: 'IndexPage' })"
      />

      <div class="title">
        <h2>{{ paciente.nombre }} {{ paciente.apellido }}</h2>
        <p>DNI {{ paciente.dni }}</p>
      </div>
    </div>

    <!-- CONTENIDO -->
    <div class="content">

      <!-- DATOS CLINICOS -->
      <h3 class="section-title">Datos clínicos</h3>

      <div class="card">
        <div class="row">
          <span>Diagnóstico</span>
          <span class="chip">{{ paciente.diagnostico }}</span>
        </div>

        <div class="row">
          <span>Email</span>
          <span>{{ paciente.mail || '—' }}</span>
        </div>

        <div class="row">
          <span>Documento</span>
          <span>{{ paciente.dni }}</span>
        </div>
      </div>

      <!-- PARTES -->
      <h3 class="section-title">Partes médicos</h3>

      <div class="card">
        <div
          v-for="p in partes"
          :key="p.id"
          class="pdf"
          @click="verParte(p)"
        >
          <span>
            📄 Parte {{ formatDate(p.fecha_creacion) }}
          </span>

          <span class="arrow">›</span>
        </div>

        <div
          v-if="partes.length === 0"
          class="empty"
        >
          No hay partes todavía
        </div>
      </div>

      <!-- BOTON -->
      <button
        class="btn"
        @click="goToForm"
      >
        NUEVO MENSAJE
      </button>

    </div>

  </div>
</template>

<script>
import axios from 'axios'
import { API_URL } from 'src/config/api'


export default {
  data() {
    return {
      paciente: {},
      partes: []
    }
  },

  async mounted() {
    try {
      const token = localStorage.getItem('token')
      const id = this.$route.params.id

      const resPaciente = await axios.get(
        `http://${API_URL}:3001/api/paciente/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      this.paciente = resPaciente.data

      const resPartes = await axios.get(
        `http://${API_URL}:3001/api/partes/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      this.partes = resPartes.data

    } catch (error) {
      console.error('Error cargando paciente', error)
    }
  },

  methods: {
    goToForm() {
      this.$router.push(`/FormPage/${this.paciente.id}`)
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString('es-AR')
    },
    verParte(parte) {
  const pdfUrl =
    `http://${API_URL}:3001/uploads/${parte.archivo}`

  this.$router.push({
    path: '/verParte',
    query: {
      url: pdfUrl,
      id_paciente: this.paciente.id
    }
  })
}
  }
}
</script>

<style scoped>
.page {
  background: #f5f7fa;
  min-height: 100vh;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  border-bottom: 1px solid #ddd;
}

.title {
  text-align: center;
}

.title h2 {
  margin: 0;
  font-size: 16px;
}

.title p {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

.content {
  padding: 16px;
}

.section-title {
  font-size: 13px;
  color: #6b7280;
  margin: 16px 0 8px;
}

.card {
  background: white;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

.row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.row:last-child {
  border-bottom: none;
}

.chip {
  background: #6b7280;
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 11px;
}

.pdf {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: 0.2s;
}

.pdf:hover {
  background: #f8fafc;
}

.pdf:last-child {
  border-bottom: none;
}

.empty {
  text-align: center;
  padding: 12px;
  color: #888;
}

.btn {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #0098BF;
  color: white;
  cursor: pointer;
}

.arrow {
  color: #999;
  font-size: 18px;
}
</style>