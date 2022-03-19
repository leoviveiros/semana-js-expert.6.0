import { describe, test, expect, jest, beforeEach } from '@jest/globals';

import fs from 'fs';

import { Service } from '../../../server/service';

import config from '../../../server/config';
import TestUtils from '../test-utils';

describe('#Service - test suite for business rules and processing', () => {

    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test('createFileStream shoud return a readable stream', async () => {
        const mockFileStream = TestUtils.generateReadableStream(['data']);

        jest.spyOn(fs, fs.createReadStream.name)
            .mockReturnValue(mockFileStream);

        const service = new Service();
        const expectedFileStream = service.createFileStream('index.html');

        expect(expectedFileStream).toBe(mockFileStream);
    });

    test('getFileInfo should return a file info object from home/index.html', async () => {
        const fileName = config.pages.homeHtml;

        const service = new Service();

        const expectedFileInfo = await service.getFileInfo(fileName);

        expect(expectedFileInfo.name).toMatch(new RegExp(`public\\\\home\\\\index.html$$`)); // ends with home/index.html
        expect(expectedFileInfo.type).toBe('.html');
    });

    test('getFileStream should return a file stream from home/index.html', async () => {
        const mockFileStream = TestUtils.generateReadableStream(['data']);

        const service = new Service();

        jest.spyOn(service, 'createFileStream').mockReturnValue(mockFileStream);

        const result = await service.getFileStream('home/index.html');

        expect(result).toStrictEqual({
            stream: mockFileStream,
            type: '.html',
        });
    });

})