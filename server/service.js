import fs from 'fs';
import Throttle from 'throttle';
import streamPromises from 'stream/promises'

import { randomUUID } from 'crypto';
import { access } from 'fs/promises';
import { join, extname } from 'path';
import { PassThrough, Writable } from 'stream';
import { spawn } from 'child_process';

import config from './config.js';

import { logger } from './util.js';
import { once } from 'events';

export class Service {

    constructor() {
        this.clientStreams = new Map();
        this.currentSong = config.constants.englishConversation;
        this.currentBitrate = 0;
        this.throttleTransform = {};
        this.currentReadable = {};

        this.startStreaming();
    }

    getClientStream() {
        const id = randomUUID();
        const clientStream = new PassThrough();

        this.clientStreams.set(id, clientStream);

        return {
            id,
            stream: clientStream,
        }
    }

    removeClientStream(id) {
        this.clientStreams.delete(id);
    }

    executeSoxCommand(command) {
        return spawn('sox', command);
    }

    async getBitrate(file) {
        try {
            const args = ['--i', '-B', file];
            const { stderr, stdout } = this.executeSoxCommand(args);

            await Promise.all([
                once(stderr, 'readable'),
                once(stdout, 'readable')
            ]);

            const [success, error] = [stdout, stderr].map(stream => stream.read());

            if (error) {
                return await Promise.reject(error);
            }

            return success.toString().trim().replace(/k/, '000');
        } catch (error) {
            logger.warn(`error getting bitrate: ${error}`);
            return config.constants.fallbackBitrate;
        }
    }

    broadcast() {
        return new Writable({
            write: (chunk, encoding, callback) => {
                for (const [id, stream] of this.clientStreams) {
                    if (stream.writeableEnded) {
                        this.removeClientStream(id);
                        continue;
                    }

                    stream.write(chunk);
                }
                
                callback()
            }
        })
    }

    async startStreaming() {
        logger.info(`starting with ${this.currentSong}`);

        const bitrate = this.currentBitrate = (await this.getBitrate(this.currentSong) / config.constants.bitrateDivisor);
        const throttleTransform = this.throttleTransform = new Throttle(bitrate);
        const songReadable = this.currentReadable = this.createFileStream(this.currentSong);

        return streamPromises.pipeline(songReadable, throttleTransform, this.broadcast());
    }

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