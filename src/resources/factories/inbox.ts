// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import {
  FactoryInboxCursorPage,
  type FactoryInboxCursorPageParams,
  PagePromise,
} from '../../core/pagination';
import { buildHeaders } from '../../internal/headers';
import { RequestOptions } from '../../internal/request-options';

/**
 * Operations for creating and managing factories
 */
export class Inbox extends APIResource {
  /**
   * List unresolved notifications across factories authorized for the authenticated
   * principal and active team. The default `mine` scope preserves the personal Inbox
   * and requires user credentials. The `team` scope lists notifications assigned to
   * any live recipient and can be used by user or service-account credentials.
   * Delivery routing is configured separately from Inbox assignment.
   */
  list(
    params: InboxListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<InboxItemsFactoryInboxCursorPage, InboxItem> {
    const { team_uid, ...query } = params ?? {};
    return this._client.getAPIList('/factory-inbox', FactoryInboxCursorPage<InboxItem>, {
      query,
      ...options,
      headers: buildHeaders([
        { ...(team_uid != null ? { 'X-Warp-Team-Uid': team_uid } : undefined) },
        options?.headers,
      ]),
    });
  }
}

export type InboxItemsFactoryInboxCursorPage = FactoryInboxCursorPage<InboxItem>;

/**
 * One shared unresolved notification in the Factory Inbox.
 */
export interface InboxItem {
  /**
   * Notification declaration time.
   */
  created_at: string;

  factory_task_uid: string;

  factory_uid: string;

  /**
   * The action requested by a Factory notification.
   */
  kind: 'question' | 'answer_question' | 'spec_review' | 'pr_review' | 'blocked' | 'failed';

  /**
   * Identifier accepted by the dismiss endpoint.
   */
  notification_uid: string;

  /**
   * Live, undismissed recipients for this shared notification, sorted
   * deterministically. Slack routing and personal dismissal state are not exposed.
   */
  recipients: Array<InboxRecipient>;

  /**
   * Lifecycle stage of a factory task, mirroring the seeded factory agent roles plus
   * the terminal COMPLETE and CANCELLED states. COMPLETE and CANCELLED are terminal
   * in intent but not enforced: any stage may be written explicitly at any time.
   * CANCELLED is set automatically when the task's current top-level run is
   * cancelled, regardless of that run's agent type.
   */
  stage: 'TRIAGE' | 'SPEC' | 'IMPLEMENT' | 'REVIEW' | 'COMPLETE' | 'CANCELLED';

  /**
   * Notification headline.
   */
  title: string;

  /**
   * Notification body, when present.
   */
  description?: string;

  /**
   * Server-derived link back to the task's origin, when present.
   */
  origin_link?: string;

  /**
   * Producing run ID from factory_task_notifications.created_by_run_id. Present when
   * the producing run is known.
   */
  run_id?: string;

  /**
   * Legacy first artifact URL supplied by a review notification.
   */
  url?: string;

  /**
   * Canonical artifact URLs in a composite PR review request.
   */
  urls?: Array<string>;
}

/**
 * Minimal public identity for a live notification recipient.
 */
export interface InboxRecipient {
  /**
   * Public Warp user UID.
   */
  uid: string;

  /**
   * Recipient email, when available.
   */
  email?: string;
}

/**
 * Personal or team-wide Factory Inbox visibility.
 */
export type InboxScope = 'mine' | 'team';

export interface InboxListParams extends FactoryInboxCursorPageParams {
  /**
   * Query param: Exact Factory UID filter, intersected with authorized factories.
   */
  factory_uid?: string;

  /**
   * Query param: Exact public user UID filter within the authorized Factory and team
   * scope. In `mine` scope this can only match the authenticated user.
   */
  recipient_uid?: string;

  /**
   * Query param: `mine` returns notifications assigned to the authenticated user and
   * is the default. `team` returns notifications across live recipients in the
   * authorized Factory and team scope.
   */
  scope?: InboxScope;

  /**
   * Header param: UID of the team to use as the request's active team. Ignored for
   * service-account callers, which always act as their bound team.
   */
  team_uid?: string;
}

export declare namespace Inbox {
  export {
    type InboxItem as InboxItem,
    type InboxRecipient as InboxRecipient,
    type InboxScope as InboxScope,
    type InboxItemsFactoryInboxCursorPage as InboxItemsFactoryInboxCursorPage,
    type InboxListParams as InboxListParams,
  };
}
