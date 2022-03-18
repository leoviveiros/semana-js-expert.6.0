import { createReadStream } from 'fs';
import { access } from 'fs/promises';
import { join, extname } from 'path';


import config from './config.js';

export class Service {
    createFileStream(filename) {
        return createReadStream(filename);
    }

    async getFileInfo(file) {
        // file = home/index.html
        const filePath = join(config.dir.publicDirectory, file);

        await access(filePath);

        const fileType = extname(filePath);

        return {
            type: fileType,
            name: filePath,
        }
    }

    async getFileStream(file) {
        const { name, type } = await this.getFileInfo(file);
        
        return {
            stream: this.createFileStream(name),
            type,
        }
    }
}