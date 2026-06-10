<template>
  <ion-page>

    <ion-content class="ion-padding">

      <h1>Minha Coleção</h1>

      <ion-card
        v-for="sticker in coletadas"
        :key="sticker.id"
      >

        <ion-img :src="sticker.foto" />

        <ion-card-header>
          <ion-card-title>
            {{ sticker.nome }}
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>
          {{ sticker.selecao }}
        </ion-card-content>

      </ion-card>

    </ion-content>

    <AppTabs />

  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg
} from '@ionic/vue'

import { computed } from 'vue'
import { useAlbum } from '../composables/useAlbum'
import AppTabs from '../components/AppTabs.vue'

const { stickers } = useAlbum()

const coletadas = computed(() =>
  stickers.value.filter(
    sticker => sticker.coletada
  )
)
</script>