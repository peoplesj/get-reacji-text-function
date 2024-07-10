import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const GenerateAIIncidentSummary = DefineFunction({
  callback_id: "ai_incident_summary",
  title: "get text of the reacted message",
  description: "save the incident summary and title as output variables",
  source_file: "functions/ai_incident_summary.ts",
  input_parameters: {
    properties: {
      timestamp_of_original_message: {
        type: Schema.types.string,
        description: "details about the incident",
      },
      channel_id: {
        type: Schema.types.string,
        description: "Channel ID, display option example: 'C123' ",
      },
    },
    required: ["timestamp_of_original_message", "channel_id"],
  },
  output_parameters: {
    properties: {
      original_message_text: {
        type: Schema.types.string,
        description: "A title for the incident",
      },
    },
    required: ["original_message_text"],
  },
});

export default SlackFunction(
  GenerateAIIncidentSummary,
  async ({ client, inputs }) => {
    let originalMessageText = "";
    try {
      const messageHistoryResponse = await client.conversations.history({
        channel: inputs.channel_id,
        oldest: inputs.timestamp_of_original_message,
        inclusive: true,
        limit: 1,
      });
      // The text from the message that was reacted to
      originalMessageText = messageHistoryResponse.messages[0].text;
      console.log("Original message:", originalMessageText);
    } catch (error) {
      console.error("trying: client.conversations.history", error);
    }

    // Specifying these variables as output will allow them to be used by the next step in the workflow
    return {
      outputs: {
        original_message_text: originalMessageText,
      },
    };
  },
);
