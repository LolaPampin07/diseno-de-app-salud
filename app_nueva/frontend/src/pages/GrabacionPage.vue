<template>
  <q-page class="page column">

    <!-- HEADER -->
    <div class="header">
      <q-icon name="arrow_back" size="20px" @click="goBack" />
      <div class="header-subtitle">
        Para: {{ paciente ? paciente.nombre + ' ' + paciente.apellido : 'Cargando...' }}
      </div>
    </div>

    <!-- CONTENIDO CENTRAL -->
    <div class="content">

      <!-- WAVE estilo WhatsApp -->
      <div class="wave-bars">
        <div
          v-for="(h, i) in randomHeights"
          :key="i"
          class="bar"
          :style="{ height: recording ? h + 'px' : '6px' }"
        ></div>
      </div>

      <div class="time">{{ time }}</div>

      <q-btn
        round
        size="lg"
        :color="recording ? 'red-5' : 'grey-3'"
        :icon="recording ? 'stop' : 'mic'"
        class="record-btn shadow-4"
        @click="toggleRecording"
      />

      <div class="hint">
        {{ recording ? 'Tocá para detener' : 'Tocá para grabar' }}
      </div>

    </div>

    <!-- BOTONES -->
    <div class="actions">
      <q-btn
        label="Grabar nuevamente"
        flat
        class="btn-secondary"
        @click="handleReset"
      />

      <q-btn
        label="Revisar mensaje"
        class="btn-primary"
        @click="handleReview"
      />
    </div>

  </q-page>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import { Notify } from 'quasar'

const router = useRouter()
const route = useRoute()
const paciente = ref(null)

const recording = ref(false)
const time = ref('0:00')
const seconds = ref(0)

const randomHeights = ref(Array(20).fill(6))
let waveInterval = null

let mediaRecorder = null
let audioChunks = []
let interval = null
let stream = null

/* ------------------ TRAER PACIENTE ------------------ */
onMounted(async () => {
  try {
    const token = localStorage.getItem('token')

    const res = await axios.get(
      `http://localhost:3001/api/paciente/${route.params.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )

    paciente.value = res.data

  } catch (error) {
    console.error('Error cargando paciente', error)
  }
})

/* ------------------ TIMER ------------------ */
const formatTime = (sec) => {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

const startTimer = () => {
  interval = setInterval(() => {
    seconds.value++
    time.value = formatTime(seconds.value)
  }, 1000)
}

const stopTimer = () => {
  clearInterval(interval)
}

/* ------------------ RECORD ------------------ */
const startRecording = async () => {
  try {
    stream = await navigator.mediaDevices.getUserMedia({ audio: true })

    mediaRecorder = new MediaRecorder(stream)
    audioChunks = []

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        audioChunks.push(e.data)
      }
    }

    mediaRecorder.onstop = async () => {
      const blob = new Blob(audioChunks, { type: 'audio/webm' })

      const base64Audio = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
      })

      localStorage.setItem('audio', base64Audio)
      localStorage.setItem('id_paciente', route.params.id)
    }

    mediaRecorder.start()
    recording.value = true

    startTimer()

    // animación estilo WhatsApp
    waveInterval = setInterval(() => {
      randomHeights.value = randomHeights.value.map(() =>
        Math.floor(Math.random() * 25) + 5
      )
    }, 120)

  } catch (error) {
    console.error('Error accediendo al micrófono:', error)
  }
}

/* ------------------ STOP ------------------ */
const stopRecording = () => {
  if (mediaRecorder && recording.value) {
    mediaRecorder.stop()
  }

  stream?.getTracks().forEach(track => track.stop())

  recording.value = false
  stopTimer()

  clearInterval(waveInterval)
}

/* ------------------ TOGGLE ------------------ */
const toggleRecording = () => {
  recording.value ? stopRecording() : startRecording()
}

/* ------------------ RESET ------------------ */
const resetRecording = () => {
  clearInterval(waveInterval)
  randomHeights.value = Array(20).fill(6)

  if (recording.value && mediaRecorder) {
    mediaRecorder.stop()
  }

  stream?.getTracks().forEach(track => track.stop())

  recording.value = false
  seconds.value = 0
  time.value = '0:00'

  stopTimer()
  audioChunks = []
}

/* ------------------ NAV ------------------ */
const goToReview = () => {
  router.push('/revisarGrabacion')
}

const goBack = () => {
  router.back()
}

/* ------------------ CLEANUP ------------------ */
onUnmounted(() => {
  stopTimer()
  stream?.getTracks().forEach(track => track.stop())
})

const handleReset = () => {
  resetRecording()
  localStorage.removeItem('audio')
}

const handleReview = () => {
  if (seconds.value === 0) {
    Notify.create({
      type: 'warning',
      message: 'Primero tenés que grabar un mensaje',
      position: 'bottom',
      timeout: 2000
    })
    return
  }

  goToReview()
}

const handleSend = async () => {
  try {
    const token = localStorage.getItem('token')

    const response = await fetch(
      'http://localhost:3001/api/generar-pdf',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          id_paciente: localStorage.getItem('id_paciente'),
          diagnostico: "texto ejemplo", // después lo conectás
          estudios: "texto ejemplo",
          tratamiento: "texto ejemplo",
          pronostico: "texto ejemplo"
        })
      }
    )

    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)

    window.open(url)

  } catch (error) {
    console.error('Error generando PDF', error)
  }
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


.content {
  flex: 1; /* ocupa el espacio disponible */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}


.time {
  font-size: 22px;
  font-weight: bold;
  margin: 10px 0;
}

.record-btn {
  width: 80px;
  height: 80px;
  margin-top: 15px;
  margin-bottom: 12px;
}

.hint {
  color: #777;
  font-size: 13px;
}

.actions {
  margin-top: 30px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.btn-secondary {
  border: 1px solid #cfd8dc;
  color: #607d8b;
}

.btn-primary {
  background: #5c6bc0;
  color: white;
}

/* ✅ WAVE ESTILO WHATSAPP */
.wave-bars {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  gap: 4px;
  height: 50px;
  margin: 10px auto 15px;
}

.bar {
  width: 4px;
  background: #5c6bc0;
  border-radius: 3px;
  transition: height 0.12s ease;
}

</style>
