<template>
  <q-page class="bg-grey-2 q-pa-md">
    
    <div class="row items-center justify-between q-mb-lg">
      <div class="row items-center">
        <q-avatar
          color="grey-3"
          text-color="black"
          size="48px"
          class="q-mr-md"
        >
          👤
        </q-avatar>

        <div>
          <div class="nombre-paciente text-capitalize text-weight-bold">
            {{ doctorName }}
          </div>
        </div>
      </div>

      <q-btn
        round
        class="btn-back card-interactiva"
        @click="logout"
      >
        <q-icon
          name="logout"
          size="24px"
          style="color:#616161;"
        />
      </q-btn>
    </div>

    <div class="text-h6 text-weight-bold q-mb-sm text-black">
      Mis Pacientes
    </div>

    <q-input
      v-model="search"
      outlined
      dense
      placeholder="Buscar paciente..."
      bg-color="white"
      class="q-mb-md buscador"
    >
      <template v-slot:append>
        <q-icon name="search" />
      </template>
    </q-input>

    <div class="text-caption text-grey-7 q-mb-sm">
      Total: {{ filteredPatients.length }} pacientes
    </div>

    <div class="row q-col-gutter-sm">
      <div
        v-for="p in filteredPatients"
        :key="p.id"
        class="col-6"
      >
        <q-card
          flat
          v-ripple
          class="bg-white q-pa-md column justify-between cursor-pointer full-height caja-redondeada card-interactiva"
          @click="goToPatient(p.id)"
        >
          <div class="column q-gutter-y-xs">
            <div class="texto-1rem text-weight-bold text-capitalize text-black">
              {{ p.nombre }} {{ p.apellido }}
            </div>
            <div class="texto-1rem text-grey-7 text-capitalize">
              {{ p.diagnostico }}
            </div>
          </div>

          <div class="column q-mt-md">
            <span class="texto-cama text-uppercase">
              Cama
            </span>
            <span class="texto-numero">
              {{ String(p.nro_cama) }}
            </span>
          </div>
        </q-card>
      </div>
    </div>

  </q-page>
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

      const res = await axios.get(
        `http://${API_URL}:3001/api/mis-pacientes`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      this.patients = res.data;

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
        message: '¿Estás seguro de que querés salir de tu cuenta?',
        ok: {
          label: 'SÍ, SALIR',
          color: 'negative',
          flat: true // Queda más limpio y minimalista
        },
        cancel: {
          label: 'CANCELAR',
          style: 'color: #0098BF;', // Tu azul corporativo unificado
          flat: true
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
/* Totalmente limpio. Todo hereda del archivo app.scss global */
</style>

