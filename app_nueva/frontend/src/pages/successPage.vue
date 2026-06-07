<template>
  <div class="success-container">
    <div class="success-content">

      <div class="check-wrapper">
        <q-icon name="check" class="check-icon" />
      </div>

      <h1 class="title">
        Informe enviado
      </h1>

      <p class="subtitle">
        El informe fue enviado correctamente.
      </p>

    </div>

    <div class="footer">
      <q-btn
        label="Volver al Inicio"
        class="btn-primary"
        unelevated
        @click="goBack"
      />
    </div>
  </div>
</template>
<script setup>
import { useRouter } from 'vue-router'


const router = useRouter()

const goBack = () => {
  router.push(`/`)
}

</script>
<style>
.success-container {
  height: 100vh;
  background: white;

  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 32px 24px;
}

.success-content {
  flex: 1;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  text-align: center;

  animation: fadeIn 0.5s ease;
}

.check-wrapper {
  width: 120px;
  height: 120px;

  border-radius: 50%;
  background: #00a65015;
  border: 3px solid #00a650;

  display: flex;
  align-items: center;
  justify-content: center;

  margin-bottom: 32px;
}

.check-icon {
  font-size: 64px;
  color: #00a650;

  animation: pop 0.5s ease;
}

.title {
  margin: 0;

  font-size: 28px;
  font-weight: 700;
  color: #333;
}

.subtitle {
  margin-top: 12px;

  max-width: 280px;

  font-size: 15px;
  line-height: 1.5;
  color: #777;
}

.footer {
  padding-bottom: 16px;
}

.btn-primary {
  width: 100%;
  height: 52px;

  background: #3483fa;
  color: white;

  border-radius: 10px;

  font-weight: 600;
}

@keyframes pop {
  0% {
    transform: scale(0);
  }

  80% {
    transform: scale(1.15);
  }

  100% {
    transform: scale(1);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>