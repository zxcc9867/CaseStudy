import OpenAI from "openai";

/**
 * 서버에서만 사용. process.env.OPENAI_API_KEY 를 .env 에서 불러옵니다.
 * API 키가 없으면 null 을 반환하고, API 라우트에서 503/400 으로 안내합니다.
 */
export function getOpenAIClient(): OpenAI | null {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey || apiKey.trim() === "") {
    return null;
  }
  return new OpenAI({ apiKey: apiKey.trim() });
}

export function hasOpenAIKey(): boolean {
  const key = process.env.OPENAI_API_KEY;
  return !!key && key.trim() !== "";
}
