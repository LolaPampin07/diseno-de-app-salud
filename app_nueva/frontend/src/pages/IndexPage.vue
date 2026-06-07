<template>
  <div class="page">

    <!-- HEADER -->
    <img
    src="/logout.png"
    class="logout-btn"
    @click="logout"
  />

    <div class="header">
      <div class="left">
        <div class="avatar">
        👤
      </div>

        <div class="text">
          <p>{{ doctorName }}</p>
        </div>
      </div>
    </div>

    <!-- BUSCADOR -->
     
    <div class="text">
          <titulo>Mis Pacientes</titulo>
      </div>


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
import { Dialog } from 'quasar'
import { API_URL } from 'src/config/api'

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
        `http://${API_URL}:3001/api/mis-pacientes`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      this.patients = res.data;

      // ✅ opcional: info del médico
      const verify = await axios.get(
        `http://${API_URL}:3001/api/verify`,
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
    },
    logout() {
  Dialog.create({
    title: 'Cerrar sesión',
    message: '¿Deseás salir de tu cuenta?',
    ok: {
      label: 'Sí, salir',
      color: 'negative'
    },
    cancel: {
      label: 'Cancelar'
    },
    persistent: true
  }).onOk(() => {
    localStorage.removeItem('token')
    this.$router.push('/login')
  })
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
.text titulo {
  font-size: 18px;
  font-weight: 600;
}

.text p {
  margin: 0;
  font-size: 25px;
  font-weight: 600;
  color: #000000;
  line-height: 1;
  text-transform: capitalize;
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

.logout-btn {
  width: 40px;
  height: 40px;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.2s ease;

  position: fixed;
  top: 30px;
  right: 30px;

}

.logout-btn:hover {
  opacity: 1;
  transform: scale(1.1);
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

  text-transform: capitalize;
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

/* LOG OUT*/
.avatar {
  width: 42px;
  height: 42px;
  background: #e0e0e0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
}

.avatar:hover {
  background: #d5d5d5;
}

</style>