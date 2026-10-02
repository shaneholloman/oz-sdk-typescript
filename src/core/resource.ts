// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import type { WarpClient } from '../client';

export abstract class APIResource {
  protected _client: WarpClient;

  constructor(client: WarpClient) {
    this._client = client;
  }
}
