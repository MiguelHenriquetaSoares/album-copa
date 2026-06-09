<template>
  <ion-page>
    <ion-content class="ion-padding">

      <h1>Recuperar Senha</h1>

      <ion-item>
        <ion-input
          v-model="email"
          label="E-mail"
          label-placement="floating"
          type="email"
        />
      </ion-item>

      <ion-button
        expand="block"
        class="ion-margin-top"
        @click="enviar"
      >
        Enviar recuperação
      </ion-button>

      <ion-button
        expand="block"
        fill="outline"
        router-link="/login"
      >
        Voltar
      </ion-button>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import {
  IonPage,
  IonContent,
  IonItem,
  IonInput,
  IonButton
} from '@ionic/vue'

const email = ref('')

function enviar() {
  if (!email.value) {
    alert('Digite um e-mail!')
    return
  }

  alert(`E-mail de recuperação enviado para ${email.value}`)
}
</script>