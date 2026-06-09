<template>
  <ion-page>
    <ion-content class="ion-padding">

      <h1>Álbum da Copa</h1>

      <ion-item>
        <ion-input
          v-model:value="email"
          label="E-mail"
          label-placement="floating"
          type="email"
        ></ion-input>
      </ion-item>

      <ion-item>
        <ion-input
          v-model:value="senha"
          label="Senha"
          label-placement="floating"
          type="password"
        ></ion-input>
      </ion-item>

      <ion-button
        expand="block"
        class="ion-margin-top"
        @click="entrar"
      >
        Entrar
      </ion-button>

      <ion-button
        expand="block"
        fill="outline"
        router-link="/register"
      >
        Cadastrar
      </ion-button>

      <ion-button
        expand="block"
        fill="clear"
        router-link="/reset"
      >
        Esqueci minha senha
      </ion-button>

    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../composables/useAuth'

import {
  IonPage,
  IonContent,
  IonItem,
  IonInput,
  IonButton
} from '@ionic/vue'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const senha = ref('')

function entrar() {

  console.log('Email digitado:', email.value)
  console.log('Senha digitada:', senha.value)

  const usuario = login(
    email.value,
    senha.value
  )

  console.log('Usuário encontrado:', usuario)

  if (usuario) {
    alert('Login realizado!')
    router.push('/album')
  } else {
    alert('Usuário não encontrado!')
  }
}
</script>