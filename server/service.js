import fs from 'fs';
import { access } from 'fs/promises';
import { join, extname } from 'path';


import config from './config.js';

export class Service {
    createFileStream(filename) {
        return fs.createReadStream(filename);
    }

    async getFileInfo(filename) {
        // file = home/index.html
        const filePath = join(config.dir.publicDirectory, filename);

        await access(filePath);

        const fileType = extname(filePath);

        return {
            type: fileType,
            name: filePath,
        }
    }

    async getFileStream(filename) {
        const { name, type } = await this.getFileInfo(filename);
        
        return {
            stream: this.createFileStream(name),
            type,
        }
    }
}