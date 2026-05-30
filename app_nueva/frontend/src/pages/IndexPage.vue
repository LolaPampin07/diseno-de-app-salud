<template>
  <div class="page">

    <!-- HEADER -->
    <div class="header">
      <div class="left">
        <div class="avatar">👤</div>

        <div class="text">
          <h1>Mis pacientes</h1>
          <p>{{ doctorName }}</p>
        </div>
      </div>
    </div>

    <!-- BUSCADOR -->
    <input
      v-model="search"
      class="search"
      placeholder="Buscar paciente..."
    />

    <!-- CONTADOR -->
    <div class="counter">
      Total: {{ filteredPatients.length }} pacientes
    </div>

    <!-- LISTA -->
    <div class="list">
      <div
        v-for="p in filteredPatients"
        :key="p.id"
        class="patient"
        @click="goToPatient(p.id)"
      >
        <div class="avatar small">👤</div>

        <div class="info">
          <p class="name">{{ p.nombre }} {{ p.apellido }}</p>
          <p class="diagnosis">{{ p.diagnostico }}</p>
        </div>

        <div class="badge">DNI {{ p.dni }}</div>
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      search: "",
      patients: [],
      doctorName: "Cargando..."
    };
  },

  async mounted() {
    try {
      const token = localStorage.getItem('token');

      // ✅ traer pacientes reales
      const res = await axios.get(
        'http://localhost:3001/api/mis-pacientes',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      this.patients = res.data;

      // ✅ opcional: info del médico
      const verify = await axios.get(
        'http://localhost:3001/api/verify',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      this.doctorName = `Dr. ${verify.data.user.username}`;

    } catch (error) {
      console.error('Error cargando pacientes', error);
    }
  },

  computed: {
    filteredPatients() {
      return this.patients.filter(p =>
        `${p.nombre} ${p.apellido}`
          .toLowerCase()
          .includes(this.search.toLowerCase())
      );
    }
  },

  methods: {
    goToPatient(id) {
      this.$router.push(`/miPaciente/${id}`);
    }
  }
};
</script>

<style scoped>

/* FONDO */
.page {
  background: #f5f7fa;
  min-height: 100vh;
  padding: 16px;
}

.left {
  display: flex;
  align-items: center;  /* 🔥 clave */
}


/* AVATAR */
.avatar {
  width: 42px;
  height: 42px;
  background: #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* TEXTO */

.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.text h1 {
  margin: 0;
  margin-bottom: 2px;   /* 👈 clave */
  font-size: 18px;
  font-weight: 600;
}

.text p {
  margin: 0;
  font-size: 13px;
  color: #6b7280;
  line-height: 1;
}

.header {
  margin-bottom: 16px;
  background: white;
  padding: 12px 16px;
  border-radius: 12px;

  display: flex;
  align-items: center;

  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
}

/* BUSCADOR */
.search {
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border-radius: 8px;
  border: 1px solid #ccc;
}

/* CONTADOR */
.counter {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 10px;
}

/* LISTA */
.patient {
  display: flex;
  align-items: center;
  gap: 12px;

  padding: 12px;
  margin-bottom: 10px;

  background: white;
  border-radius: 12px;

  box-shadow: 0 2px 6px rgba(0,0,0,0.05);
  cursor: pointer;
}

.patient:hover {
  background: #f0fdf4;
}

/* INFO */
.info {
  flex: 1;
}

.name {
  margin: 0;
  font-weight: 600;
  font-size: 14px;
}

.diagnosis {
  margin: 0;
  font-size: 12px;
  color: #6b7280;
}

/* BADGE */
.badge {
  background: #2e7d32;
  color: white;
  padding: 4px 10px;
  border-radius: 10px;
  font-size: 11px;
}

/* AVATAR chico */
.avatar.small {
  width: 36px;
  height: 36px;
  font-size: 14px;
}

</style>