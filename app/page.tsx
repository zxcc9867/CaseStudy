"use client";

import { useState } from "react";

const CATEGORIES = [
  { value: "market-sizing", label: "시장 규모 추정" },
  { value: "profitability", label: "수익성" },
  { value: "strategy", label: "전략" },
  { value: "brainstorming", label: "브레인스토밍" },
  { value: "misc", label: "기타" },
  { value: "custom", label: "커스텀 주제" },
] as const;

type ConversationMessage = {
  role: "user" | "assistant";
  content: string;
};

type Feedback = {
  score: number;
  summary: string;
  analysis: string;
  strengths: string[];
  improvements: string[];
  modelAnswer: {
    approach: string;
    framework: string;
    problemBreakdown: string;
    solutions: string[];
    prioritization: string;
  };
};

export default function Home() {
  const [category, setCategory] = useState<string>("misc");
  const [customTopic, setCustomTopic] = useState("");
  const [question, setQuestion] = useState<{ id: string; title: string; question: string } | null>(null);
  const [conversationHistory, setConversationHistory] = useState<ConversationMessage[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [loadingQuestion, setLoadingQuestion] = useState(false);
  const [loadingAsk, setLoadingAsk] = useState(false);
  const [loadingEval, setLoadingEval] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGetQuestion() {
    if (category === "custom" && !customTopic.trim()) {
      setError("커스텀 주제를 입력해 주세요.");
      return;
    }
    setError(null);
    setQuestion(null);
    setConversationHistory([]);
    setCurrentQuestion("");
    setAnswer("");
    setFeedback(null);
    setLoadingQuestion(true);
    try {
      const res = await fetch("/api/case-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: category === "custom" ? "misc" : category,
          customTopic: category === "custom" ? customTopic.trim() : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "질문을 불러오지 못했습니다.");
        return;
      }
      setQuestion({
        id: data.id,
        title: data.title ?? "케이스 문제",
        question: data.question ?? "",
      });
    } catch (e) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoadingQuestion(false);
    }
  }

  async function handleAskQuestion() {
    if (!question || !currentQuestion.trim()) {
      setError("질문을 입력해 주세요.");
      return;
    }
    setError(null);
    const userQ = currentQuestion.trim();
    setCurrentQuestion("");
    setLoadingAsk(true);

    // 사용자 질문을 히스토리에 즉시 추가
    const newHistory = [...conversationHistory, { role: "user" as const, content: userQ }];
    setConversationHistory(newHistory);

    try {
      const res = await fetch("/api/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          caseQuestion: question.question,
          conversationHistory: newHistory.slice(0, -1), // 현재 질문 제외한 이전 히스토리
          userQuestion: userQ,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "질문에 답변하지 못했습니다.");
        // 실패 시 사용자 질문도 롤백
        setConversationHistory(conversationHistory);
        return;
      }
      // AI 답변을 히스토리에 추가
      setConversationHistory([...newHistory, { role: "assistant" as const, content: data.answer }]);
    } catch (e) {
      setError("네트워크 오류가 발생했습니다.");
      // 실패 시 사용자 질문 롤백
      setConversationHistory(conversationHistory);
    } finally {
      setLoadingAsk(false);
    }
  }

  async function handleEvaluate() {
    if (!question || !answer.trim()) {
      setError("답변을 입력한 뒤 평가를 요청해 주세요.");
      return;
    }
    setError(null);
    setFeedback(null);
    setLoadingEval(true);
    try {
      const res = await fetch("/api/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: question.question,
          userAnswer: answer.trim(),
          conversationHistory,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? "평가를 받지 못했습니다.");
        return;
      }
      setFeedback({
        score: data.score ?? 0,
        summary: data.summary ?? "",
        analysis: data.analysis ?? "",
        strengths: data.strengths ?? [],
        improvements: data.improvements ?? [],
        modelAnswer: {
          approach: data.modelAnswer?.approach ?? "",
          framework: data.modelAnswer?.framework ?? "",
          problemBreakdown: data.modelAnswer?.problemBreakdown ?? "",
          solutions: data.modelAnswer?.solutions ?? [],
          prioritization: data.modelAnswer?.prioritization ?? "",
        },
      });
    } catch (e) {
      setError("네트워크 오류가 발생했습니다.");
    } finally {
      setLoadingEval(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-2">케이스 면접 연습</h1>
        <p className="text-zinc-600 dark:text-zinc-400 text-sm mb-6">
          AI 면접관과 대화하며 정보를 확인한 후 답변하세요. .env에 OPENAI_API_KEY를 설정해 주세요.
        </p>

        {/* 카테고리 + 문제 받기 */}
        <section className="mb-6">
          <label className="block text-sm font-medium mb-2">유형</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {CATEGORIES.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => {
                  setCategory(c.value);
                  if (c.value !== "custom") {
                    setCustomTopic("");
                  }
                }}
                className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                  category === c.value
                    ? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border-zinc-900 dark:border-zinc-100"
                    : "bg-white dark:bg-zinc-800 border-zinc-300 dark:border-zinc-600 hover:border-zinc-500"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
          {category === "custom" && (
            <div className="mb-3">
              <label className="block text-sm font-medium mb-2">커스텀 주제 입력</label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="예: 전기차 충전 인프라 확대, 온라인 교육 플랫폼 수익성, 커피 체인점 시장 진입 전략 등"
                className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500 text-sm"
              />
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                원하는 주제를 입력하면 해당 주제에 맞는 케이스 면접 문제가 생성됩니다.
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={handleGetQuestion}
            disabled={loadingQuestion || (category === "custom" && !customTopic.trim())}
            className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium disabled:opacity-50"
          >
            {loadingQuestion ? "문제 생성 중…" : "케이스 문제 받기"}
          </button>
        </section>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 text-sm">
            {error}
          </div>
        )}

        {/* 문제 표시 */}
        {question && (
          <section className="mb-6 p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-lg font-semibold mb-2">{question.title}</h2>
            <div className="text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap text-sm leading-relaxed">
              {question.question}
            </div>
          </section>
        )}

        {/* 대화 섹션 */}
        {question && (
          <section className="mb-6">
            <h3 className="text-sm font-medium mb-3 text-zinc-700 dark:text-zinc-300">
              면접관에게 질문하기 (전제 확인)
            </h3>

            {/* 대화 히스토리 */}
            {conversationHistory.length > 0 && (
              <div className="mb-4 space-y-3">
                {conversationHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-blue-50 dark:bg-blue-900/20 ml-8"
                        : "bg-zinc-100 dark:bg-zinc-700 mr-8"
                    }`}
                  >
                    <div className="text-xs font-medium mb-1 text-zinc-600 dark:text-zinc-400">
                      {msg.role === "user" ? "나" : "면접관"}
                    </div>
                    <div className="text-sm text-zinc-800 dark:text-zinc-200 whitespace-pre-wrap">
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* 질문 입력 */}
            <div className="flex gap-2">
              <input
                type="text"
                value={currentQuestion}
                onChange={(e) => setCurrentQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !loadingAsk) {
                    e.preventDefault();
                    handleAskQuestion();
                  }
                }}
                placeholder="추가 정보를 확인하고 싶은 질문을 입력하세요..."
                className="flex-1 px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                disabled={loadingAsk}
              />
              <button
                type="button"
                onClick={handleAskQuestion}
                disabled={loadingAsk || !currentQuestion.trim()}
                className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium disabled:opacity-50 whitespace-nowrap"
              >
                {loadingAsk ? "질문 중…" : "질문하기"}
              </button>
            </div>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              예: "시장 규모는 얼마인가요?", "경쟁사는 누구인가요?", "목표 고객층은?"
            </p>
          </section>
        )}

        {/* 최종 답변 입력 */}
        {question && (
          <section className="mb-6">
            <label className="block text-sm font-medium mb-2">최종 답변 작성</label>
            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="위에서 확인한 정보를 바탕으로 최종 답변을 작성하세요..."
              rows={10}
              className="w-full px-3 py-2 rounded-lg border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-zinc-500"
            />
            <button
              type="button"
              onClick={handleEvaluate}
              disabled={loadingEval || !answer.trim()}
              className="mt-2 px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-lg font-medium disabled:opacity-50"
            >
              {loadingEval ? "평가 중…" : "평가 받기"}
            </button>
          </section>
        )}

        {/* 피드백 */}
        {feedback && (
          <section className="space-y-6">
            {/* 평가 결과 요약 */}
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
              <h2 className="text-lg font-semibold mb-3">평가 결과</h2>
              <div className="mb-4">
                <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                  {feedback.score}점
                </span>
              </div>
              <p className="text-sm text-zinc-700 dark:text-zinc-300 mb-4 whitespace-pre-wrap">
                {feedback.summary}
              </p>
            </div>

            {/* 답변 상세 분석 */}
            {feedback.analysis && (
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <h3 className="text-base font-semibold mb-2 text-zinc-900 dark:text-zinc-100">
                  답변 분석
                </h3>
                <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                  {feedback.analysis}
                </p>
              </div>
            )}

            {/* 강점 */}
            {feedback.strengths.length > 0 && (
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <h3 className="text-base font-semibold mb-2 text-green-700 dark:text-green-400">
                  강점
                </h3>
                <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                  {feedback.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 개선점 */}
            {feedback.improvements.length > 0 && (
              <div className="p-4 rounded-xl bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700">
                <h3 className="text-base font-semibold mb-2 text-amber-700 dark:text-amber-400">
                  개선점
                </h3>
                <ul className="list-disc list-inside text-sm text-zinc-600 dark:text-zinc-400 space-y-1">
                  {feedback.improvements.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* 모범 답안 */}
            {(feedback.modelAnswer.approach ||
              feedback.modelAnswer.framework ||
              feedback.modelAnswer.problemBreakdown ||
              feedback.modelAnswer.solutions.length > 0 ||
              feedback.modelAnswer.prioritization) && (
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <h3 className="text-base font-semibold mb-3 text-blue-700 dark:text-blue-400">
                  모범 답안
                </h3>
                <div className="space-y-4">
                  {feedback.modelAnswer.approach && (
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-blue-800 dark:text-blue-300">
                        접근 방법
                      </h4>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                        {feedback.modelAnswer.approach}
                      </p>
                    </div>
                  )}
                  {feedback.modelAnswer.framework && (
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-blue-800 dark:text-blue-300">
                        사용 프레임워크
                      </h4>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                        {feedback.modelAnswer.framework}
                      </p>
                    </div>
                  )}
                  {feedback.modelAnswer.problemBreakdown && (
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-blue-800 dark:text-blue-300">
                        문제 분해
                      </h4>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                        {feedback.modelAnswer.problemBreakdown}
                      </p>
                    </div>
                  )}
                  {feedback.modelAnswer.solutions.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-blue-800 dark:text-blue-300">
                        해결책
                      </h4>
                      <ul className="list-disc list-inside text-sm text-zinc-700 dark:text-zinc-300 space-y-1">
                        {feedback.modelAnswer.solutions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {feedback.modelAnswer.prioritization && (
                    <div>
                      <h4 className="text-sm font-medium mb-1 text-blue-800 dark:text-blue-300">
                        우선순위 결정
                      </h4>
                      <p className="text-sm text-zinc-700 dark:text-zinc-300 whitespace-pre-wrap">
                        {feedback.modelAnswer.prioritization}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  );
}
