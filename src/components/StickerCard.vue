<template>
  <ion-card class="sticker-card" :class="{ 'is-collected': sticker.collected }">
    <div class="sticker-frame">
      <ion-img :src="sticker.imageUrl" :alt="sticker.name" class="sticker-image" />
    </div>

    <ion-card-header>
      <div class="badge-row">
        <ion-badge :color="rarityColor">{{ sticker.rarity }}</ion-badge>
        <ion-badge :color="sticker.collected ? 'success' : 'medium'">
          {{ sticker.collected ? 'Coletada' : 'Pendente' }}
        </ion-badge>
      </div>

      <ion-card-title>{{ sticker.name }}</ion-card-title>
      <ion-card-subtitle>{{ sticker.country }}</ion-card-subtitle>
    </ion-card-header>

    <ion-card-content>
      <ion-button
        expand="block"
        size="small"
        :color="sticker.collected ? 'medium' : 'primary'"
        @click="$emit('toggle', sticker.id)"
      >
        <ion-icon slot="start" :icon="sticker.collected ? closeCircleOutline : checkmarkCircleOutline" />
        {{ sticker.collected ? 'Marcar pendente' : 'Marcar coletada' }}
      </ion-button>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonIcon,
  IonImg
} from '@ionic/vue'
import { checkmarkCircleOutline, closeCircleOutline } from 'ionicons/icons'
import { computed } from 'vue'

import type { Sticker } from '@/interfaces/sticker.interface'

const props = defineProps<{
  sticker: Sticker
}>()

defineEmits<{
  toggle: [stickerId: number]
}>()

const rarityColor = computed(() => {
  if (props.sticker.rarity === 'Brilhante') {
    return 'warning'
  }

  if (props.sticker.rarity === 'Rara') {
    return 'tertiary'
  }

  return 'primary'
})
</script>

<style scoped>
.sticker-card {
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--album-border);
  border-radius: 8px;
  background: linear-gradient(180deg, #fffdf8 0%, #f8f2e4 100%);
  box-shadow: 0 8px 18px rgba(21, 34, 59, 0.08);
}

.sticker-card.is-collected {
  border-color: rgba(45, 137, 91, 0.45);
}

.sticker-frame {
  display: grid;
  min-height: 190px;
  padding: 12px;
  place-items: center;
  background:
    linear-gradient(135deg, rgba(20, 83, 45, 0.08), rgba(232, 177, 55, 0.16)),
    #f7f7f2;
}

.sticker-image {
  width: 100%;
  max-width: 170px;
  height: 170px;
  object-fit: contain;
}

.badge-row {
  display: flex;
  gap: 6px;
  justify-content: center;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

ion-card-header {
  padding: 14px 12px 6px;
  text-align: center;
}

ion-card-title {
  color: var(--album-text);
  font-size: 1rem;
  font-weight: 800;
}

ion-card-subtitle {
  margin-top: 4px;
  color: var(--album-muted);
  font-size: 0.78rem;
  font-weight: 700;
}

ion-card-content {
  padding: 8px 12px 14px;
}
</style>
