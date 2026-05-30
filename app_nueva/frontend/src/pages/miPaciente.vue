<template>
  <div class="page">

    <!-- 🔝 HEADER -->
    <div class="topbar">
      <q-icon name="arrow_back" size="22px" @click="$router.back()" />

      <div class="title">
        <!-- ✅ nombre real -->
        <h2>{{ paciente.nombre }} {{ paciente.apellido }}</h2>
        <p>DNI {{ paciente.dni }}</p>
      </div>
    </div>

    <!-- 📋 CONTENIDO -->
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

      <!-- CONTACTOS (lo dejamos como dummy por ahora) -->
      <h3 class="section-title">Contactos</h3>

      <div class="card">
        <div v-for="c in contactos" :key="c.id" class="contact">
          <div class="circle"></div>

          <div class="info">
            <p>{{ c.name }}</p>
            <p class="phone">{{ c.phone }}</p>
          </div>

          <span class="arrow">›</span>
        </div>
      </div>

      <!-- 📄 PARTES REALES -->
      <h3 class="section-title">Partes médicos</h3>

      <div class="card">
        <div
          v-for="p in partes"
          :key="p.id"
          class="pdf"
        >
          <span>
            📄 Parte {{ formatDate(p.fecha_creacion) }}
          </span>

          <span class="arrow">›</span>
        </div>

        <div v-if="partes.length === 0" class="empty">
          No hay partes todavía
        </div>
      </div>

      <!-- BOTON -->
      <button class="btn" @click="goToGrabacion">
        Nuevo Mensaje
      </button>

    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      paciente: {},
      partes: [],
      contactos: [
        { id: 1, name: "Contacto demo", phone: "+54 9 ..." }
      ]
    };
  },

  async mounted() {
    try {
      const token = localStorage.getItem('token');
      const id = this.$route.params.id;

      // ✅ traer paciente real
      const resPaciente = await axios.get(
        `http://localhost:3001/api/paciente/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      this.paciente = resPaciente.data;

      // ✅ traer partes del paciente
      const resPartes = await axios.get(
        `http://localhost:3001/api/partes/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      this.partes = resPartes.data;

    } catch (error) {
      console.error('Error cargando paciente', error);
    }
  },

methods: {
  goToGrabacion() {
    this.$router.push(`/GrabacionPage/${this.paciente.id}`);
    
  },

  formatDate(date) {
    return new Date(date).toLocaleDateString();
  }
}

};
</script>

<style scoped>

/* FONDO */
.page {
  background: #f5f7fa;
  min-height: 100vh;
}

/* HEADER */
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

/* CONTENIDO */
.content {
  padding: 16px;
}

/* SECCIONES */
.section-title {
  font-size: 13px;
  color: #6b7280;
  margin: 16px 0 8px;
}

/* CARDS */
.card {
  background: white;
  border-radius: 12px;
  padding: 10px;
  margin-bottom: 10px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

/* FILAS */
.row {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.row:last-child {
  border-bottom: none;
}

/* CHIP */
.chip {
  background: #6b7280;
  color: white;
  padding: 3px 8px;
  border-radius: 10px;
  font-size: 11px;
}

/* CONTACTOS */
.contact {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.contact:last-child {
  border-bottom: none;
}

.circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 2px solid purple;
}

/* PDF */
.pdf {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.pdf:last-child {
  border-bottom: none;
}

.empty {
  text-align: center;
  padding: 10px;
  color: #888;
}

/* BOTON */
.btn {
  width: 100%;
  margin-top: 20px;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: #5b4bdb;
  color: white;
}

/* FLECHAS */
.arrow {
  color: #999;
}

</style>