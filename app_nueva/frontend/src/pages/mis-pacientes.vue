<template>
  <q-layout view="lHh Lpr lFf">

    <!-- HEADER -->
    <q-header elevated class="bg-green text-white">
      <q-toolbar>

        <!-- Botón menú -->
        <q-btn
          flat
          dense
          round
          icon="menu"
        />

        <!-- Logo + título (opción 1 bien implementada) -->
        <q-toolbar-title class="row items-center no-wrap">

          <!-- Logo -->
          <img
            src="src/assets/logoapp.png"
            alt="Logo App"
            style="height: 32px; margin-right: 8px;"
          />

          <!-- Texto -->
          <span class="text-weight-medium">
            Mis pacientes
          </span>

        </q-toolbar-title>

        <!-- Avatar -->
        <q-avatar>
          <q-icon name="person" />
        </q-avatar>

      </q-toolbar>
    </q-header>

    <!-- CONTENIDO -->
    <q-page-container>
      <q-page padding>

        <!-- Lista -->
        <q-list separator>

          <q-item
            v-for="paciente in pacientes"
            :key="paciente.id"
            clickable
          >
            <!-- Avatar paciente -->
            <q-item-section avatar>
              <q-avatar color="grey-4" text-color="grey-7">
                <q-icon name="person" />
              </q-avatar>
            </q-item-section>

            <!-- Info -->
            <q-item-section>
              <q-item-label>
                {{ paciente.nombre }}, Sala {{ paciente.sala }}, Cama {{ paciente.cama }}
              </q-item-label>
              <q-item-label caption>
                Info
              </q-item-label>
            </q-item-section>

          </q-item>

        </q-list>

      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script setup>
const pacientes = [
  { id: 1, nombre: 'Juan Doe', sala: 'XX', cama: 'XX' },
  { id: 2, nombre: 'Juan Doe', sala: 'XX', cama: 'XX' },
  { id: 3, nombre: 'Juan Doe', sala: 'XX', cama: 'XX' },
  { id: 4, nombre: 'Juan Doe', sala: 'XX', cama: 'XX' },
  { id: 5, nombre: 'Juan Doe', sala: 'XX', cama: 'XX' }
]
</script>
