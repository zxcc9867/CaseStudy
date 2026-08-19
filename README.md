# AI Case Interview Simulator

[English](README.md) | [한국어](README.ko.md) | [日本語](README.ja.md)

A Next.js application for practicing case interviews with an AI interviewer: generate a case, ask for missing information, structure a final answer, and receive feedback.

## Overview

The project turns an open-ended case interview into a guided practice loop. The AI creates a prompt for the selected category, stays in interviewer mode while the user asks clarifying questions, and evaluates the final answer against problem understanding, logic, structure, and use of discovered information.

This repository is an interview-practice tool, not an authoritative hiring assessment.

## Core flow

1. Select a case category.
2. Generate a new case prompt.
3. Ask the AI interviewer for additional facts.
4. Build a structured final response.
5. Submit the response for scoring, strengths, improvement points, and model-answer guidance.

## Supported case categories

- Market sizing
- Profitability
- Strategy
- Brainstorming
- Miscellaneous business cases

## Main features

- AI-generated case questions.
- Multi-turn clarification with conversation history.
- Structured final-answer evaluation.
- Overall score and summary.
- Strengths and improvement suggestions.
- Model-answer points.
- Responsive single-page practice interface.
- Server-side OpenAI API access.

## Tech stack

- Next.js 16 App Router
- React 19
- TypeScript 5
- Tailwind CSS 4
- Next.js Route Handlers
- OpenAI API with `gpt-4o-mini`
- ESLint and Turbopack

## Architecture

```text
Browser
  → Next.js page
  → /api/case-question | /api/ask-question | /api/evaluate
  → OpenAI API
  → structured JSON response
  → practice UI
```

The OpenAI key is read only by server-side route handlers.

## API routes

### `POST /api/case-question`

Creates a case for the selected category.

```json
{
  "category": "market-sizing"
}
```

### `POST /api/ask-question`

Answers a clarification while preserving interviewer behavior.

```json
{
  "caseQuestion": "Case prompt",
  "conversationHistory": [],
  "userQuestion": "What is the current revenue?"
}
```

### `POST /api/evaluate`

Evaluates the final response with the case and conversation context.

```json
{
  "question": "Case prompt",
  "userAnswer": "Structured response",
  "conversationHistory": []
}
```

## Run locally

```bash
git clone https://github.com/zxcc9867/CaseStudy.git
cd CaseStudy
npm install
```

Copy `.env.example` to `.env` and set:

```env
OPENAI_API_KEY=your_openai_api_key
```

Then start the development server.

```bash
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run lint
npm run build
npm run start
```

## Model behavior

The repository currently configures `gpt-4o-mini` with different temperatures by task:

- Case generation: `0.8`
- Interviewer answers: `0.7`
- Evaluation: `0.4`

These values favor variety during generation and more consistency during evaluation.

## Deployment

The app can be deployed to Vercel as a standard Next.js project.

1. Import the GitHub repository.
2. Set `OPENAI_API_KEY` in the Vercel project settings.
3. Deploy and verify all three API routes.

## Security and limitations

- Never expose `OPENAI_API_KEY` through a `NEXT_PUBLIC_` variable.
- Do not commit `.env`.
- AI-generated questions and evaluations may be incomplete or inconsistent.
- Scores are practice feedback, not objective hiring decisions.
- Public deployment should add rate limiting, usage monitoring, and abuse protection.
- API cost depends on model usage and conversation length.

## License and contribution

This project was built for learning and case-interview practice. Bug reports and focused improvement suggestions are welcome through GitHub Issues.
