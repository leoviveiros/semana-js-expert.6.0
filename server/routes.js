import { logger } from "./util.js";
import { Controller } from "./controller.js";

import config from './config.js';

const controller = new Controller()

async function routes(request, response) {
    const { url, method } = request;
    
    if (method === 'GET' && url === '/') {
        response.writeHead(302, { 'Location': config.location.home });
        return response.end();
    }

    if (method === 'GET' && url === '/home') {
        const { stream } = await controller.getFileStream(config.pages.homeHtml);

        return stream.pipe(response);
    }


    return response.end('Hello, world!');
}

export function handler(request, response) {
    return routes(request, response)
        .catch(error => logger.error(`Deu ruim: ${error.stack}`));
}