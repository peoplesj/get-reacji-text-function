import { DefineFunction, Schema, SlackFunction } from "deno-slack-sdk/mod.ts";

export const GetReacjiText = DefineFunction({
  callback_id: "get_reacji_text",
  title: "get text of the reacted message",
  description: "save the incident summary and title as output variables",
  source_file: "functions/get_reacji_text.ts",
  input_parameters: {
    properties: {
      timestamp_of_the_reacted_message: {
        type: Schema.types.string,
        description: "The original message timestamp",
      },
      the_channel_where_the_reacted_message_is_in: {
        type: Schema.types.string,
        description: "Channel ID, display option example: 'C123' ",
        hint: "Click ˇ and select the display variable: `Channel ID C123`",
      },
    },
    required: [
      "timestamp_of_the_reacted_message",
      "the_channel_where_the_reacted_message_is_in",
    ],
  },
  output_parameters: {
    properties: {
      original_message_text: {
        type: Schema.types.string,
        description: "the text from the message that was reacted to",
      },
    },
    required: ["original_message_text"],
  },
});

export default SlackFunction(
  GetReacjiText,
  async ({ client, inputs }) => {
    let originalMessageText = "";
    try {
      const messageHistoryResponse = await client.conversations.history({
        channel: inputs.the_channel_where_the_reacted_message_is_in,
        oldest: inputs.timestamp_of_the_reacted_message,
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
