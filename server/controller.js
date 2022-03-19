import { Service } from './service.js';
import { logger } from './util.js';

export class Controller {
    constructor() {
        this.service = new Service();
    }

    async getFileStream(filename) {
        return this.service.getFileStream(filename);
    }

    createClientStream() {
        const { id, stream } = this.service.getClientStream();

        const onClose = () => {
            logger.info(`Client stream ${id} closing`);
            this.service.removeClientStream(id);
        };

        return {
            stream,
            onClose,
        }
    }

}