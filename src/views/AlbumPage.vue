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

      <ion-searchbar
        v-model="pesquisa"
        placeholder="Pesquisar jogador ou seleção"
      />

      <ion-segment v-model="filtro">

        <ion-segment-button value="todas">
          <ion-label>Todas</ion-label>
        </ion-segment-button>

        <ion-segment-button value="coletadas">
          <ion-label>Coletadas</ion-label>
        </ion-segment-button>

        <ion-segment-button value="pendentes">
          <ion-label>Pendentes</ion-label>
        </ion-segment-button>

      </ion-segment>

      <div class="grid">

        <ion-card
          v-for="sticker in stickersFiltradas"
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

    <AppTabs />

  </ion-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonImg,
  IonBadge,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonLabel
} from '@ionic/vue'

import { useAlbum } from '../composables/useAlbum'
import AppTabs from '../components/AppTabs.vue'

const {
  stickers,
  toggleCollected
} = useAlbum()

const pesquisa = ref('')
const filtro = ref('todas')

const stickersFiltradas = computed(() => {
  return stickers.value.filter(sticker => {

    const matchPesquisa =
      sticker.nome.toLowerCase().includes(
        pesquisa.value.toLowerCase()
      ) ||
      sticker.selecao.toLowerCase().includes(
        pesquisa.value.toLowerCase()
      )

    const matchFiltro =
      filtro.value === 'todas'
        ? true
        : filtro.value === 'coletadas'
        ? sticker.coletada
        : !sticker.coletada

    return matchPesquisa && matchFiltro
  })
})
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
  padding-bottom: 90px;
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