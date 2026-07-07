<template>
  <div v-if="stickers.length > 0" class="sticker-grid">
    <StickerCard
      v-for="sticker in stickers"
      :key="sticker.id"
      :sticker="sticker"
      @toggle="$emit('toggle', $event)"
    />
  </div>

  <ion-card v-else class="empty-state">
    <ion-card-content>
      <ion-icon :icon="albumsOutline" />
      <strong>{{ title }}</strong>
      <span>{{ message }}</span>
    </ion-card-content>
  </ion-card>
</template>

<script setup lang="ts">
import { IonCard, IonCardContent, IonIcon } from '@ionic/vue'
import { albumsOutline } from 'ionicons/icons'

import StickerCard from '@/components/StickerCard.vue'
import type { Sticker } from '@/interfaces/sticker.interface'

defineProps<{
  stickers: readonly Sticker[]
  title: string
  message: string
}>()

defineEmits<{
  toggle: [stickerId: number]
}>()
</script>

<style scoped>
.sticker-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 14px;
  padding-bottom: 96px;
}

.empty-state {
  margin: 24px 0 96px;
  border-radius: 8px;
  text-align: center;
}

.empty-state ion-card-content {
  display: grid;
  gap: 8px;
  padding: 28px 18px;
  color: var(--album-muted);
}

.empty-state ion-icon {
  justify-self: center;
  color: var(--ion-color-primary);
  font-size: 34px;
}

.empty-state strong {
  color: var(--album-text);
}
</style>
