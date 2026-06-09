<template>
  <ion-page>
    <ion-content class="ion-padding">

      <h1>Cadastro</h1>

      <ion-item>
        <ion-input
          v-model:value="nome"
          label="Nome Completo"
          label-placement="floating"
        ></ion-input>
      </ion-item>

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
        @click="cadastrar"
      >
        Cadastrar
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
const { register } = useAuth()

const nome = ref('')
const email = ref('')
const senha = ref('')

function cadastrar() {

  console.log('Nome:', nome.value)
  console.log('Email:', email.value)
  console.log('Senha:', senha.value)

  register({
    nome: nome.value,
    email: email.value,
    senha: senha.value
  })

  alert('Usuário cadastrado!')

  router.push('/login')
}
</script>