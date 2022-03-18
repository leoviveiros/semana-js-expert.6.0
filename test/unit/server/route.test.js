import { describe, test, expect, jest, beforeEach } from '@jest/globals';
import config from '../../config';

const { pages } = config;

describe('#Routes - test suite for api response', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.clearAllMocks();
    });

    test.todo('GET / - should redirect do home page');
    test.todo('GET /home - should return home/index.html stream');
    test.todo('GET /controller - should return controller/index.html stream');
    test.todo('GET /<any-existing-file> - should return a file stream');
    test.todo('GET /unknown - should return a 404 response');

    describe('exceptions', () => { 
        test.todo('given inexistent file it should respond with 404');
        test.todo('given an error it should respond with 500');
    })
})