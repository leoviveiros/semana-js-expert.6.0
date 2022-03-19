import { join, dirname } from "path";
import { fileURLToPath } from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const root = join(currentDir, '../');

const publicDirectory = join(root, 'public')
const audioDirectory = join(root, 'audio')
const songsDirectory = join(audioDirectory, 'songs')
const fxDirectory = join(audioDirectory, 'fx')

export default {
    port: 3000,
    dir: {
        root,
        publicDirectory: publicDirectory,
        audioDirectory: audioDirectory,
        songsDirectory: songsDirectory,
        fxDirectory: fxDirectory,
    },
    pages: {
        homeHtml: 'home/index.html',
        controllerHtml: 'controller/index.html',
    },
    location: {
        home: '/home',
    },
    constants: {
        contentType: {
            '.html': 'text/html',
            '.css': 'text/css',
            '.js': 'application/javascript',
        },
        audioMediaType: 'mp3',
        volume: '0.99',
        fallbackBitrate: '128000',
        englishConversation: join(songsDirectory, 'conversation.mp3'),
        bitrateDivisor: 8,
    }
}