// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Operations for running and managing cloud agents
 */
export class Conversations extends APIResource {
  /**
   * Check whether a conversation should redirect to a live shared session, returning
   * a session_id if the underlying ambient agent task still has one (or an empty
   * object if no redirect is needed). Public and unauthenticated, so anonymous
   * viewers can resolve a shared conversation link before signing in; access to the
   * underlying live session is still gated by the session-sharing service ACLs.
   *
   * @example
   * ```ts
   * const response =
   *   await client.agent.conversations.checkRedirect(
   *     'conversationId',
   *   );
   * ```
   */
  checkRedirect(
    conversationID: string,
    options?: RequestOptions,
  ): APIPromise<ConversationCheckRedirectResponse> {
    return this._client.get(path`/agent/conversations/${conversationID}/redirect`, {
      ...options,
      __security: {},
    });
  }
}

export interface ConversationCheckRedirectResponse {
  /**
   * The shared session UUID to redirect to (only present when redirect is needed)
   */
  session_id?: string;
}

export declare namespace Conversations {
  export { type ConversationCheckRedirectResponse as ConversationCheckRedirectResponse };
}
