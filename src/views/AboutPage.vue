<template>
  <ion-page>

    <ion-content class="ion-padding">

      <h1>Sobre o Aplicativo</h1>

      <ion-card>

        <ion-card-header>
          <ion-card-title>
            Álbum da Copa
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>

          <p>
            Versão: 1.0.0
          </p>

          <p>
            Aplicativo desenvolvido para gerenciamento de figurinhas da Copa do Mundo.
          </p>

          <ion-button
            expand="block"
            href="https://www.termsfeed.com/live/terms-of-service"
            target="_blank"
          >
            Termo de Uso
          </ion-button>

          <ion-button
            expand="block"
            href="https://www.termsfeed.com/live/privacy-policy"
            target="_blank"
          >
            Política de Privacidade
          </ion-button>

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
  IonButton
} from '@ionic/vue'

import AppTabs from '../components/AppTabs.vue'
</script>