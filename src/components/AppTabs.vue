<template>
  <ion-footer class="app-tabs">
    <ion-toolbar>
      <ion-buttons>
        <ion-button router-link="/album" fill="clear">
          <ion-icon slot="start" :icon="albumsOutline" />
          Album
        </ion-button>

        <ion-button router-link="/collection" fill="clear">
          <ion-icon slot="start" :icon="libraryOutline" />
          Colecao
        </ion-button>

        <ion-button router-link="/profile" fill="clear">
          <ion-icon slot="start" :icon="personCircleOutline" />
          Perfil
        </ion-button>

        <ion-button router-link="/about" fill="clear">
          <ion-icon slot="start" :icon="informationCircleOutline" />
          Sobre
        </ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-footer>
</template>

<script setup lang="ts">
import { IonButton, IonButtons, IonFooter, IonIcon, IonToolbar } from '@ionic/vue'
import {
  albumsOutline,
  informationCircleOutline,
  libraryOutline,
  personCircleOutline
} from 'ionicons/icons'
</script>

<style scoped>
.app-tabs {
  border-top: 1px solid var(--album-border);
}

ion-buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: 100%;
}

ion-button {
  min-width: 0;
  height: 52px;
  font-size: 0.78rem;
  font-weight: 700;
}

ion-icon {
  margin-right: 4px;
}
</style>
