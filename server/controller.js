import { Service } from './service.js';

export class Controller {
    constructor(service) {
        this.service = new Service();
    }

    async getFileStream(filename) {
        return this.service.getFileStream(filename);
    }

}