// File generated from our OpenAPI spec by Stainless. See CONTRIBUTING.md for details.

import { APIResource } from '../../core/resource';
import * as AgentAPI from '../agent/agent';
import * as RunsAPI from './runs';
import { RunCreateParams, RunCreateResponse, Runs } from './runs';
import { APIPromise } from '../../core/api-promise';
import { FactoriesCursorPage, type FactoriesCursorPageParams, PagePromise } from '../../core/pagination';
import { RequestOptions } from '../../internal/request-options';
import { path } from '../../internal/utils/path';

/**
 * Operations for creating and managing factories
 */
export class Factories extends APIResource {
  runs: RunsAPI.Runs = new RunsAPI.Runs(this._client);

  /**
   * List factories accessible to the authenticated principal. An optional team_uid
   * query parameter restricts results to a single team, and an optional search query
   * parameter filters by a case-insensitive substring match on the factory name or
   * alias.
   */
  list(
    query: FactoryListParams | null | undefined = {},
    options?: RequestOptions,
  ): PagePromise<FactoriesFactoriesCursorPage, Factory> {
    return this._client.getAPIList('/factory', FactoriesCursorPage<Factory>, { query, ...options });
  }

  /**
   * Get a factory by its public UID.
   */
  get(uid: string, options?: RequestOptions): APIPromise<Factory> {
    return this._client.get(path`/factory/${uid}`, options);
  }
}

export type FactoriesFactoriesCursorPage = FactoriesCursorPage<Factory>;

/**
 * Public representation of a factory.
 */
export interface Factory {
  /**
   * Default execution settings inherited by the factory's named agents when they
   * declare no override of their own.
   */
  agent_defaults: Factory.AgentDefaults;

  /**
   * Optional display handle for the factory, unique across the team's Warp workspace
   * when set.
   */
  alias: string | null;

  /**
   * Short-lived signed URL for displaying the factory's avatar. The URL may change
   * between reads.
   */
  avatar_url: string | null;

  /**
   * Source-control provider hosting the factory's repositories. NONE declares a
   * repo-less factory with no native repositories; its environment relies on
   * setup_commands to clone from any host instead.
   */
  code_forge: 'GITHUB' | 'GITLAB' | 'NONE';

  /**
   * Time the factory was created.
   */
  created_at: string;

  /**
   * Default credential strategy for runs executed by the factory's named agents.
   *
   * - EXECUTOR (default): runs authenticate with the named agent's own credentials
   *   (e.g. a GitHub App installation token for the factory's team).
   * - CREATOR: runs authenticate with the credentials of the principal that created
   *   the run.
   */
  credential_strategy: 'CREATOR' | 'EXECUTOR';

  /**
   * Public UID of the factory's default environment. File-managed factories may omit
   * this default.
   */
  default_environment: string | null;

  /**
   * The default model ID for the factory's runs. File-managed factories may omit
   * this default. Live-managed create and PATCH requests still capture a concrete
   * validated model ID.
   */
  default_model: string | null;

  /**
   * Optional description of the factory.
   */
  description: string | null;

  /**
   * Integration providers attached to the factory, independent of the automation
   * triggers configured for it. null means the factory has not declared anything
   * yet; an empty array means no providers are attached.
   */
  integrations: Array<Factory.Integration> | null;

  /**
   * Display name of the factory.
   */
  name: string;

  /**
   * Repositories scoped to the factory, independent of its default environment.
   */
  repositories: Array<Factory.Repository>;

  scoring: Factory.Scoring;

  /**
   * Public UID of the team that owns the factory.
   */
  team_uid: string;

  /**
   * Public UID of the factory.
   */
  uid: string;

  /**
   * Time the factory was last updated.
   */
  updated_at: string;

  /**
   * The user who created a factory, when resolvable.
   */
  creator?: Factory.Creator;
}

export namespace Factory {
  /**
   * Default execution settings inherited by the factory's named agents when they
   * declare no override of their own.
   */
  export interface AgentDefaults {
    /**
     * Default runner UID for the factory's named agents. Empty when unset, in which
     * case the environment's default runner applies.
     */
    default_runner_uid: string;

    /**
     * MCP server configurations attached to the factory's named agents by default.
     * Only warp_id (managed MCP) entries are representable for a Warp-managed factory.
     */
    mcp_servers: { [key: string]: AgentAPI.McpServerConfig };

    /**
     * Secrets attached to the factory's named agents by default.
     */
    secrets: Array<AgentDefaults.Secret>;

    /**
     * Default worker host for the factory's named agents. Empty when unset, in which
     * case the workspace default applies.
     */
    worker_host: string;

    /**
     * Specifies which execution harness to use for the agent run. Default (nil/empty)
     * uses Warp's built-in harness. When stored as a named agent's default
     * (create/update agent identity), this field replaces the deprecated
     * base_harness/base_model pair: a harness other than `oz` here requires the
     * agent's base_model to be empty, since the two describe mutually exclusive
     * default models.
     */
    harness?: AgentDefaults.Harness;

    /**
     * Authentication secrets for third-party harnesses. Only the secret for the
     * harness specified gets injected into the environment.
     */
    harness_auth_secrets?: AgentDefaults.HarnessAuthSecrets;
  }

  export namespace AgentDefaults {
    /**
     * Reference to a managed secret by name.
     */
    export interface Secret {
      /**
       * Name of the managed secret.
       */
      name: string;
    }

    /**
     * Specifies which execution harness to use for the agent run. Default (nil/empty)
     * uses Warp's built-in harness. When stored as a named agent's default
     * (create/update agent identity), this field replaces the deprecated
     * base_harness/base_model pair: a harness other than `oz` here requires the
     * agent's base_model to be empty, since the two describe mutually exclusive
     * default models.
     */
    export interface Harness {
      /**
       * Model to use with a third-party harness (e.g. "claude-haiku-4-5"). Only applies
       * when type is a harness other than `oz`; the top-level config model_id targets
       * the built-in Warp harness instead. When omitted or empty, the harness uses its
       * own default model.
       */
      model_id?: string;

      /**
       * Reasoning effort for harnesses that support it (e.g. Codex). Only applies when
       * type is a harness other than `oz`. Ignored by harnesses that do not support
       * reasoning levels.
       */
      reasoning_level?: string;

      /**
       * The harness type identifier.
       *
       * - oz: Warp's built-in harness (default)
       * - claude: Claude Code harness
       * - gemini: Gemini CLI harness
       * - codex: Codex CLI harness
       */
      type?: 'oz' | 'claude' | 'gemini' | 'codex';
    }

    /**
     * Authentication secrets for third-party harnesses. Only the secret for the
     * harness specified gets injected into the environment.
     */
    export interface HarnessAuthSecrets {
      /**
       * Name of a managed secret for Claude Code harness authentication. The secret must
       * exist within the caller's personal or team scope. Only applicable when harness
       * type is "claude".
       */
      claude_auth_secret_name?: string;

      /**
       * Name of a managed secret for Codex harness authentication. The secret must exist
       * within the caller's personal or team scope. Only applicable when harness type is
       * "codex".
       */
      codex_auth_secret_name?: string;
    }
  }

  /**
   * An integration provider attached to a factory.
   */
  export interface Integration {
    /**
     * Integration provider that can be attached to a factory. github is not accepted
     * here; repository access comes from the factory's code forge.
     */
    type: 'jira' | 'linear' | 'slack';
  }

  /**
   * A repository scoped to a factory.
   */
  export interface Repository {
    /**
     * Repository owner (or full namespace for GitLab).
     */
    owner: string;

    /**
     * Repository name.
     */
    repo: string;
  }

  export interface Scoring {
    /**
     * Optional factory override for the model used by managed scorers and
     * scorer-creation prefills. null or absent resolves to the platform judge default.
     * User-created scorers still require an explicit model_id on create.
     */
    default_model: string | null;
  }

  /**
   * The user who created a factory, when resolvable.
   */
  export interface Creator {
    /**
     * Firebase UID of the user who created the factory.
     */
    uid: string;

    /**
     * Creator's email, when available.
     */
    email?: string | null;
  }
}

export interface FactoryListParams extends FactoriesCursorPageParams {
  /**
   * Case-insensitive substring search over the factory name and alias.
   */
  search?: string;

  /**
   * Optional team UID to filter factories by ownership.
   */
  team_uid?: string;
}

Factories.Runs = Runs;

export declare namespace Factories {
  export {
    type Factory as Factory,
    type FactoriesFactoriesCursorPage as FactoriesFactoriesCursorPage,
    type FactoryListParams as FactoryListParams,
  };

  export {
    Runs as Runs,
    type RunCreateResponse as RunCreateResponse,
    type RunCreateParams as RunCreateParams,
  };
}
