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
    question?: string;
    userAnswer?: string;
    conversationHistory?: Array<{ role: "user" | "assistant"; content: string }>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "INVALID_BODY", message: "JSON 본문이 필요합니다." },
      { status: 400 }
    );
  }

  const question = typeof body?.question === "string" ? body.question.trim() : "";
  const userAnswer = typeof body?.userAnswer === "string" ? body.userAnswer.trim() : "";
  const conversationHistory = Array.isArray(body?.conversationHistory) ? body.conversationHistory : [];

  if (!question || !userAnswer) {
    return NextResponse.json(
      {
        error: "MISSING_FIELDS",
        message: "question과 userAnswer는 필수입니다.",
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
    // 대화 히스토리 요약 (평가에 포함)
    let conversationContext = "";
    if (conversationHistory.length > 0) {
      conversationContext = "\n\n[지원자의 추가 질문과 면접관의 답변]\n";
      conversationHistory.forEach((msg, idx) => {
        if (msg.role === "user") {
          conversationContext += `\n지원자: ${msg.content}\n`;
        } else if (msg.role === "assistant") {
          conversationContext += `면접관: ${msg.content}\n`;
        }
      });
    }

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `당신은 컨설팅 케이스 면접의 평가자입니다. 지원자의 답변을 상세히 분석하고 평가하며, 모범 답안을 제시해 주세요.

평가 시 고려사항:
- 문제 이해도
- 추가 정보 요청(질문)의 적절성과 질
- 논리적 사고 과정
- 구조화된 접근
- 최종 답변의 완성도
- 대화 히스토리가 있다면, 질문을 통해 정보를 얻고 활용한 과정도 평가에 포함

평가는 한국어로, 객관적이고 구체적으로 작성합니다.
응답은 반드시 아래 JSON 형식만 출력하세요. 다른 설명은 붙이지 마세요.
{
  "score": 1~100 점수(숫자만),
  "summary": "전체 요약 평가 (2~4문장)",
  "analysis": "지원자 답변에 대한 상세 분석 (3~5문장). 답변의 구조, 논리, 강점과 약점을 구체적으로 분석",
  "strengths": ["강점1", "강점2", ...],
  "improvements": ["개선점1", "개선점2", ...],
  "modelAnswer": {
    "approach": "이 문제에 접근하는 방법 (1~2문장)",
    "framework": "사용할 프레임워크 (예: MECE, 3C, 4P, Porter's Five Forces 등)와 그 이유",
    "problemBreakdown": "문제를 어떻게 분해할지 (구체적인 단계별 접근)",
    "solutions": ["해결책1", "해결책2", "해결책3", ...],
    "prioritization": "해결책들의 우선순위 결정 근거와 기준"
  }
}`,
        },
        {
          role: "user",
          content: `[문제]\n${question}${conversationContext}\n\n[지원자 최종 답변]\n${userAnswer}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.4,
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      return NextResponse.json(
        { error: "NO_RESPONSE", message: "AI가 평가를 생성하지 못했습니다." },
        { status: 502 }
      );
    }

    const parsed = JSON.parse(content) as {
      score?: number;
      summary?: string;
      analysis?: string;
      strengths?: string[];
      improvements?: string[];
      modelAnswer?: {
        approach?: string;
        framework?: string;
        problemBreakdown?: string;
        solutions?: string[];
        prioritization?: string;
      };
    };

    const result = {
      score: typeof parsed.score === "number" ? Math.min(100, Math.max(0, parsed.score)) : 0,
      summary: typeof parsed.summary === "string" ? parsed.summary : "",
      analysis: typeof parsed.analysis === "string" ? parsed.analysis : "",
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
      improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
      modelAnswer: {
        approach: typeof parsed.modelAnswer?.approach === "string" ? parsed.modelAnswer.approach : "",
        framework: typeof parsed.modelAnswer?.framework === "string" ? parsed.modelAnswer.framework : "",
        problemBreakdown: typeof parsed.modelAnswer?.problemBreakdown === "string" ? parsed.modelAnswer.problemBreakdown : "",
        solutions: Array.isArray(parsed.modelAnswer?.solutions) ? parsed.modelAnswer.solutions : [],
        prioritization: typeof parsed.modelAnswer?.prioritization === "string" ? parsed.modelAnswer.prioritization : "",
      },
    };

    return NextResponse.json(result);
  } catch (err) {
    console.error("[evaluate]", err);
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json(
      {
        error: "OPENAI_ERROR",
        message: message.includes("API key") ? "API 키가 올바르지 않습니다." : "평가 중 오류가 발생했습니다.",
      },
      { status: 502 }
    );
  }
}
