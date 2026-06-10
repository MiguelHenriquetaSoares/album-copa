<template>
  <div class="tabs">

    <ion-button
      fill="clear"
      router-link="/album"
    >
      🏆 Álbum
    </ion-button>

    <ion-button
      fill="clear"
      router-link="/collection"
    >
      📚 Coleção
    </ion-button>

    <ion-button
      fill="clear"
      router-link="/profile"
    >
      👤 Perfil
    </ion-button>

    <ion-button
      fill="clear"
      router-link="/about"
    >
      ℹ️ Sobre
    </ion-button>

  </div>
</template>

<script setup lang="ts">
import { IonButton } from '@ionic/vue'
</script>

<style scoped>
.tabs {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;

  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;

  background: white;
  border-top: 1px solid #ccc;

  padding: 10px;
  z-index: 1000;
}
</style>