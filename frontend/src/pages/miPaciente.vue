<template>
  <q-page class="bg-grey-2 q-pa-md column" style="overflow-x: hidden;">

    <div class="row items-center justify-between full-width q-mb-lg no-wrap">
     
      <div class="row items-center no-wrap col q-pr-sm">
        <q-btn
          round
          class="btn-back card-interactiva q-mr-md flex flex-center q-pa-none"
          @click="$router.push({ name: 'IndexPage' })"
        >
          <q-icon name="arrow_back" style="color: #616161;" size="36px" />
        </q-btn>

        <div class="nombre-paciente text-capitalize ellipsis">
          {{ paciente.nombre }}
          {{ paciente.apellido }}
        </div>
      </div>
     
      <div class="column items-end col-auto">
        <span class="texto-cama text-uppercase">
          Cama
        </span>
        <span class="texto-numero">
          {{ paciente.nro_cama ? String(paciente.nro_cama).slice(-3) : '...' }}
        </span>
      </div>

    </div>

    <div class="text-h6 text-weight-bold q-mb-sm q-mt-sm text-black full-width">
      Datos clínicos
    </div>
   
    <q-card flat class="bg-white q-pa-none q-mb-lg caja-redondeada shadow-1 full-width">
      <q-list separator>
        <q-item class="q-py-md row items-center no-wrap">
          <q-item-section>
            <q-item-label class="titulo-dato text-grey-8">Diagnóstico</q-item-label>
          </q-item-section>
          <q-item-section class="text-right">
            <q-item-label class="valor-dato text-black text-capitalize">
              {{ paciente.diagnostico }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="q-py-md row items-center no-wrap">
          <q-item-section>
            <q-item-label class="titulo-dato text-grey-8">Email</q-item-label>
          </q-item-section>
          <q-item-section class="text-right" style="word-break: break-word;">
            <q-item-label class="valor-dato text-black">
              {{ paciente.mail || '—' }}
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item class="q-py-md row items-center no-wrap">
          <q-item-section>
            <q-item-label class="titulo-dato text-grey-8">Documento</q-item-label>
          </q-item-section>
          <q-item-section class="text-right">
            <q-item-label class="valor-dato text-black">
              {{ paciente.dni }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card>

    <q-expansion-item
      flat
      class="bg-white caja-redondeada card-interactiva full-width q-mb-md overflow-hidden"
      expand-icon-toggle
      expand-icon-class="text-grey-7"
    >
      <template v-slot:header>
        <q-item-section class="text-h6 text-weight-bold text-black q-pa-none">
          Partes médicos
        </q-item-section>
      </template>

      <q-card flat class="bg-white q-pa-none">
        <q-separator />
        
        <q-list v-if="partes.length > 0" separator>
          <q-item
            v-for="p in partes"
            :key="p.id"
            clickable
            v-ripple
            class="q-py-md row items-center no-wrap"
            @click="verParte(p)"
          >
            <q-item-section>
              <q-item-label class="titulo-dato text-grey-8">Parte médico</q-item-label>
            </q-item-section>
           
            <q-item-section class="text-right">
              <q-item-label class="valor-dato text-black">
                {{ formatDate(p.fecha_creacion) }}
              </q-item-label>
            </q-item-section>

            <q-item-section side style="padding-left: 8px;">
              <q-icon name="chevron_right" color="grey-5" size="24px" />
            </q-item-section>
          </q-item>
        </q-list>

        <div v-else class="column items-center justify-center q-pa-xl full-width">
          <q-icon name="folder_off" color="grey-4" size="48px" class="q-mb-sm" />
          <div class="text-grey-5 text-weight-medium">No hay partes todavía</div>
        </div>
      </q-card>
    </q-expansion-item>

    <q-space />

    <q-btn
      label="NUEVO MENSAJE"
      unelevated
      class="full-width q-mt-xl q-py-sm text-weight-bold caja-redondeada card-interactiva"
      style="background-color: #0098BF; color: white; letter-spacing: 1px;"
      @click="goToForm"
    />

  </q-page>
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
      const pdfUrl = `http://${API_URL}:3001/uploads/${parte.archivo}`
      const nroCama = this.paciente.dni ? String(this.paciente.dni).slice(-3) : '...'

      this.$router.push({
        path: '/verParte',
        query: {
          url: pdfUrl,
          id_paciente: this.paciente.id,
          nombre: `${this.paciente.nombre} ${this.paciente.apellido}`,
          cama: nroCama
        }
      })
    }
  }
}
</script>

<style scoped>
/* Totalmente vacío. Toda la estética se controla centralizadamente desde app.scss */
</style>

