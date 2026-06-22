"use client";

import { useState } from "react";
import { Brain, Target, TrendingUp } from "lucide-react";
import { mockAnalysis } from "@/data/mockAnalysis";
import type { ImprovementPoint } from "@/types/analysis";
import type { LearningStyle } from "@/types/user";
import { cn } from "@/lib/utils";

const styleLabels: {
  [Key in keyof LearningStyle]: Record<LearningStyle[Key], string>;
} = {
  processing: { active: "직접 시도형", reflective: "천천히 사고형" },
  expression: { visual: "시각 자료형", verbal: "언어 설명형" },
  understanding: { sequential: "단계 학습형", global: "전체 구조형" },
};

const styleRows = [
  {
    label: "처리 방식",
    value: styleLabels.processing[mockAnalysis.learningStyle.processing],
    description: "문제를 먼저 풀어보며 흐름을 잡는 편입니다.",
  },
  {
    label: "표현 선호",
    value: styleLabels.expression[mockAnalysis.learningStyle.expression],
    description: "구조와 관계가 보이면 개념을 더 빠르게 정리합니다.",
  },
  {
    label: "이해 구조",
    value: styleLabels.understanding[mockAnalysis.learningStyle.understanding],
    description: "작은 단계가 이어질 때 답변 품질이 안정됩니다.",
  },
];

const completionRate = Math.round(
  (mockAnalysis.completedSessions / mockAnalysis.totalSessions) * 100,
);

const priorityLabels: Record<ImprovementPoint["priority"], string> = {
  high: "중요",
  medium: "보통",
  low: "낮음",
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function HintUsageBars() {
  const hints = mockAnalysis.hintUsage;
  const max = Math.max(...hints.map((h) => h.count));
  const sizeMap = hints.map((h) => {
    const ratio = h.count / max;
    if (ratio >= 0.8) return "text-[32px]";
    if (ratio >= 0.4) return "text-[22px]";
    return "text-[14px]";
  });

  return (
    <div className="flex h-full flex-col divide-y divide-[#f0e4cc]">
      {hints.map((hint, i) => (
        <div
          key={hint.level}
          className="flex flex-1 items-center justify-between gap-2"
        >
          <div>
            <span className="text-sm font-bold text-gray-900">
              Lv.{hint.level}
            </span>
            <span className="ml-1.5 text-xs text-[#c4ad88]">{hint.label}</span>
          </div>
          <div className="flex items-baseline gap-0.5 shrink-0">
            <span
              className={cn(
                "font-black leading-none tabular-nums text-amber-900 tracking-tight",
                sizeMap[i],
              )}
            >
              {hint.count}
            </span>
            <span className="text-xs font-semibold text-[#ddd0b8]">회</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function TopicProgressList() {
  const sorted = [...mockAnalysis.topicProgress].sort(
    (a, b) => b.progress - a.progress,
  );
  return (
    <div className="divide-y divide-[#f5e8cc]">
      {sorted.map((topic) => (
        <div
          key={topic.topic}
          className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
        >
          <div className="min-w-0 flex-1">
            <p className="text-sm font-bold text-gray-900 truncate">
              {topic.topic}
            </p>
            <p className="mt-0.5 text-[11px] text-[#c4ad88]">
              {topic.completedSessions}/{topic.totalSessions}개 ·{" "}
              {formatDate(topic.lastPracticedAt)}
            </p>
          </div>
          <div className="flex w-28 shrink-0 items-center gap-2">
            <div className="h-[5px] flex-1 overflow-hidden rounded-full bg-[#f5e8cc]">
              <div
                className="h-full rounded-full bg-amber-400"
                style={{ width: `${topic.progress}%` }}
              />
            </div>
            <span className="w-8 text-right text-xs font-bold tabular-nums text-gray-900">
              {topic.progress}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function ImprovementTimeline() {
  const order: ImprovementPoint["priority"][] = ["high", "medium", "low"];
  const sorted = [...mockAnalysis.improvementPoints].sort(
    (a, b) => order.indexOf(a.priority) - order.indexOf(b.priority),
  );
  return (
    <div>
      {sorted.map((point, i) => (
        <article key={point.id} className="flex gap-3 pb-4 last:pb-0">
          <div className="flex w-5 shrink-0 flex-col items-center pt-1">
            <span
              className={cn(
                "size-2 shrink-0 rounded-full",
                point.priority === "high" ? "bg-amber-500" : "bg-[#e8dcc8]",
              )}
            />
            {i < sorted.length - 1 && (
              <span className="mt-1.5 w-px flex-1 bg-[#f0e4cc]" />
            )}
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold leading-snug text-gray-900 break-keep">
              {point.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-gray-500 break-keep">
              {point.description}
            </p>
          </div>
          {/* 우측 배지 — 모든 우선순위 동일 x좌표 */}
          <div className="w-10 shrink-0 flex items-start justify-center pt-1">
            {point.priority === "high" ? (
              <span className="inline-flex rounded-full border border-[#f5d87a] bg-[#fef3c7] px-2 py-0.5 text-[10px] font-bold text-amber-700">
                {priorityLabels[point.priority]}
              </span>
            ) : (
              <span className="text-[10px] font-medium text-[#c4ad88]">
                {priorityLabels[point.priority]}
              </span>
            )}
          </div>
        </article>
      ))}
    </div>
  );
}

function TopicDetailList() {
  return (
    <div className="divide-y divide-[#f0e4cc]">
      {mockAnalysis.topicProgress.map((topic) => (
        <div
          key={topic.topic}
          className="grid gap-3 py-3 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_5rem]"
        >
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900">{topic.topic}</p>
            <p className="mt-0.5 text-xs text-[#c4ad88]">
              최근 {formatDate(topic.lastPracticedAt)}
            </p>
          </div>
          <div className="sm:text-right">
            <p className="text-base font-bold tabular-nums text-gray-900">
              {topic.progress}%
            </p>
            <p className="text-xs text-[#c4ad88]">
              {topic.completedSessions}개 완료
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

function LearningPointsCard() {
  const [tab, setTab] = useState<"improvements" | "topics">("improvements");

  return (
    <>
      {/* 헤더 + 커스텀 탭 */}
      <div className="flex items-center justify-between bg-white px-4 border-b border-[#f0e4cc]">
        <h2 className="py-3 text-xs font-bold text-gray-900">
          다음 학습 포인트
        </h2>
        <div className="flex items-stretch">
          {(
            [
              { id: "improvements", label: "개선 포인트" },
              { id: "topics", label: "주제 상세" },
            ] as const
          ).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "relative px-3 py-3 text-[11px] font-semibold transition-colors",
                tab === id
                  ? "text-amber-700 font-bold"
                  : "text-[#c4ad88] hover:text-gray-600",
              )}
            >
              {label}
              <span
                className={cn(
                  "absolute bottom-0 left-0 right-0 h-[2px] rounded-full transition-all duration-200",
                  tab === id ? "bg-amber-400 opacity-100" : "opacity-0",
                )}
              />
            </button>
          ))}
        </div>
      </div>
      {/* 콘텐츠 */}
      <div className="p-4">
        {tab === "improvements" ? <ImprovementTimeline /> : <TopicDetailList />}
      </div>
    </>
  );
}

export function AnalysisDashboard() {
  return (
    <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col bg-[#fef9ec] px-5 py-8 sm:px-8 lg:px-10">
      {/* 헤더 */}
      <div className="py-6 mb-2">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 mb-3 text-[10px] font-bold tracking-[0.12em] text-amber-700 uppercase">
          <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
          Learning Analysis Report
        </span>
        <h1 className="mt-3 text-[30px] font-black tracking-[-1px] text-gray-950 leading-[1.15] sm:text-[40px]">
          지금까지 잘<br className="sm:hidden" /> 달려왔어요
          <span className="text-amber-400">.</span>
        </h1>
        <div className="mt-4 ml-1.5 flex items-center justify-between gap-4">
          <p className="text-[13px] font-medium text-[#b8975c] leading-relaxed">
            세션 기록을 바탕으로 강점과 다음 액션을 정리했어요.
          </p>
          <p className="shrink-0 text-[11px] text-[#c4ad88]">
            {formatDate(mockAnalysis.updatedAt)} 기준
          </p>
        </div>
      </div>

      {/* ── 1행 ── */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-[1.6fr_1fr_1fr]">
        {/* 완료율 */}
        <div className="relative overflow-hidden rounded-2xl border border-amber-200/50 bg-gradient-to-br from-amber-50 via-white to-yellow-50/80 p-6 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-12px_rgba(217,119,6,0.12)]">
          <div className="pointer-events-none absolute -right-5 -top-5 h-20 w-20 rounded-full bg-amber-200/30 blur-2xl" />
          <div className="relative">
            <p className="mb-2.5 text-[10px] font-semibold tracking-widest text-amber-600 uppercase">
              완료율
            </p>
            <div className="mb-1.5 flex items-baseline gap-1">
              <span className="text-[52px] font-extrabold leading-none tracking-tight tabular-nums text-gray-950">
                {completionRate}
              </span>
              <span className="text-xl font-bold text-[#ddd0b8]">%</span>
            </div>
            <p className="mb-4 text-xs text-[#c4ad88]">
              {mockAnalysis.completedSessions}/{mockAnalysis.totalSessions}개
              세션 완료
            </p>
            <div className="h-[5px] overflow-hidden rounded-full bg-[#f5e8cc]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-400"
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        </div>

        {/* 보조 통계 2개: 모바일 2열, sm 이상 각 1칸 */}
        <div className="grid grid-cols-2 gap-4 sm:contents">
          {/* 연속학습 */}
          <div className="relative overflow-hidden rounded-2xl border border-transparent bg-[#fef3c7] p-5">
            <span className="absolute right-4 top-4 text-right text-[11px] font-extrabold leading-[1.4] tracking-[.08em] text-amber-700/30 uppercase">
              연속
              <br />
              학습
            </span>
            <div className="pt-9">
              <div className="flex items-baseline gap-1">
                <span className="text-[52px] font-black leading-none tracking-[-3px] tabular-nums text-amber-900">
                  {mockAnalysis.currentStreakDays}
                </span>
                <span className="text-base font-bold text-amber-700/30">
                  일
                </span>
              </div>
              <p className="mt-2 text-[13px] font-semibold text-amber-800/50">
                꾸준한 복습 흐름
              </p>
            </div>
          </div>

          {/* 평균힌트 */}
          <div className="relative overflow-hidden rounded-2xl border border-transparent bg-[#fef3c7] p-5">
            <span className="absolute right-4 top-4 text-right text-[11px] font-extrabold leading-[1.4] tracking-[.08em] text-amber-700/30 uppercase">
              평균
              <br />
              힌트
            </span>
            <div className="pt-9">
              <div className="flex items-baseline gap-1">
                <span className="text-[52px] font-black leading-none tracking-[-3px] tabular-nums text-amber-900">
                  {mockAnalysis.averageHintCount}
                </span>
                <span className="text-base font-bold text-amber-700/30">
                  회
                </span>
              </div>
              <p className="mt-2 text-[13px] font-semibold text-amber-800/50">
                세션당 사용량
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2행 ── */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* 주제별 진행률 */}
        <div className="overflow-hidden rounded-2xl border border-[#e8dcc8] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:col-span-2">
          <div className="flex h-12 items-center justify-between border-b border-[#ede0c4] bg-gradient-to-r from-amber-50 to-[#fef9ec] px-4">
            <h2 className="text-xs font-bold text-amber-900">주제별 진행률</h2>
            <span className="rounded-full border border-amber-300/60 bg-[#fffbeb] px-2.5 py-0.5 text-[11px] font-bold text-amber-700">
              {mockAnalysis.completedSessions}/{mockAnalysis.totalSessions} 완료
            </span>
          </div>
          <div className="p-4">
            <TopicProgressList />
          </div>
        </div>

        {/* 다음 목표 */}
        <div className="flex flex-col overflow-hidden rounded-2xl border border-[#ede0c4] bg-[#fff8e1] shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex h-12 items-center gap-1.5 border-b border-[#ede0c4] px-4">
            <Target className="size-3.5 text-amber-600" strokeWidth={1.8} />
            <h2 className="text-xs font-bold tracking-widest text-amber-700 uppercase">
              다음 목표
            </h2>
          </div>
          <div className="flex flex-1 flex-col items-center justify-center px-5 py-6 text-center">
            <p className="text-[18px] font-extrabold leading-[1.45] tracking-[-0.2px] text-amber-900 break-keep">
              원인을 설명한 뒤 코드 흐름으로 다시 검증하기
            </p>
            <div className="my-4 h-px w-full bg-[#ede0c4]" />
            <p className="text-xs leading-relaxed text-[#b8975c] break-keep">
              높은 우선순위 개선 포인트를 다음 채팅 세션의 질문 흐름에
              반영합니다.
            </p>
          </div>
        </div>
      </div>

      {/* ── 3행 ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr]">
        {/* 다음 학습 포인트 */}
        <div className="overflow-hidden rounded-2xl border border-[#e8dcc8] bg-[#fdfaf3] shadow-[0_1px_3px_rgba(0,0,0,0.03)] sm:col-span-2 lg:col-span-1">
          <LearningPointsCard />
        </div>

        {/* 학습 유형 */}
        <div className="overflow-hidden rounded-2xl border border-[#e8dcc8] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between border-b border-[#f5e8cc] px-4 py-3">
            <h2 className="text-xs font-bold text-gray-900">학습 유형</h2>
            <Brain className="size-3.5 text-[#e8c86a]" strokeWidth={1.8} />
          </div>
          <dl className="divide-y divide-[#f5e8cc]">
            {styleRows.map((row) => (
              <div key={row.label} className="flex gap-3 px-4 py-3">
                <div className="my-0.5 w-[3px] shrink-0 rounded-full bg-amber-300" />
                <div className="min-w-0">
                  <dt className="mb-1 text-[10px] font-semibold tracking-wide text-[#c4ad88] uppercase">
                    {row.label}
                  </dt>
                  <dd className="mb-1 text-xs font-bold text-gray-900">
                    {row.value}
                  </dd>
                  <dd className="text-[11px] leading-relaxed text-gray-500 break-keep">
                    {row.description}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>

        {/* 힌트 사용량 */}
        <div className="overflow-hidden rounded-2xl border-2 border-[#ede0c4] bg-[#fafaf8]">
          <div className="flex items-center justify-between border-b border-[#ede0c4] bg-white px-4 py-3">
            <h2 className="text-xs font-bold text-gray-900">힌트 사용량</h2>
            <TrendingUp className="size-3.5 text-[#e8c86a]" strokeWidth={1.8} />
          </div>
          <div className="flex h-[calc(100%-41px)] flex-col divide-y divide-[#f0e4cc] px-4">
            <HintUsageBars />
          </div>
        </div>
      </div>
    </section>
  );
}
