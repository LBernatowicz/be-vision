import { Elysia } from 'elysia'

export const viewers = new Set<{ send(data: Uint8Array | string): void }>()

export function registerViewersWS(app: Elysia) {
  app.ws('/view', {
    open(ws) {
      viewers.add(ws)
      console.log('👀 Viewer connected – total:', viewers.size)
    },
    message(ws, msg) {
      console.log('Viewer says:', msg)
    },
    close(ws) {
      viewers.delete(ws)
      console.log('🚪 Viewer disconnected – total:', viewers.size)
    }
  })
}
