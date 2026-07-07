<template>
  <ion-page>
    <ion-content class="album-page ion-padding">
      <section class="page-heading">
        <span>Minha Colecao</span>
        <h1>Figurinhas coletadas</h1>
        <p>{{ collectedCount }} figurinhas no album</p>
      </section>

      <ion-loading :is-open="isLoading" message="Carregando colecao..." />

      <StickerList
        :stickers="collectedStickers"
        title="Colecao vazia"
        message="Marque figurinhas como coletadas para montar sua colecao."
        @toggle="handleToggle"
      />

      <ion-toast
        :is-open="toastOpen"
        message="Colecao atualizada."
        duration="1800"
        color="success"
        @didDismiss="toastOpen = false"
      />

      <ion-alert
        :is-open="alertOpen"
        header="Algo deu errado"
        :message="errorMessage"
        :buttons="['OK']"
        @didDismiss="alertOpen = false"
      />
    </ion-content>

    <AppTabs />
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonAlert,
  IonContent,
  IonLoading,
  IonPage,
  IonToast,
  onIonViewWillEnter
} from '@ionic/vue'
import { ref } from 'vue'

import AppTabs from '@/components/AppTabs.vue'
import StickerList from '@/components/StickerList.vue'
import { useAlbum } from '@/composables/useAlbum'

const {
  collectedCount,
  collectedStickers,
  errorMessage,
  isLoading,
  loadStickers,
  toggleCollected
} = useAlbum()

const alertOpen = ref(false)
const toastOpen = ref(false)

onIonViewWillEnter(async () => {
  await loadStickers()

  if (errorMessage.value) {
    alertOpen.value = true
  }
})

async function handleToggle(stickerId: number): Promise<void> {
  const success = await toggleCollected(stickerId)

  if (!success) {
    alertOpen.value = true
    return
  }

  toastOpen.value = true
}
</script>
