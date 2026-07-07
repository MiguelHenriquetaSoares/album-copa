<template>
  <ion-page>
    <ion-content class="album-page ion-padding">
      <section class="page-heading">
        <span>Sobre</span>
        <h1>Album da Copa</h1>
        <p>Gerenciamento simples de figurinhas da Copa do Mundo.</p>
      </section>

      <ion-card class="about-card">
        <ion-card-header>
          <ion-card-title>Versao 1.0.0</ion-card-title>
        </ion-card-header>

        <ion-card-content>
          <p>
            Acompanhe sua colecao, filtre figurinhas por status e mantenha seu progresso salvo com seguranca.
          </p>

          <p>
            Tecnologias: Ionic Vue, Vue 3, TypeScript, Capacitor e SQLite local.
          </p>

          <p>
            Desenvolvedor: Miguel 3° Info.
          </p>

          <ion-button
            expand="block"
            fill="outline"
            href="https://www.termsfeed.com/live/terms-of-service"
            target="_blank"
          >
            Termo de Uso
          </ion-button>

          <ion-button
            expand="block"
            fill="outline"
            href="https://www.termsfeed.com/live/privacy-policy"
            target="_blank"
          >
            Politica de Privacidade
          </ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>

    <AppTabs />
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonContent,
  IonPage
} from '@ionic/vue'

import AppTabs from '@/components/AppTabs.vue'
</script>
