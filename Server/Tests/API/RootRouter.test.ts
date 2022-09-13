import { app } from "../../src/API/RootRouter";
import { describe, test, expect } from '@jest/globals';

describe('Testing main router and 1st level API endpoints', () => {
    test('Application main router exists', () => {
        expect(app).not.toBe(null);
    });
});