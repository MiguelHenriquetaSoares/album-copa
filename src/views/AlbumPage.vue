<template>
  <ion-page>
    <ion-content class="ion-padding">

      <h1 class="titulo">🏆 Álbum da Copa</h1>

      <p class="contador">
        Coletadas:
        {{ stickers.filter(s => s.coletada).length }}
        /
        {{ stickers.length }}
      </p>

      <div class="grid">

        <ion-card
          v-for="sticker in stickers"
          :key="sticker.id"
          class="card-figurinha"
        >

          <ion-img :src="sticker.foto"></ion-img>

          <ion-card-header>
            <ion-card-title>
              {{ sticker.nome }}
            </ion-card-title>
          </ion-card-header>

          <ion-card-content>

            <strong>{{ sticker.selecao }}</strong>

            <br><br>

            <ion-badge
              color="success"
              v-if="sticker.coletada"
            >
              Coletada
            </ion-badge>

            <ion-badge
              color="warning"
              v-else
            >
              Pendente
            </ion-badge>

            <br><br>

            <ion-button
              size="small"
              expand="block"
              @click="toggleCollected(sticker.id)"
            >
              Alterar Status
            </ion-button>

          </ion-card-content>

        </ion-card>

      </div>

    </ion-content>
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
  IonButton,
  IonImg,
  IonBadge
} from '@ionic/vue'

import { useAlbum } from '../composables/useAlbum'

const {
  stickers,
  toggleCollected
} = useAlbum()
</script>

<style scoped>

.titulo {
  text-align: center;
  margin-bottom: 10px;
}

.contador {
  text-align: center;
  font-weight: bold;
  margin-bottom: 20px;
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.card-figurinha {
  text-align: center;
  overflow: hidden;
}

ion-img {
  width: 100%;
  height: 220px;
  object-fit: contain;
  background-color: #f5f5f5;
  padding: 8px;
}

ion-card-title {
  font-size: 16px;
}

</style>