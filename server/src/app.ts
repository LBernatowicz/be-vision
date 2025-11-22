// server.ts
import { Elysia } from 'elysia'
import { registerViewersWS } from './ws/views.ws'
import { registerVideoWS } from './ws/video.ws'
import { registerAudioWS } from './ws/audio.ws'


const app = new Elysia()

registerViewersWS(app)
registerVideoWS(app)
registerAudioWS(app)

app.listen(3000)
console.log('Server listening on http://0.0.0.0:3000')