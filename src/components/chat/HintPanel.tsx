"use client";

import { Check, CircleCheck, Info, Lightbulb, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { HintRecord } from "@/hooks/useMockChat";
import { cn } from "@/lib/utils";

const learningStages = ["문제 말하기", "조건 좁히기", "원인 설명", "정리하기"];

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
        "flex h-full min-h-0 flex-col rounded-2xl border border-[#F0E0A8] bg-white text-[#3D2E0A] shadow-sm transition-colors dark:border-[#5C4413]/40 dark:bg-[#221C0D] dark:text-[#F0E0C4] dark:shadow-none",
        className,
      )}
    >
      {showHeader && (
        <div className="border-b border-[#F0E0A8] px-5 py-4 dark:border-[#5C4413]/40">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-bold">힌트 패널</h2>
            <Badge className="rounded-full bg-[#FFF1BC] text-[#6B5200] dark:bg-[#2A2310] dark:text-[#FECA43]">
              힌트 {hintCount}개
            </Badge>
          </div>
        </div>
      )}

      <div className="min-h-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <section>
          <div className="flex items-start gap-3 rounded-2xl border border-[#F6EAC4] bg-[#FFFCF3] p-4 transition-colors dark:border-[#5C4413]/40 dark:bg-[#2A2310]">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-[#946200] dark:text-[#FECA43]" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#946200] dark:text-[#FECA43]">
                {activeTopic}
              </p>
              <p className="mt-1 text-sm font-bold leading-snug break-keep">
                {activeTitle}
              </p>
            </div>
          </div>
        </section>

        {/* 질문 단계: 가로 진행 트랙 스테퍼 */}
        <section>
          <h3 className="text-sm font-bold">질문 단계</h3>
          <ol className="relative mt-4 flex items-start justify-between px-0.5">
            <div
              aria-hidden="true"
              className="absolute top-3.5 right-3.5 left-3.5 h-0.5 bg-[#F0E0A8] dark:bg-[#5C4413]/40"
            />
            <div
              aria-hidden="true"
              className="absolute top-3.5 left-3.5 h-0.5 bg-[#FECA43] transition-all duration-500"
              style={{
                width:
                  stageIndex <= 0
                    ? "0%"
                    : `calc(${(stageIndex / (learningStages.length - 1)) * 100}% - ${(stageIndex / (learningStages.length - 1)) * 28}px)`,
              }}
            />

            {learningStages.map((stage, index) => {
              const isDone = index < stageIndex;
              const isActive = index === stageIndex;

              return (
                <li
                  key={stage}
                  aria-current={isActive ? "step" : undefined}
                  className="relative z-10 flex w-[60px] flex-col items-center gap-[5px] text-center"
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-full border-2 bg-white text-xs font-bold dark:bg-[#221C0D]",
                      isDone &&
                        "border-[#FECA43] bg-[#FFFAEE] text-[#946200] dark:border-[#FECA43]/60 dark:bg-[#2A2310] dark:text-[#FECA43]",
                      isActive &&
                        "border-[#946200] text-[#946200] dark:border-[#FECA43] dark:text-[#FECA43]",
                      !isDone &&
                        !isActive &&
                        "border-[#F0E0A8] text-[#C4A85A] dark:border-[#5C4413]/40 dark:text-[#8A6A28]",
                    )}
                  >
                    {isDone ? (
                      <Check
                        className="size-4"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] leading-tight font-semibold break-keep text-[#A8895C] dark:text-[#8A6A28]",
                      isActive &&
                        "font-bold text-[#3D2E0A] dark:text-[#F0E0C4]",
                      isDone && "text-[#946200] dark:text-[#FECA43]",
                    )}
                  >
                    {stage}
                  </span>
                </li>
              );
            })}
          </ol>
        </section>

        <section className="flex flex-col gap-2">
          <Button
            type="button"
            onClick={onRequestHint}
            disabled={isCompleted || isThinking}
            className="h-10 w-full gap-2 rounded-full border border-[#F0E0A8] bg-[#FFF6DC] font-bold text-[#946200] hover:bg-[#FFEFC4] dark:border-[#5C4413]/40 dark:bg-[#2A2310] dark:text-[#FECA43] dark:hover:bg-[#352B12]"
          >
            <Lightbulb className="size-4" aria-hidden="true" />
            {isCompleted ? "세션 완료" : "힌트 더 받기"}
          </Button>

          <Button
            type="button"
            onClick={onComplete}
            disabled={isCompleted || isThinking}
            variant="outline"
            className="h-10 w-full gap-2 rounded-full border-2 border-[#6B6356] bg-white font-bold text-[#6B6356] hover:bg-[#F7F5EF] dark:border-[#8A8270] dark:bg-[#221C0D] dark:text-[#B8AF9C] dark:hover:bg-[#2A2310]"
          >
            <CircleCheck
              className="size-4"
              strokeWidth={2.5}
              aria-hidden="true"
            />
            답을 알겠어요
          </Button>
        </section>

        <section>
          <h3 className="text-sm font-bold">누적 힌트</h3>

          {/* 항상 보이는 안내문구 */}
          <div className="mt-3 flex gap-2.5 rounded-2xl border border-dashed border-[#E5D49E] bg-[#FFFCF3] px-3.5 py-3 transition-colors dark:border-[#5C4413]/50 dark:bg-[#2A2310]">
            <Info
              className="mt-0.5 size-3.5 shrink-0 text-[#946200] dark:text-[#FECA43]"
              aria-hidden="true"
            />
            <p className="text-[11.5px] leading-relaxed text-[#8A6A28] break-keep dark:text-[#C4A85A]">
              막히는 지점에서 힌트를 계속 요청할 수 있습니다. 답을 스스로 설명할
              수 있을 때{" "}
              <strong className="font-bold text-[#5C4413] dark:text-[#E8C97A]">
                &quot;답을 알겠어요&quot;
              </strong>
              로 마무리합니다.
            </p>
          </div>

          {hintHistory.length > 0 && (
            <div className="mt-3 space-y-2">
              {hintHistory.map((hint) => (
                <article
                  key={hint.id}
                  className="rounded-r-xl rounded-l-sm border-l-[3px] border-[#FECA43] bg-[#FFFCF3] px-3.5 py-2.5 transition-colors dark:bg-[#2A2310]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-[#946200] dark:text-[#FECA43]">
                      힌트 {hint.number}
                    </p>
                    <p className="text-[10.5px] font-medium text-[#A8895C] dark:text-[#8A6A28]">
                      {hint.title}
                    </p>
                  </div>
                  <p className="mt-[5px] text-xs leading-relaxed text-[#5C4413] break-keep dark:text-[#E8C97A]">
                    {hint.content}
                  </p>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
