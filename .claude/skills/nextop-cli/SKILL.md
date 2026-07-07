---
name: nextop-cli
description: Use for `mention://agent-session?...` links, Nextop CLI command syntax, and daemon context lookup when no more specific Nextop skill applies; also serves as the command reference for injected Nextop skills.
---

# Nextop CLI

Use this skill when you need the Nextop CLI command reference, need to inspect an AgentGUI session from a `mention://agent-session?...` link, or need to inspect workspace context through the local Nextop daemon and no more specific Nextop skill applies.

If you are actively executing or breaking down a workspace issue handoff, prefer the dedicated `issue-manager` skill for workflow guidance and use this skill as the CLI reference it depends on.

Issue execution sequencing belongs to the `issue-manager` skill. Do not use this command reference alone to decide whether an issue-level execution should call `issue run create` or iterate child tasks with `issue task run create`.

For workspace issue breakdowns, use issue/task inspection commands plus `issue task create` or `issue task update` to persist child tasks. `issue run create`, `issue task run create`, and their matching `complete` commands are execution-mode commands only; do not use them for breakdown-only work.

## Workspace Issue Run Reporting

When creating issue runs, use the current AgentGUI runtime metadata below for `--agent-provider` and `--agent-session-id`. Do not invent a provider or session id.

When completing issue runs, include `--outputs` whenever the execution created or materially updated deliverable files. `--outputs` is a JSON array string; each item must include `path`, and may also include `displayName`, `title`, `mediaType`, `sizeBytes`, or `outputId`.

Example complete payload:

```bash
--status completed --summary "<summary>" --outputs '[{"path":"<artifact-path>","displayName":"<artifact-name>"}]' --json
```

If the execution produced no file or URL artifact, complete the run with a clear `--summary` and omit `--outputs`.

## Execution Environment

The Nextop CLI communicates with the local Nextop daemon over localhost/IPC. Run Nextop CLI commands in an execution environment that can access the user's local host daemon and the injected Nextop CLI path. If your provider offers multiple command environments or permission modes, choose the one that permits localhost/IPC access for this CLI. Do not modify global sandbox settings yourself. If no such environment is available, explain that the local Nextop daemon is not accessible from the current execution environment.

## Commands

- List issue topics: `nextop issue topic list` - List workspace issue topics. Use a returned topicId when listing or creating issues.
- Create an issue topic: `nextop issue topic create --title <title>` - Create a workspace issue topic.
- Update an issue topic: `nextop issue topic update --topic-id <topic-id> --title <title> --json` - Update a workspace issue topic title, summary, or pin state.
- Delete an issue topic: `nextop issue topic delete --topic-id <topic-id>` - Delete an empty non-default issue topic.
- List issues: `nextop issue list --topic-id <topic-id>` - List issue records in a specific workspace topic.
- Get issue detail: `nextop issue get --issue-id <issue-id>` - Get an issue detail record and its tasks.
- Update an issue: `nextop issue update --issue-id <issue-id> --status completed --json` - Update issue title, content, or status.
- List issue tasks: `nextop issue task list --issue-id <issue-id>` - List tasks under an issue.
- Get issue task detail: `nextop issue task get --issue-id <issue-id> --task-id <task-id>` - Get task detail, latest run, recent runs, and latest outputs.
- Create an issue task: `nextop issue task create --issue-id <issue-id> --title <title>` - Create a child task under an issue. Use this to persist task breakdown output without creating a run.
- Update an issue task: `nextop issue task update --issue-id <issue-id> --task-id <task-id> --status completed --json` - Update a task under an issue. Breakdown updates should edit task fields without creating or completing runs.
- Delete an issue task: `nextop issue task delete --issue-id <issue-id> --task-id <task-id>` - Delete a task under an issue.
- Create an issue run: `nextop issue run create --agent-provider <agent-provider> --agent-session-id <agent-session-id> --issue-id <issue-id> --json` - Create an execution run for an issue. Do not use for breakdown-only work.
- Complete an issue run: `nextop issue run complete --issue-id <issue-id> --run-id <run-id> --status <status> --summary <summary> --outputs '[{"path":"<artifact-path>"}]' --json` - Complete an issue-level execution run and attach output metadata. Do not use for breakdown-only work.
- Create an issue task run: `nextop issue task run create --agent-provider <agent-provider> --agent-session-id <agent-session-id> --issue-id <issue-id> --task-id <task-id> --json` - Create an execution run for an issue task. Do not use for breakdown-only work.
- Complete an issue task run: `nextop issue task run complete --issue-id <issue-id> --run-id <run-id> --status <status> --task-id <task-id> --summary <summary> --outputs '[{"path":"<artifact-path>"}]' --json` - Complete an execution run and attach output metadata. Do not use for breakdown-only work.
- List agent sessions: `nextop agent sessions` - List agent sessions in the current workspace.
- Get agent session messages: `nextop agent session-summary --session-id <session-id>` - Get recent messages for an agent session.
- Show active peer agents: `nextop agent active-peers` - Show logical active peer agents in the current workspace before editing files.
- Cancel an agent session: `nextop agent cancel --session-id <session-id>` - Cancel an agent session in the current workspace.
- Get agent composer options: `nextop agent composer-options --provider <provider>` - Get provider-specific model and reasoning options without starting an agent session.
- Get an agent session: `nextop agent get --session-id <session-id>` - Get one agent session in the current workspace.
- List agent sessions: `nextop agent list` - List agent sessions in the current workspace.
- Request AgentGUI open: `nextop agent open --session-id <session-id>` - Request desktop AgentGUI activation for an existing agent session.
- List available agent providers: `nextop agent providers` - List agent providers and whether nextopd can start their local runtime command.
- Send input to an agent session: `nextop agent send --prompt <prompt> --session-id <session-id>` - Send user input to an existing agent session.
- Get agent session messages: `nextop agent session messages --session-id <session-id>` - Get recent messages for an agent session.
- Start an agent session: `nextop agent start --provider <provider>` - Start an agent session in the current workspace. Use --show to request AgentGUI activation.
- Cancel an agent run: `nextop aimc agent cancel --run-id <run-id>` - Cancel an active agent run by run-id. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- Poll agent events: `nextop aimc agent events --run-id <run-id>` - Poll persisted events for an agent run. Use cursor from the previous response nextCursor to continue. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- Start an agent run: `nextop aimc agent run --conversation-id <conversation-id> --prompt <prompt> --session-id <session-id>` - Start an AI Media Canvas agent run for a session and conversation. Poll events with aimc agent events --run-id <runId>. For local agents, pass --runtime-kind local-agent --runtime-provider codex or --runtime-provider claude; when model is omitted the provider default is used. If model is provided with a local provider, use a matching provider-prefixed model such as codex:default or claude:default from aimc models list. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- Get a canvas: `nextop aimc canvases get --canvas-id <canvas-id>` - Return canvas content by canvas-id. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- Save a canvas: `nextop aimc canvases save --canvas-id <canvas-id> --content-json <content-json>` - Save canvas content by canvas-id. Pass content-json as a JSON string matching the canvas content object. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- Queue image generation: `nextop aimc generation image --model <model> --prompt <prompt>` - Queue an image generation job. Use aimc models image to inspect available model ids first, pass one with --model, and use jobs get or jobs list to monitor status. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- Queue video generation: `nextop aimc generation video --model <model> --prompt <prompt>` - Queue a video generation job. Use aimc models video to inspect available model ids first, pass one with --model, and use jobs get or jobs list to monitor status. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- Cancel a job: `nextop aimc jobs cancel --job-id <job-id>` - Cancel one queued or running background job by job-id. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- Get a job: `nextop aimc jobs get --job-id <job-id>` - Return one background job by job-id. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- List jobs: `nextop aimc jobs list` - List background generation jobs. Filter with status or job-type when needed. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- Create a chat message: `nextop aimc messages create --content <content> --role <role> --session-id <session-id>` - Append a text-only user or assistant message to a chat session. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- List chat messages: `nextop aimc messages list --session-id <session-id>` - List messages in a chat session by session-id. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- List image models: `nextop aimc models image` - List image generation models available to generation image. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- List agent models: `nextop aimc models list` - List configured assistant and local-agent models available to agent runs. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- List video models: `nextop aimc models video` - List video generation models available to generation video. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- Create a project: `nextop aimc projects create --name <name>` - Create a local AI Media Canvas project. Use the returned primaryCanvas.id before saving canvas content. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- Get a project: `nextop aimc projects get --project-id <project-id>` - Return one local AI Media Canvas project by project-id. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- List projects: `nextop aimc projects list` - List local AI Media Canvas projects. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- Create a chat session: `nextop aimc sessions create --canvas-id <canvas-id>` - Create a chat session for a canvas-id. Use the returned session.id for messages and agent runs. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- List chat sessions: `nextop aimc sessions list --canvas-id <canvas-id>` - List chat sessions for a canvas-id. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- Enable or disable a skill: `nextop aimc skills enable --enabled <enabled> --skill-id <skill-id>` - Enable or disable an installed skill by skill-id. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- Get a skill: `nextop aimc skills get --skill-id <skill-id>` - Return skill detail by skill-id. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- Install a bundled skill: `nextop aimc skills install --skill-id <skill-id>` - Install a bundled catalog skill by skill-id. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- List skills: `nextop aimc skills list` - List installed AI Media Canvas skills. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- Show app status: `nextop aimc status` - Return AI Media Canvas server health, app version, and local runtime metadata. Provided by workspace app AI Media Canvas. App id: ai-media-canvas.
- Submit an automation run status: `nextop automation complete-run --run-id <run-id> --status <status>` - Submit the final structured status for the current automation run. Provided by workspace app Automation. App id: automation.
- Create an automation: `nextop automation create --name <name> --prompt <prompt>` - Create an automation definition. Provided by workspace app Automation. App id: automation.
- Delete an automation: `nextop automation delete --automation-id <automation-id>` - Delete one automation definition and its run history by id. Provided by workspace app Automation. App id: automation.
- Get an automation: `nextop automation get` - Get one automation definition by id or exact name. Provided by workspace app Automation. App id: automation.
- List automations: `nextop automation list` - List automation definitions. Provided by workspace app Automation. App id: automation.
- Run an automation: `nextop automation run` - Trigger one automation immediately by id or exact name. Provided by workspace app Automation. App id: automation.
- List automation runs: `nextop automation runs` - List recent automation runs, optionally filtered by automation id. Provided by workspace app Automation. App id: automation.
- Update an automation: `nextop automation update --automation-id <automation-id>` - Update one automation definition by id. Omitted fields keep their current values. Provided by workspace app Automation. App id: automation.
- Show a radar board: `nextop radar board` - Return the complete board for the latest or selected date. Provided by workspace app Daily Product Radar. App id: daily-tech-radar.
- Show one radar card: `nextop radar item --id <id>` - Return one full normalized radar card by id. Provided by workspace app Daily Product Radar. App id: daily-tech-radar.
- Search radar cards: `nextop radar search` - Return cards filtered by date, locale, source, category, and query. Provided by workspace app Daily Product Radar. App id: daily-tech-radar.
- List preview comments: `nextop vibe-design comments --conversation-id <conversation-id> --project-id <project-id>` - List comments for a project conversation. Provided by workspace app Vibe Design. App id: vibe-design.
- Get conversation messages: `nextop vibe-design conversation-messages --conversation-id <conversation-id> --project-id <project-id>` - Return all messages in a project conversation. Provided by workspace app Vibe Design. App id: vibe-design.
- List project conversations: `nextop vibe-design conversations --project-id <project-id>` - List conversations for one project. Provided by workspace app Vibe Design. App id: vibe-design.
- Get a project resource: `nextop vibe-design file-get --name <name> --project-id <project-id>` - Return a file resource. Text files use utf8; binary files use base64. Provided by workspace app Vibe Design. App id: vibe-design.
- List project resources: `nextop vibe-design files --project-id <project-id>` - List file resources for one project, including each resource's static HTTP URL. Provided by workspace app Vibe Design. App id: vibe-design.
- List Vibe Design projects: `nextop vibe-design projects` - List projects in the current Vibe Design workspace. Provided by workspace app Vibe Design. App id: vibe-design.
- Create an issue: `nextop issue create --title <title> --topic-id <topic-id>` - Create an issue in a specific workspace topic.
- Delete an issue: `nextop issue delete --issue-id <issue-id>` - Delete an issue from the current workspace.
- Get issue task run detail: `nextop issue task run get --issue-id <issue-id> --run-id <run-id> --task-id <task-id>` - Get run detail and outputs for an issue task.
- List issue task runs: `nextop issue task run list --issue-id <issue-id> --task-id <task-id>` - List runs for an issue task.

The current AgentGUI session is `6c4bda32-f9a3-424a-991e-c71d699bb3e0`.
The current AgentGUI provider is `claude-code`.
