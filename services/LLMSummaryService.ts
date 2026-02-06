
// Generates spoiler-safe summaries using ONLY text from read chapters.
// In production, this should call OpenAI, Bedrock, or another LLM.

interface SummaryRequest {
  characterName: string;
  allowedText: string; // concatenated text from read chapters
}

export async function generateSpoilerSafeSummary(
  req: SummaryRequest
): Promise<string> {
  // IMPORTANT DESIGN PRINCIPLE:
  // The model NEVER sees text from unread chapters.
  // This is enforced by passing only allowedText.

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer YOUR_API_KEY`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages: [
          {
            role: "system",
            content:
              "You summarize characters using ONLY provided text. If unsure, say the info is not known yet. Never speculate or spoil future events.",
          },
          {
            role: "user",
            content: `Character: ${req.characterName}

Book Text:
${req.allowedText}`,
          },
        ],
      }),
    });

    const json = await response.json();

    return (
      json.choices?.[0]?.message?.content ||
      "No spoiler-safe summary available yet."
    );
  } catch (err) {
    console.error(err);
    return "Failed to generate summary.";
  }
}
