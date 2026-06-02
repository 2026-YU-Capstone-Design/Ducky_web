"use client";

import { Check, Lightbulb, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HintRecord } from "@/hooks/useMockChat";
import { cn } from "@/lib/utils";

const learningStages = [
  "문제 말하기",
  "조건 좁히기",
  "원인 설명",
  "정리하기",
];

interface HintPanelProps {
  activeTitle: string;
  activeTopic: string;
  className?: string;
  hintCount: number;
  hintHistory: HintRecord[];
  isCompleted: boolean;
  isThinking: boolean;
  onComplete: () => void;
  onRequestHint: () => void;
  showHeader?: boolean;
  stageIndex: number;
}

export function HintPanel({
  activeTitle,
  activeTopic,
  className,
  hintCount,
  hintHistory,
  isCompleted,
  isThinking,
  onComplete,
  onRequestHint,
  showHeader = true,
  stageIndex,
}: HintPanelProps) {
  return (
    <div
      className={cn(
        "flex h-full min-h-0 flex-col rounded-lg border border-[#E7DDC8] bg-white text-[#2E2A22] shadow-sm",
        className,
      )}
    >
      {showHeader && (
        <div className="border-b border-[#E7DDC8] px-5 py-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold text-[#B88700]">Ducky</p>
              <h2 className="mt-1 text-lg font-bold">힌트 패널</h2>
            </div>
            <Badge className="bg-[#FFF1BC] text-[#6B5200]">
              힌트 {hintCount}개
            </Badge>
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-5 py-5">
        <section>
          <div className="flex items-start gap-3 rounded-lg bg-[#FAF8F5] p-4">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-[#B88700]" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#B88700]">
                {activeTopic}
              </p>
              <p className="mt-1 text-sm font-bold leading-snug break-keep">
                {activeTitle}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600 break-keep">
                답을 바로 찾기보다, 개념을 스스로 설명할 수 있게 질문의
                단계를 좁혀갑니다.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-bold">질문 단계</h3>
          <ol className="mt-3 space-y-2">
            {learningStages.map((stage, index) => {
              const isDone = index < stageIndex;
              const isActive = index === stageIndex;

              return (
                <li
                  key={stage}
                  aria-current={isActive ? "step" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-lg border border-[#E7DDC8] px-3 py-2 text-sm",
                    isActive && "border-[#FECA43] bg-[#FFF7E0]",
                    isDone && "bg-white",
                  )}
                >
                  <span
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold",
                      isDone &&
                        "border-[#FECA43] bg-[#FECA43] text-[#2E2A22]",
                      isActive &&
                        "border-[#B88700] bg-white text-[#B88700]",
                    )}
                  >
                    {isDone ? (
                      <Check className="size-3" aria-hidden="true" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className="font-medium">{stage}</span>
                </li>
              );
            })}
          </ol>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-sm font-bold">누적 힌트</h3>
            <span className="text-xs font-semibold text-gray-500">
              힌트 {hintCount}개
            </span>
          </div>

          <Button
            type="button"
            onClick={onRequestHint}
            disabled={isCompleted || isThinking}
            className="mt-3 h-10 w-full gap-2 bg-[#FECA43] font-bold text-[#2E2A22] hover:bg-[#F5B522]"
          >
            <Lightbulb className="size-4" aria-hidden="true" />
            {isCompleted ? "세션 완료" : "힌트 더 받기"}
          </Button>

          <Button
            type="button"
            onClick={onComplete}
            disabled={isCompleted || isThinking}
            variant="outline"
            className="mt-2 h-10 w-full gap-2 border-[#E7DDC8] bg-white font-bold text-[#2E2A22] hover:bg-[#FFF7E0]"
          >
            <Check className="size-4" aria-hidden="true" />
            답을 알겠어요
          </Button>

          <div className="mt-4 space-y-3">
            {hintHistory.length === 0 ? (
              <p className="rounded-lg border border-dashed border-[#E7DDC8] px-3 py-4 text-sm leading-relaxed text-gray-500 break-keep">
                막히는 지점에서 힌트를 계속 요청할 수 있습니다. 답을 스스로
                설명할 수 있을 때 &quot;답을 알겠어요&quot;로 마무리합니다.
              </p>
            ) : (
              hintHistory.map((hint) => (
                <article
                  key={hint.id}
                  className="rounded-lg border border-[#E7DDC8] bg-[#FAF8F5] p-3"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[#B88700]">
                      힌트 {hint.number}
                    </p>
                    <p className="text-xs font-medium text-gray-500">
                      {hint.title}
                    </p>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-gray-700 break-keep">
                    {hint.content}
                  </p>
                </article>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
