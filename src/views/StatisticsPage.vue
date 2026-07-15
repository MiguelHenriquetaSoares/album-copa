<template>
  <ion-page>
    <ion-content class="album-page ion-padding">
      <section class="page-heading">
        <span>Meu progresso</span>
        <h1>Estatísticas</h1>
        <p>Acompanhe a evolução da sua coleção.</p>
      </section>

      <ion-loading :is-open="isLoading" message="Calculando estatísticas..." />

      <section class="statistics-content" aria-label="Estatísticas da coleção">
        <ion-card class="completion-card">
          <ion-card-header>
            <div class="card-title-row">
              <ion-card-title>Conclusão do álbum</ion-card-title>
              <ion-badge color="success">{{ albumStats.completionPercentage }}%</ion-badge>
            </div>
            <ion-card-subtitle>
              {{ albumStats.collected }} de {{ albumStats.total }} figurinhas coletadas
            </ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-progress-bar :value="albumStats.completionPercentage / 100" color="success" />
          </ion-card-content>
        </ion-card>

        <div class="stats-grid">
          <ion-card>
            <ion-card-content>
              <span>Total cadastradas</span>
              <strong>{{ albumStats.total }}</strong>
            </ion-card-content>
          </ion-card>

          <ion-card>
            <ion-card-content>
              <span>Coletadas</span>
              <strong class="success-value">{{ albumStats.collected }}</strong>
            </ion-card-content>
          </ion-card>

          <ion-card>
            <ion-card-content>
              <span>Faltantes</span>
              <strong>{{ albumStats.missing }}</strong>
            </ion-card-content>
          </ion-card>

          <ion-card>
            <ion-card-content>
              <span>Raras coletadas</span>
              <strong class="rare-value">{{ albumStats.rareCollected }}</strong>
            </ion-card-content>
          </ion-card>

          <ion-card>
            <ion-card-content>
              <span>Brilhantes coletadas</span>
              <strong class="shiny-value">{{ albumStats.shinyCollected }}</strong>
            </ion-card-content>
          </ion-card>
        </div>

        <ion-card class="ranking-card">
          <ion-card-header>
            <div class="card-title-row">
              <ion-card-title>Ranking de colecionador</ion-card-title>
              <ion-badge :color="rankingColor">{{ collectorRanking.level }}</ion-badge>
            </div>
            <ion-card-subtitle>{{ collectorRanking.score }} pontos acumulados</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-progress-bar :value="collectorRanking.progressPercentage / 100" :color="rankingColor" />
            <p v-if="collectorRanking.nextLevel">
              Faltam {{ pointsToNextLevel }} pontos para o nível {{ collectorRanking.nextLevel }}.
            </p>
            <p v-else>Você alcançou o nível máximo.</p>
          </ion-card-content>
        </ion-card>

        <section class="recent-section">
          <h2>Últimas coletas</h2>
          <ion-list v-if="recentCollectedStickers.length">
            <ion-item v-for="sticker in recentCollectedStickers" :key="sticker.id">
              <ion-label>
                <h3>{{ sticker.name }}</h3>
                <p>{{ sticker.country }} · {{ sticker.rarity }}</p>
                <p>Coletada em {{ formatCollectedAt(sticker.collectedAt) }}</p>
              </ion-label>
              <ion-badge slot="end" color="success">Coletada</ion-badge>
            </ion-item>
          </ion-list>
          <ion-card v-else class="empty-history">
            <ion-card-content>Ainda não há figurinhas coletadas.</ion-card-content>
          </ion-card>
        </section>
      </section>

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
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonProgressBar,
  onIonViewWillEnter
} from '@ionic/vue'
import { computed, ref } from 'vue'

import AppTabs from '@/components/AppTabs.vue'
import { useAlbum } from '@/composables/useAlbum'

const {
  albumStats,
  collectorRanking,
  errorMessage,
  isLoading,
  loadStickers,
  recentCollectedStickers
} = useAlbum()

const alertOpen = ref(false)

const rankingColor = computed(() => {
  const colors = {
    Bronze: 'medium',
    Prata: 'secondary',
    Ouro: 'warning',
    Diamante: 'tertiary'
  } as const

  return colors[collectorRanking.value.level]
})

const pointsToNextLevel = computed(() => {
  if (!collectorRanking.value.nextLevelMin) {
    return 0
  }

  return collectorRanking.value.nextLevelMin - collectorRanking.value.score
})

onIonViewWillEnter(async () => {
  await loadStickers(true)

  if (errorMessage.value) {
    alertOpen.value = true
  }
})

function formatCollectedAt(value: string | null): string {
  if (!value) {
    return 'data não disponível'
  }

  return new Intl.DateTimeFormat('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  }).format(new Date(value))
}
</script>

<style scoped>
.statistics-content {
  display: grid;
  width: min(100%, 760px);
  gap: 16px;
  margin: 0 auto 96px;
}

.statistics-content ion-card {
  margin: 0;
}

.card-title-row {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
}

.card-title-row ion-badge {
  font-size: 0.9rem;
}

.completion-card ion-card-content,
.ranking-card ion-card-content {
  display: grid;
  gap: 12px;
}

.ranking-card p {
  margin: 0;
  color: var(--album-muted);
  font-size: 0.9rem;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 12px;
}

.stats-grid ion-card-content {
  display: grid;
  gap: 8px;
  text-align: center;
}

.stats-grid span {
  color: var(--album-muted);
  font-size: 0.78rem;
  font-weight: 700;
}

.stats-grid strong {
  color: var(--album-text);
  font-size: 1.9rem;
}

.stats-grid .success-value {
  color: var(--ion-color-primary);
}

.stats-grid .rare-value {
  color: var(--ion-color-tertiary);
}

.stats-grid .shiny-value {
  color: #b27b00;
}

.recent-section h2 {
  margin: 8px 0 10px;
  color: var(--album-text);
  font-size: 1.15rem;
}

.recent-section ion-item h3 {
  color: var(--album-text);
  font-weight: 800;
}

.recent-section ion-item p {
  color: var(--album-muted);
}

.empty-history ion-card-content {
  color: var(--album-muted);
  text-align: center;
}
</style>
