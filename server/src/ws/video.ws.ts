import { Elysia } from 'elysia'
import { ffmpeg, startFFmpeg } from '../utils/ffmpeg'

export function registerVideoWS(app: Elysia) {
  app.ws('/video', {
    open(ws) { 
      if (ffmpeg.isRunning) {
        startFFmpeg();
    }},
    message(ws, data) {
      if (!ffmpeg.process?.stdin) {
        console.warn('FFmpeg video stdin not available');
        return;
      }
      try {
        const videoData = Buffer.from(data as Uint8Array);
        ffmpeg.process.stdin.write(videoData, (err) => {
          if (err) {
            console.error('Failed to write video data to FFmpeg stdin', err);
          }
      });
    } catch (err) {
      console.error('Error processing video data', err);
    }
    },
    close() { console.log('❎ Video source disconnected') }
  })
}