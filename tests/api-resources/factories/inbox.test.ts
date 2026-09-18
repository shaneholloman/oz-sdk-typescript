// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import OzAPI from 'oz-agent-sdk';

const client = new OzAPI({
  apiKey: 'My API Key',
  baseURL: process.env['TEST_API_BASE_URL'] ?? 'http://127.0.0.1:4010',
});

describe('resource inbox', () => {
  // Mock server tests are disabled
  test.skip('list', async () => {
    const responsePromise = client.factories.inbox.list();
    const rawResponse = await responsePromise.asResponse();
    expect(rawResponse).toBeInstanceOf(Response);
    const response = await responsePromise;
    expect(response).not.toBeInstanceOf(Response);
    const dataAndResponse = await responsePromise.withResponse();
    expect(dataAndResponse.data).toBe(response);
    expect(dataAndResponse.response).toBe(rawResponse);
  });

  // Mock server tests are disabled
  test.skip('list: request options and params are passed correctly', async () => {
    // ensure the request options are being passed correctly by passing an invalid HTTP method in order to cause an error
    await expect(
      client.factories.inbox.list(
        {
          cursor: 'cursor',
          factory_uid: 'factory_uid',
          limit: 1,
          recipient_uid: 'recipient_uid',
          scope: 'mine',
          team_uid: 'X-Warp-Team-Uid',
        },
        { path: '/_stainless_unknown_path' },
      ),
    ).rejects.toThrow(OzAPI.NotFoundError);
  });
});
