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

    test('GET /controller - should return controller/index.html stream', async () => {
        const params = TestUtils.defaultHandleParams();
        params.request.method = 'GET';
        params.request.url = '/controller';

        const mockFileStream = TestUtils.generateReadableStream(['data']);

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name
        ).mockResolvedValue({ stream: mockFileStream });

        jest.spyOn(mockFileStream, 'pipe').mockReturnValue();

        await handler(...params.values());

        expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(pages.controllerHtml);
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
    });

    test('GET /styles.css - should return a file stream', async () => {
        const params = TestUtils.defaultHandleParams();
        params.request.method = 'GET';
        params.request.url = '/styles.css';

        const mockFileStream = TestUtils.generateReadableStream(['data']);
        const expectedType = '.css';

        jest.spyOn(
            Controller.prototype,
            Controller.prototype.getFileStream.name
        ).mockResolvedValue({ stream: mockFileStream, type: expectedType });

        jest.spyOn(mockFileStream, 'pipe').mockReturnValue();

        await handler(...params.values());

        expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(params.request.url);
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
        expect(params.response.writeHead).toHaveBeenCalledWith(200, { 'Content-Type': config.constants.contentType[expectedType] });
    });

    test('GET /file.ext - should return a file stream', async () => {
        const params = TestUtils.defaultHandleParams();
        params.request.method = 'GET';
        params.request.url = '/file.ext';

        const mockFileStream = TestUtils.generateReadableStream(['data']);
        const expectedType = '.ext';

        jest.spyOn(Controller.prototype, Controller.prototype.getFileStream.name).mockResolvedValue({ stream: mockFileStream, type: expectedType });

        jest.spyOn(mockFileStream, 'pipe').mockReturnValue();

        await handler(...params.values());

        expect(Controller.prototype.getFileStream).toHaveBeenCalledWith(params.request.url);
        expect(mockFileStream.pipe).toHaveBeenCalledWith(params.response);
        expect(params.response.writeHead).not.toHaveBeenCalledWith(200, { 'Content-Type': config.constants.contentType[expectedType] });
    });

    test('GET /unknown - should return a 404 response', async () => {
        const params = TestUtils.defaultHandleParams();
        params.request.method = 'GET';
        params.request.url = '/unknown';

        await handler(...params.values());

        expect(params.response.writeHead).toHaveBeenCalledWith(404);
        expect(params.response.end).toHaveBeenCalled();
    });

    test('POST /unknown - should return a 404 response', async () => {
        const params = TestUtils.defaultHandleParams();
        params.request.method = 'POST';
        params.request.url = '/unknown';

        await handler(...params.values());

        expect(params.response.writeHead).toHaveBeenCalledWith(404);
        expect(params.response.end).toHaveBeenCalled();
    });

    describe('exceptions', () => {
        test('given inexistent file it should respond with 404', async () => {
            const params = TestUtils.defaultHandleParams();
            params.request.method = 'GET';
            params.request.url = '/index.png';

            jest.spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
                .mockRejectedValue(new Error('ENOENT: File not found'));

            await handler(...params.values());

            expect(params.response.writeHead).toHaveBeenCalledWith(404);
            expect(params.response.end).toHaveBeenCalled();
        });

        test('given an error it should respond with 500', async () => {
            const params = TestUtils.defaultHandleParams();
            params.request.method = 'GET';
            params.request.url = '/index.png';

            jest.spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
                .mockRejectedValue(new Error('File not found'));

            await handler(...params.values());

            expect(params.response.writeHead).toHaveBeenCalledWith(500);
            expect(params.response.end).toHaveBeenCalled();
        });
    })
})