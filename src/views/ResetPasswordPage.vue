<template>
  <ion-page>
    <ion-content class="auth-page ion-padding">
      <section class="auth-panel">
        <h1>Recuperar Senha</h1>
        <p>Informe seu e-mail para receber as instrucoes de recuperacao.</p>

        <ion-list lines="full">
          <ion-item>
            <ion-input v-model="email" label="E-mail" label-placement="floating" type="email" />
          </ion-item>
        </ion-list>

        <ion-button expand="block" class="ion-margin-top" :disabled="isLoading" @click="handleReset">
          <ion-spinner v-if="isLoading" name="crescent" />
          <span v-else>Enviar recuperacao</span>
        </ion-button>

        <ion-button expand="block" fill="outline" router-link="/login">
          Voltar
        </ion-button>
      </section>

      <ion-toast
        :is-open="toastOpen"
        message="E-mail de recuperacao enviado."
        duration="2200"
        color="success"
        @didDismiss="toastOpen = false"
      />

      <ion-alert
        :is-open="alertOpen"
        header="Revise o e-mail"
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

import { useAuth } from '@/composables/useAuth'

const { errorMessage, isLoading, resetPassword } = useAuth()

const email = ref('')
const alertOpen = ref(false)
const toastOpen = ref(false)
const validationMessage = ref('')

async function handleReset(): Promise<void> {
  validationMessage.value = ''

  if (!email.value.trim()) {
    validationMessage.value = 'Digite um e-mail valido.'
    alertOpen.value = true
    return
  }

  const success = await resetPassword(email.value.trim())

  if (success) {
    toastOpen.value = true
    return
  }

  alertOpen.value = true
}
</script>
