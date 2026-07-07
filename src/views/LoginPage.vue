<template>
  <ion-page>
    <ion-content class="auth-page ion-padding">
      <section class="auth-panel">
        <h1>Album da Copa</h1>
        <p>Entre para acompanhar suas figurinhas coletadas.</p>

        <ion-list lines="full">
          <ion-item>
            <ion-input
              v-model="email"
              label="E-mail"
              label-placement="floating"
              type="email"
            />
          </ion-item>

          <ion-item>
            <ion-input
              v-model="password"
              label="Senha"
              label-placement="floating"
              type="password"
            />
          </ion-item>
        </ion-list>

        <ion-button expand="block" class="ion-margin-top" :disabled="isLoading" @click="handleLogin">
          <ion-spinner v-if="isLoading" name="crescent" />
          <span v-else>Entrar</span>
        </ion-button>

        <ion-button expand="block" fill="outline" router-link="/register">
          Cadastrar
        </ion-button>

        <ion-button expand="block" fill="clear" router-link="/reset">
          Esqueci minha senha
        </ion-button>
      </section>

      <ion-toast
        :is-open="toastOpen"
        message="Login realizado com sucesso."
        duration="1800"
        color="success"
        @didDismiss="toastOpen = false"
      />

      <ion-alert
        :is-open="alertOpen"
        header="Nao foi possivel entrar"
        :message="validationMessage || errorMessage"
        :buttons="['OK']"
        @didDismiss="alertOpen = false"
      />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonAlert,
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonSpinner,
  IonToast
} from '@ionic/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { errorMessage, isLoading, login } = useAuth()

const email = ref('')
const password = ref('')
const alertOpen = ref(false)
const toastOpen = ref(false)
const validationMessage = ref('')

async function handleLogin(): Promise<void> {
  validationMessage.value = ''

  if (!email.value.trim() || !password.value.trim()) {
    validationMessage.value = 'Preencha e-mail e senha.'
    alertOpen.value = true
    return
  }

  const success = await login({
    email: email.value.trim(),
    password: password.value
  })

  if (!success) {
    alertOpen.value = true
    return
  }

  toastOpen.value = true
  await router.push('/album')
}
</script>
