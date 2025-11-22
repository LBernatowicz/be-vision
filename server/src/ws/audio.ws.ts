// ws/audio.ts
import { Elysia } from 'elysia'
import { viewers } from './views.ws'
import { ffmpeg, startFFmpeg } from '../utils/ffmpeg';

let audioBuffer = Buffer.alloc(0);


export function registerAudioWS(app: Elysia) {
  app.ws('/audio', {
    open() { 
      audioBuffer = Buffer.alloc(0);
      if (!ffmpeg.isRunning) {
        startFFmpeg();
     }
    console.log('Audio source connected, FFmpeg started');
    },
    message(ws, data) {
      if (!ffmpeg.process?.stdio?.[1]) {
        console.warn('FFmpeg audio stdin not available');
        return;
      }
      try {
        const audioData = Buffer.from(data as Uint8Array);
        const audioStdin = ffmpeg.process.stdio[1] as any;

        if (audioStdin && audioStdin.writable) {
          audioStdin.write(audioData, (err: Error | null) => {
            if (err) {
              console.error('Failed to write audio data to FFmpeg stdin', err);
            }
          });
        } else {
          console.warn('FFmpeg audio stdin is not writable');
        }
      } catch (err) {
        console.error('Error processing audio data', err);
      }
    },
    close() { console.log('❎ Audio source disconnected') }
  })
}
