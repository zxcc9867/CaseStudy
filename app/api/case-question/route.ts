import { NextResponse } from "next/server";
import { getOpenAIClient, hasOpenAIKey } from "@/lib/openai";

const CASE_CATEGORIES = [
  "market-sizing",
  "profitability",
  "strategy",
  "brainstorming",
  "misc",
] as const;

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

  let category: string = "misc";
  let customTopic: string | undefined;
  try {
    const body = await request.json();
    if (body?.category && CASE_CATEGORIES.includes(body.category as (typeof CASE_CATEGORIES)[number])) {
      category = body.category;
    }
    if (typeof body?.customTopic === "string" && body.customTopic.trim() !== "") {
      customTopic = body.customTopic.trim();
    }
  } catch {
    // body 없거나 JSON 아님 → 기본값 사용
  }

  const client = getOpenAIClient();
  if (!client) {
    return NextResponse.json(
      { error: "API_KEY_MISSING", message: "OpenAI API 키를 확인해 주세요." },
      { status: 503 }
    );
  }

  const categoryLabel: Record<string, string> = {
    "market-sizing": "시장 규모 추정",
    profitability: "수익성",
    strategy: "전략",
    brainstorming: "브레인스토밍",
    misc: "기타",
  };

  try {
    // 커스텀 주제가 있으면 그 주제로, 없으면 카테고리로 문제 생성
    const userPrompt = customTopic
      ? `다음 주제에 대한 컨설팅 케이스 면접 문제를 한 개 만들어 주세요: "${customTopic}"\n\n문제는 실제 비즈니스 상황을 반영하고, 구체적인 데이터와 맥락을 포함해야 합니다.`
      : `${categoryLabel[category] ?? "기타"} 유형의 케이스 면접 문제를 한 개 만들어 주세요.`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `당신은 컨설팅 펌(맥킨지, BCG, 베인 등) 케이스 면접을 진행하는 면접관입니다.
한국어로 컨설팅 케이스 면접 문제 하나를 출제해 주세요.
응답은 반드시 아래 JSON 형식만 출력하세요. 다른 설명은 붙이지 마세요.
{"title":"문제 제목","category":"${category}","question":"면접에서 말할 문제 본문 (2~4문단, 구체적 상황과 질문 포함)"}`,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "NO_RESPONSE", message: "AI가 응답을 생성하지 못했습니다." },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(content) as {
      title?: string;
      category?: string;
      question?: string;
    };
    const question = {
      id: `gen-${Date.now()}`,
      title: parsed.title ?? "케이스 문제",
      category: parsed.category ?? category,
      question: parsed.question ?? content,
    };

    return NextResponse.json(question);
  } catch (err) {
    console.error("[case-question]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        error: "OPENAI_ERROR",
        message: message.includes("API key") ? "API 키가 올바르지 않습니다." : "질문 생성 중 오류가 발생했습니다.",
      },
      { status: 502 }
    );
  }
}
