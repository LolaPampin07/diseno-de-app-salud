<template>
  <q-page class="flex flex-center column q-gutter-md">
    <img
      alt="Logo App"
      src="~assets/logoapp.png"
      style="width: 200px; height: auto"
    />

    <q-btn
      color="primary"
      label="Solicitar horario de consulta"
      @click="solicitarHorario"
    />
     <q-btn
      color="primary"
      label="Partes medicos"
      @click="solicitarHorario"
    />
  </q-page>
</template>

<script setup>
function solicitarHorario () {
  alert('Ingrese su horario disponible para la consulta')
}
</script>