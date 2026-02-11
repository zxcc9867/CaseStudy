export type CaseCategory =
  | "market-sizing"
  | "profitability"
  | "strategy"
  | "brainstorming"
  | "misc";

export interface CaseQuestion {
  id: string;
  title: string;
  category: CaseCategory;
  question: string;
  hint?: string;
  tips?: string[];
}

export interface EvaluateRequest {
  questionId: string;
  question: string;
  userAnswer: string;
}

export interface EvaluateResponse {
  score: number;
  summary: string;
  analysis: string; // 답변 내용에 대한 상세 분석
  strengths: string[];
  improvements: string[];
  modelAnswer: {
    approach: string; // 문제 접근 방법
    framework: string; // 사용할 프레임워크
    problemBreakdown: string; // 문제 분해 방법
    solutions: string[]; // 해결책들
    prioritization: string; // 우선순위 결정 근거
  };
}
