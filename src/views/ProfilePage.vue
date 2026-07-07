<template>
  <ion-page>
    <ion-content class="album-page ion-padding">
      <section class="page-heading">
        <span>Perfil</span>
        <h1>Minha conta</h1>
        <p>Resumo do seu album</p>
      </section>

      <ion-card class="profile-card">
        <ion-card-header>
          <ion-card-title>{{ currentUser?.name ?? 'Usuario' }}</ion-card-title>
          <ion-card-subtitle>{{ currentUser?.email ?? 'E-mail nao informado' }}</ion-card-subtitle>
        </ion-card-header>

        <ion-card-content>
          <ion-item>
            <ion-input v-model="profileName" label="Nome" label-placement="floating" />
          </ion-item>

          <ion-button expand="block" fill="outline" :disabled="isLoading" @click="handleUpdateName">
            Salvar nome
          </ion-button>

          <div class="profile-stat">
            <strong>{{ collectedCount }}</strong>
            <span>{{ totalCount }} no total - {{ completionPercentage }}% concluido</span>
          </div>

          <ion-button expand="block" color="danger" :disabled="isLoading" @click="handleLogout">
            <ion-spinner v-if="isLoading" name="crescent" />
            <span v-else>Sair</span>
          </ion-button>
        </ion-card-content>
      </ion-card>

      <ion-alert
        :is-open="alertOpen"
        header="Revise seu perfil"
        :message="errorMessage"
        :buttons="['OK']"
        @didDismiss="alertOpen = false"
      />

      <ion-toast
        :is-open="toastOpen"
        message="Perfil atualizado."
        duration="1800"
        color="success"
        @didDismiss="toastOpen = false"
      />
    </ion-content>

    <AppTabs />
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonInput,
  IonItem,
  IonPage,
  IonSpinner,
  IonToast,
  onIonViewWillEnter
} from '@ionic/vue'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import AppTabs from '@/components/AppTabs.vue'
import { useAlbum } from '@/composables/useAlbum'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const { collectedCount, completionPercentage, loadStickers, totalCount } = useAlbum()
const { currentUser, errorMessage, isLoading, loadCurrentUser, logout, updateName } = useAuth()

const alertOpen = ref(false)
const toastOpen = ref(false)
const profileName = ref('')

onIonViewWillEnter(async () => {
  await loadCurrentUser()
  await loadStickers()
  profileName.value = currentUser.value?.name ?? ''
})

async function handleUpdateName(): Promise<void> {
  const success = await updateName(profileName.value)

  if (!success) {
    alertOpen.value = true
    return
  }

  profileName.value = currentUser.value?.name ?? ''
  toastOpen.value = true
}

async function handleLogout(): Promise<void> {
  const success = await logout()

  if (!success) {
    alertOpen.value = true
    return
  }

  await router.push('/login')
}
</script>
