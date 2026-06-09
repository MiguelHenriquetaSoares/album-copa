import { ref } from 'vue'
import { stickers as initialStickers } from '../data/stickers'

const stickers = ref([...initialStickers])

export function useAlbum() {

  function toggleCollected(id: number) {
    const sticker = stickers.value.find(
      s => s.id === id
    )

    if (sticker) {
      sticker.coletada = !sticker.coletada
    }
  }

  return {
    stickers,
    toggleCollected
  }
}