import { Manifest } from "deno-slack-sdk/mod.ts";
import { GenerateAIIncidentSummary } from "./functions/ai_incident_summary.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/future/manifest
 */
export default Manifest({
  name: "get-reacji-text",
  description: "get text of the reacted message",
  icon: "assets/default_new_app_icon.png",
  functions: [GenerateAIIncidentSummary],
  workflows: [],
  outgoingDomains: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "channels:history",
  ],
});
