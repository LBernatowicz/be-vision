import {spawn } from "child_process";
import type { Writable } from "stream";

interface FFmpegProcess {
    process: ReturnType<typeof spawn> | null;
    isRunning: boolean;
}

export const ffmpeg: FFmpegProcess = {
    process: null,
    isRunning: false,
};

export function startFFmpeg() {
    if (ffmpeg.isRunning) return;

    console.log("starging FFmpeg process...");

    ffmpeg.process = spawn("ffmpeg", [
        "-f", "mjpeg",
        "-i", "pipe:0",
        "-f", "s16le",
        "-ar", "16000",
        "-ac", "1",
        "-i", "pipe:1",
        "-c:v", "libx265",
        "-preset", "ultrafast",
        "-c:a", "lubopus",
        "-b:a", "32k",
        "-f", "matroska",
        "output.mkv",
    ], {
        stdio: ['pipe', 'pipe', 'pipe'] 
    });

    ffmpeg.isRunning = true;
    console.log("FFmpeg encoder started with video + audio");

    ffmpeg.process.stderr?.on('data', (data) => {
        const output = data.toString().trim();
        if (output.includes('frame=') || output.includes('time=')) {
            console.log(`FFmpeg: ${output}`);
        }
    });

    ffmpeg.process.on('close', (code) => {
        console.log(`FFmpeg process exited with code ${code}`);
        ffmpeg.isRunning = false;
        ffmpeg.process = null;
    });
}

export function stopFFmpeg() {
    if (!ffmpeg.process) {
        console.log("FFmpeg process is not running.");
        return;
    }

    const audioStdin = ffmpeg.process.stdin as Writable | null;

    ffmpeg.process.stdin?.end();
    audioStdin?.end();
    try {
        ffmpeg.process.kill('SIGTERM');
    } catch {
    }
    ffmpeg.process = null;
    ffmpeg.isRunning = false;
    console.log("FFmpeg process stopped.");
}