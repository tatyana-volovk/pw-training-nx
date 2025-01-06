import { test as base, APIRequestContext, request } from '@playwright/test';



type APIRequestFixture = {
  apiRequest: APIRequestContext;
};
export const test = base.extend<APIRequestFixture>({

  apiRequest: async ({}, use) => {
    test.skip(test.info().project.name!='chromium', 'Test can be executed only in Chrome');
    const apiRequestContext = await request.newContext({
      baseURL: 'https://reqres.in/api/',
    });

    await use(apiRequestContext);
    await apiRequestContext.dispose();
  },
});

export { expect, APIResponse } from '@playwright/test';