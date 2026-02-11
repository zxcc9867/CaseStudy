import { NextResponse } from "next/server";
import { getOpenAIClient, hasOpenAIKey } from "@/lib/openai";

export async function POST(request: Request) {
  if (!hasOpenAIKey()) {
    return NextResponse.json(
      {
        error: "API_KEY_MISSING",
        message:
          "OPENAI_API_KEY가 설정되지 않았습니다. .env 파일에 API 키를 추가해 주세요.",
      },
      { status: 503 }
    );
  }

  let body: {
    caseQuestion?: string;
    conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
    userQuestion?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "INVALID_BODY", message: "JSON 본문이 필요합니다." },
      { status: 400 }
    );
  }

  const caseQuestion = typeof body?.caseQuestion === "string" ? body.caseQuestion.trim() : "";
  const userQuestion = typeof body?.userQuestion === "string" ? body.userQuestion.trim() : "";
  const conversationHistory = Array.isArray(body?.conversationHistory) ? body.conversationHistory : [];

  if (!caseQuestion || !userQuestion) {
    return NextResponse.json(
      {
        error: "MISSING_FIELDS",
        message: "caseQuestion과 userQuestion은 필수입니다.",
      },
      { status: 400 }
    );
  }

  const client = getOpenAIClient();
  if (!client) {
    return NextResponse.json(
      { error: "API_KEY_MISSING", message: "OpenAI API 키를 확인해 주세요." },
      { status: 503 }
    );
  }

  try {
    // 대화 히스토리를 메시지 배열로 구성
    const messages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
      {
        role: "system",
        content: `당신은 컨설팅 펌(맥킨시, BCG, 베인 등) 케이스 면접의 면접관입니다.
지원자가 케이스 문제에 대해 추가 정보를 요청하면, 면접관처럼 답변해 주세요.

면접관 역할:
- 지원자의 질문에 대해 적절한 정보를 제공합니다
- 때로는 "그건 당신이 분석해야 할 부분입니다" 같은 답변도 할 수 있습니다
- 현실적이고 구체적인 정보를 제공하되, 모든 것을 다 알려주지는 않습니다
- 한국어로 답변합니다
- 답변은 간결하고 명확하게 (1~3문장)

대화 컨텍스트를 고려하여 일관성 있게 답변하세요.`,
      },
      {
        role: "user",
        content: `[케이스 문제]\n${caseQuestion}`,
      },
    ];

    // 이전 대화 히스토리 추가
    conversationHistory.forEach((msg) => {
      if (msg.role === "user" || msg.role === "assistant") {
        messages.push({
          role: msg.role,
          content: msg.content,
        });
      }
    });

    // 현재 사용자 질문 추가
    messages.push({
      role: "user",
      content: userQuestion,
    });

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages,
      temperature: 0.7,
      max_tokens: 300,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "NO_RESPONSE", message: "AI가 응답을 생성하지 못했습니다." },
        { status: 502 }
      );
    }

    return NextResponse.json({ answer: content.trim() });
  } catch (err) {
    console.error("[ask-question]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        error: "OPENAI_ERROR",
        message: message.includes("API key") ? "API 키가 올바르지 않습니다." : "답변 생성 중 오류가 발생했습니다.",
      },
      { status: 502 }
    );
  }
}
