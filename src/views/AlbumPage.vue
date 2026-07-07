<template>
  <ion-page>
    <ion-content class="album-page ion-padding">
      <section class="page-heading">
        <span>Album da Copa</span>
        <h1>Suas figurinhas</h1>
        <p>{{ collectedCount }} de {{ totalCount }} coletadas</p>
      </section>

      <ion-searchbar
        :value="filters.search"
        placeholder="Pesquisar jogador ou selecao"
        @ionInput="handleSearch"
      />

      <ion-segment :value="filters.status" @ionChange="handleStatusChange">
        <ion-segment-button value="todas">
          <ion-label>Todas</ion-label>
        </ion-segment-button>

        <ion-segment-button value="coletadas">
          <ion-label>Coletadas</ion-label>
        </ion-segment-button>

        <ion-segment-button value="pendentes">
          <ion-label>Pendentes</ion-label>
        </ion-segment-button>

        <ion-segment-button value="comuns">
          <ion-label>Comuns</ion-label>
        </ion-segment-button>

        <ion-segment-button value="raras">
          <ion-label>Raras</ion-label>
        </ion-segment-button>

        <ion-segment-button value="brilhantes">
          <ion-label>Brilhantes</ion-label>
        </ion-segment-button>
      </ion-segment>

      <ion-loading :is-open="isLoading" message="Carregando figurinhas..." />

      <StickerList
        :stickers="filteredStickers"
        title="Nenhuma figurinha encontrada"
        message="Ajuste a busca ou o filtro para ver outras figurinhas."
        @toggle="handleToggle"
      />

      <ion-toast
        :is-open="toastOpen"
        :message="toastMessage"
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
import type { SegmentCustomEvent, SearchbarCustomEvent } from '@ionic/vue'
import {
  IonAlert,
  IonContent,
  IonLabel,
  IonLoading,
  IonPage,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonToast,
  onIonViewWillEnter
} from '@ionic/vue'
import { ref } from 'vue'

import AppTabs from '@/components/AppTabs.vue'
import StickerList from '@/components/StickerList.vue'
import { useAlbum } from '@/composables/useAlbum'
import type { StickerStatusFilter } from '@/interfaces/sticker.interface'

const {
  collectedCount,
  errorMessage,
  filteredStickers,
  filters,
  isLoading,
  loadStickers,
  setSearch,
  setStatusFilter,
  toggleCollected,
  totalCount
} = useAlbum()

const alertOpen = ref(false)
const toastOpen = ref(false)
const toastMessage = ref('')

onIonViewWillEnter(async () => {
  await loadStickers()

  if (errorMessage.value) {
    alertOpen.value = true
  }
})

function handleSearch(event: SearchbarCustomEvent): void {
  setSearch(event.detail.value ?? '')
}

function handleStatusChange(event: SegmentCustomEvent): void {
  const value = event.detail.value

  const validFilters: StickerStatusFilter[] = [
    'todas',
    'coletadas',
    'pendentes',
    'comuns',
    'raras',
    'brilhantes'
  ]

  if (validFilters.includes(value as StickerStatusFilter)) {
    setStatusFilter(value as StickerStatusFilter)
  }
}

async function handleToggle(stickerId: number): Promise<void> {
  const success = await toggleCollected(stickerId)

  if (!success) {
    alertOpen.value = true
    return
  }

  toastMessage.value = 'Figurinha atualizada.'
  toastOpen.value = true
}
</script>
