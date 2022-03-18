import { join, dirname } from "path";
import { fileURLToPath } from 'url';

const currentDir = dirname(fileURLToPath(import.meta.url));
const root = join(currentDir, '../');

export default {
    port: 3000,
    dir: {
        root,
        publicDirectory: join(root, 'public'),
        audioDirectory: join(root, 'audio'),
        songsDirectory: join(root, 'audio', 'songs'),
        fxDirectory: join(root, 'audio', 'fx'),
    },
    pages: {
        homeHtml: 'home/index.html',
        controllerHtml: 'controller/index.html',
    },
    location: {
        home: '/home',
    }
}