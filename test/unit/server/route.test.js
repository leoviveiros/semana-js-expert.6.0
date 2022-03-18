import { describe, test, expect, jest, beforeEach } from '@jest/globals';

import { handler } from '../../../server/routes.js';

import config from '../../../server/config.js';
import TestUtils from '../test-utils.js';
import { Controller } from '../../../server/controller.js';

const { pages, location } = config;

describe('#Routes - test suite for api response', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test('GET / - should redirect do home page', async () => { 
        const params = TestUtils.defaultHandleParams();
        params.request.method = 'GET';
        params.request.url = '/';

        await handler(...params.values());

        expect(params.response.writeHead).toHaveBeenCalledWith(302, { Location: location.home });
        expect(params.response.end).toHaveBeenCalled();
    });

    test('GET /home - should return home/index.html stream', async () => {
        const params = TestUtils.defaultHandleParams();
        params.request.method = 'GET';
        params.request.url = '/home';

        const mockFileStream = TestUtils.generateReadableStream(['data']);

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name
        ).mockResolvedValue({ stream: mockFileStream });

        jest.spyOn(mockFileStream, 'pipe').mockReturnValue();

        await handler(...params.values());

        expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(pages.homeHtml);
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    });

    test.todo('GET /controller - should return controller/index.html stream');
    test.todo('GET /<any-existing-file> - should return a file stream');
    test.todo('GET /unknown - should return a 404 response');

    describe('exceptions', () => { 
        test.todo('given inexistent file it should respond with 404');
        test.todo('given an error it should respond with 500');
    })
})