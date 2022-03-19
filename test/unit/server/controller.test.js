import { describe, test, expect, jest, beforeEach } from '@jest/globals';

import { Controller } from '../../../server/controller';
import { Service } from '../../../server/service';

import TestUtils from '../test-utils';

describe('#Controller - test suite for Controller class', () => {

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test('getFileStream should return a file stream from home/index.html', async () => {
        const mockFileStream = TestUtils.generateReadableStream(['data']);

        jest.spyOn(Service.prototype, Service.prototype.createFileStream.name)
            .mockReturnValue(mockFileStream);

        const controller = new Controller();
        
        const result = await controller.getFileStream('home/index.html');

        expect(result).toStrictEqual({
            stream: mockFileStream,
            type: '.html'
        })
    });

});