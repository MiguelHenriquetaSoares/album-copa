<template>
  <ion-page>
    <ion-content class="album-page ion-padding">
      <section class="page-heading">
        <span>Conquistas</span>
        <h1>Seu progresso</h1>
        <p>{{ unlockedCount }} de {{ achievements.length }} desbloqueadas</p>
      </section>

      <div v-if="isLoading && achievements.length === 0" class="achievement-loading">
        Carregando conquistas...
      </div>

      <div v-if="achievements.length > 0" class="achievement-grid">
        <ion-card
          v-for="achievement in achievements"
          :key="achievement.id"
          class="achievement-card"
          :class="{ 'is-unlocked': achievement.unlocked }"
        >
          <ion-card-header>
            <div class="achievement-header">
              <span class="achievement-icon">
                <ion-icon :icon="getAchievementIcon(achievement.icon)" />
              </span>

              <ion-badge :color="achievement.unlocked ? 'success' : 'medium'">
                {{ achievement.unlocked ? 'Desbloqueada' : 'Bloqueada' }}
              </ion-badge>
            </div>

            <ion-card-title>{{ achievement.name }}</ion-card-title>
            <ion-card-subtitle>{{ achievement.description }}</ion-card-subtitle>
          </ion-card-header>

          <ion-card-content>
            <template v-if="achievement.unlocked">
              <p class="achievement-date">
                Desbloqueada em {{ formatDate(achievement.unlockedAt) }}
              </p>
            </template>

            <template v-else-if="achievement.progress">
              <div class="achievement-progress">
                <div>
                  <strong>Progresso</strong>
                  <span>{{ achievement.progress.label }}</span>
                </div>

                <ion-progress-bar :value="achievement.progress.value" />
              </div>
            </template>
          </ion-card-content>
        </ion-card>
      </div>

      <ion-card v-else-if="!isLoading" class="empty-state">
        <ion-card-content>
          <ion-icon :icon="trophyOutline" />
          <strong>Nenhuma conquista encontrada</strong>
          <span>Atualize seu album para recalcular suas conquistas.</span>
        </ion-card-content>
      </ion-card>

      <ion-alert
        :is-open="alertOpen"
        header="Algo deu errado"
        :message="errorMessage"
        :buttons="['OK']"
        @didDismiss="alertOpen = false"
      />
    </ion-content>

    <AppTabs />
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonAlert,
  IonBadge,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonIcon,
  IonPage,
  IonProgressBar,
  onIonViewWillEnter
} from '@ionic/vue'
import {
  albumsOutline,
  constructOutline,
  diamondOutline,
  footballOutline,
  medalOutline,
  podiumOutline,
  ribbonOutline,
  searchOutline,
  sparklesOutline,
  trophyOutline
} from 'ionicons/icons'
import { computed, ref } from 'vue'

import AppTabs from '@/components/AppTabs.vue'
import { useAchievements } from '@/composables/useAchievements'

const { achievements, errorMessage, isLoading, loadAchievements } = useAchievements()

const alertOpen = ref(false)
const unlockedCount = computed(() =>
  achievements.value.filter(achievement => achievement.unlocked).length
)

const iconMap: Record<string, string> = {
  albums: albumsOutline,
  construct: constructOutline,
  diamond: diamondOutline,
  football: footballOutline,
  medal: medalOutline,
  podium: podiumOutline,
  ribbon: ribbonOutline,
  search: searchOutline,
  sparkles: sparklesOutline,
  trophy: trophyOutline
}

onIonViewWillEnter(async () => {
  await loadAchievements()

  if (errorMessage.value) {
    alertOpen.value = true
  }
})

function getAchievementIcon(icon: string): string {
  return iconMap[icon] ?? trophyOutline
}

function formatDate(date: string | null): string {
  if (!date) {
    return 'agora'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(new Date(date))
}
</script>

<style scoped>
.achievement-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 14px;
  padding-bottom: 96px;
}

.achievement-card {
  margin: 0;
  overflow: hidden;
  border: 1px solid var(--album-border);
  border-radius: 8px;
}

.achievement-card.is-unlocked {
  border-color: rgba(45, 137, 91, 0.5);
}

.achievement-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 14px;
}

.achievement-icon {
  display: grid;
  width: 46px;
  height: 46px;
  border-radius: 8px;
  place-items: center;
  background: rgba(23, 107, 58, 0.12);
  color: var(--ion-color-primary);
  font-size: 26px;
}

ion-card-title {
  color: var(--album-text);
  font-size: 1.05rem;
  font-weight: 800;
}

ion-card-subtitle {
  margin-top: 6px;
  color: var(--album-muted);
  font-weight: 650;
  line-height: 1.35;
}

.achievement-date {
  margin: 0;
  color: var(--ion-color-primary);
  font-weight: 800;
}

.achievement-progress {
  display: grid;
  gap: 10px;
}

.achievement-progress div {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: var(--album-muted);
  font-size: 0.9rem;
}

.achievement-progress strong {
  color: var(--album-text);
}

ion-progress-bar {
  height: 8px;
  border-radius: 999px;
  overflow: hidden;
}

.achievement-loading {
  padding: 18px 0 96px;
  color: var(--album-muted);
  font-weight: 700;
  text-align: center;
}
</style>
