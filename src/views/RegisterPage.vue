<template>
  <ion-page>
    <ion-content class="auth-page ion-padding">
      <section class="auth-panel">
        <h1>Cadastro</h1>
        <p>Crie sua conta para salvar o progresso do album.</p>

        <ion-list lines="full">
          <ion-item>
            <ion-input v-model="name" label="Nome completo" label-placement="floating" />
          </ion-item>

          <ion-item>
            <ion-input v-model="email" label="E-mail" label-placement="floating" type="email" />
          </ion-item>

          <ion-item>
            <ion-input v-model="password" label="Senha" label-placement="floating" type="password" />
          </ion-item>
        </ion-list>

        <ion-button expand="block" class="ion-margin-top" :disabled="isLoading" @click="handleRegister">
          <ion-spinner v-if="isLoading" name="crescent" />
          <span v-else>Cadastrar</span>
        </ion-button>

        <ion-button expand="block" fill="outline" router-link="/login">
          Voltar
        </ion-button>
      </section>

      <ion-toast
        :is-open="toastOpen"
        message="Cadastro realizado com sucesso."
        duration="1800"
        color="success"
        @didDismiss="toastOpen = false"
      />

      <ion-alert
        :is-open="alertOpen"
        header="Nao foi possivel cadastrar"
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
const { errorMessage, isLoading, register } = useAuth()

const name = ref('')
const email = ref('')
const password = ref('')
const alertOpen = ref(false)
const toastOpen = ref(false)
const validationMessage = ref('')

async function handleRegister(): Promise<void> {
  validationMessage.value = ''

  if (!name.value.trim() || !email.value.trim() || !password.value.trim()) {
    validationMessage.value = 'Preencha nome, e-mail e senha.'
    alertOpen.value = true
    return
  }

  const success = await register({
    name: name.value.trim(),
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
