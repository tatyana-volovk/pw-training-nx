import fs from 'fs';
import path from 'path';
import { test, expect, APIResponse } from '@playwright/test';
import { parse } from 'csv-parse/sync';

const apiBaseURL = 'https://reqres.in/api';
const records = parse(fs.readFileSync(path.join(__dirname, '../test-data/post-data.csv')), {
    columns: true,
    skip_empty_lines: true
});
let response: APIResponse;
test.describe('API tests - successful requests', { tag: "@api" }, () => {
    test('Verify GET request', async ({ request }) => {
        
        await test.step('Send GET request to https://reqres.in/api/login endpoint', async () => {
            response = await request.get(apiBaseURL + '/login');
        })
        await test.step('Verify response status is good', async () => {
            expect(response).toBeOK();
        });

        await test.step('Verify that 6 items are in "data" array in response', async () => {
            const responeBody = await response.json();
            expect(responeBody.data).toHaveLength(6);
        });
    });

    test('Verify POST request', async ({ request }) => {
        await test.step('Send POST request', async () => {
            response = await request.post(apiBaseURL + '/register', {
                data: {
                    email: "eve.holt@reqres.in",
                    password: "anypassword"
                }
            });
        });

        await test.step('Check that the response is good and both "id" and "token" values have the expected types of data', async () => {
            expect(response).toBeOK();
            const responeBody = await response.json();
            expect.soft(typeof responeBody.id).toEqual('number');
            expect.soft(typeof responeBody.token).toEqual('string');
        })
    });
});

test.describe('API tests - Verify unsuccessful POST request', 
    {tag: '@api'},
    () => {
    test.skip(({ browserName }) => browserName !== 'chromium', 'API tests are supported only in Chromium');
    for (const record of records) {
        test(`${record.id}: ${record.test_case}`, async ({ request }) => {
            await test.step('Send POST request', async () => {
                response = await request.post(apiBaseURL + '/register', {
                    data: {
                        email: record.email,
                        password: record.password,
                    }
                });
            });

            await test.step('Check status is 400 and test of error message in response', async () => {
                expect(response.status()).toEqual(400);
                const responeBody = await response.json();
                expect(responeBody.error).toEqual(record.error);
            })
        });
    }
})