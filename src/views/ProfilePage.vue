<template>
  <ion-page>

    <ion-content class="ion-padding">

      <h1>Meu Perfil</h1>

      <ion-card>

        <ion-card-header>
          <ion-card-title>
            Usuário
          </ion-card-title>
        </ion-card-header>

        <ion-card-content>

          <p>
            Nome: Miguel
          </p>

          <p>
            E-mail: miguel@email.com
          </p>

          <p>
            Figurinhas coletadas:
            {{ coletadas }}
          </p>

        </ion-card-content>

      </ion-card>

      <ion-button
        expand="block"
        color="danger"
        @click="sair"
      >
        Sair
      </ion-button>

    </ion-content>

    <AppTabs />

  </ion-page>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton
} from '@ionic/vue'

import { useAlbum } from '../composables/useAlbum'
import AppTabs from '../components/AppTabs.vue'

const router = useRouter()

const { stickers } = useAlbum()

const coletadas = computed(
  () => stickers.value.filter(
    s => s.coletada
  ).length
)

function sair() {
  router.push('/login')
}
</script>