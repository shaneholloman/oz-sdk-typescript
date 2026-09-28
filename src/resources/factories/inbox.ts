// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import { APIPromise } from '../../core/api-promise';
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
   * Delivery routing is configured separately from Inbox assignment. Personal read
   * state (`is_read`) is included only in `mine` scope and omitted in `team` scope,
   * including when filtering by recipient.
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

  /**
   * Mark a batch of notifications as read for the authenticated user after checking
   * access to each factory. The caller must be a recipient of each existing
   * notification, and the notification must remain active; otherwise its outcome is
   * unsuccessful. Missing notifications are successful no-ops. Outcomes are returned
   * in request order.
   */
  markRead(body: InboxMarkReadParams, options?: RequestOptions): APIPromise<InboxMarkReadResponse> {
    return this._client.post('/factory-inbox/notifications/read', { body, ...options });
  }

  /**
   * Mark a batch of notifications as unread for the authenticated user after
   * checking access to each factory. The caller must be a recipient of each existing
   * notification, and the notification must remain active; otherwise its outcome is
   * unsuccessful. Missing notifications are successful no-ops. Outcomes are returned
   * in request order.
   */
  markUnread(body: InboxMarkUnreadParams, options?: RequestOptions): APIPromise<InboxMarkUnreadResponse> {
    return this._client.post('/factory-inbox/notifications/unread', { body, ...options });
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
   * Whether the authenticated user has read this notification. Always present in
   * `mine` scope, including when false. Omitted in `team` scope, even when filtering
   * by recipient.
   */
  is_read?: boolean;

  /**
   * Server-derived link back to the task's origin, when present.
   */
  origin_link?: string;

  questions?: Array<InboxItem.Question>;

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

export namespace InboxItem {
  export interface Question {
    id: string;

    options: Array<string>;

    question: string;

    type: 'single_select' | 'multi_select';

    recommended_option_index?: number;
  }
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

export interface InboxMarkReadResponse {
  outcomes: Array<InboxMarkReadResponse.Outcome>;
}

export namespace InboxMarkReadResponse {
  export interface Outcome {
    notification_uid: string;

    ok: boolean;
  }
}

export interface InboxMarkUnreadResponse {
  outcomes: Array<InboxMarkUnreadResponse.Outcome>;
}

export namespace InboxMarkUnreadResponse {
  export interface Outcome {
    notification_uid: string;

    ok: boolean;
  }
}

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

export interface InboxMarkReadParams {
  notification_uids: Array<string>;
}

export interface InboxMarkUnreadParams {
  notification_uids: Array<string>;
}

export declare namespace Inbox {
  export {
    type InboxItem as InboxItem,
    type InboxRecipient as InboxRecipient,
    type InboxScope as InboxScope,
    type InboxMarkReadResponse as InboxMarkReadResponse,
    type InboxMarkUnreadResponse as InboxMarkUnreadResponse,
    type InboxItemsFactoryInboxCursorPage as InboxItemsFactoryInboxCursorPage,
    type InboxListParams as InboxListParams,
    type InboxMarkReadParams as InboxMarkReadParams,
    type InboxMarkUnreadParams as InboxMarkUnreadParams,
  };
}
