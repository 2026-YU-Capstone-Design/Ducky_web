"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Bell,
  Brain,
  Moon,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { MaterialLibraryMock } from "@/components/settings/MaterialLibraryMock";
import { Switch } from "@/components/ui/switch";
import { mockUser } from "@/data/mockUser";
import type { LearningLevel, LearningStyle } from "@/types/user";

const levelLabels: Record<LearningLevel, string> = {
  advanced: "advanced",
  beginner: "beginner",
  intermediate: "intermediate",
};

const DARK_MODE_STORAGE_KEY = "ducky.settings.darkMode";

const learningStyleLabels: {
  [Key in keyof LearningStyle]: Record<LearningStyle[Key], string>;
} = {
  processing: { active: "직접 시도형", reflective: "천천히 사고형" },
  expression: { visual: "시각 자료형", verbal: "언어 설명형" },
  understanding: { sequential: "단계 학습형", global: "전체 구조형" },
};

function getInitialDarkMode() {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(DARK_MODE_STORAGE_KEY) === "true";
}

export function SettingsDashboard() {
  const [darkMode, setDarkMode] = useState(getInitialDarkMode);
  const [studyReminder, setStudyReminder] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    window.localStorage.setItem(DARK_MODE_STORAGE_KEY, String(darkMode));
  }, [darkMode]);

  const learningStyleRows = [
    {
      label: "처리 방식",
      value: learningStyleLabels.processing[mockUser.learningStyle.processing],
      description: "문제를 먼저 풀어보며 흐름을 잡는 편입니다.",
    },
    {
      label: "표현 선호",
      value: learningStyleLabels.expression[mockUser.learningStyle.expression],
      description: "구조와 관계가 보이면 개념을 더 빠르게 정리합니다.",
    },
    {
      label: "이해 구조",
      value:
        learningStyleLabels.understanding[mockUser.learningStyle.understanding],
      description: "작은 단계가 이어질 때 답변 품질이 안정됩니다.",
    },
  ];

  return (
    <div className="flex min-h-full w-full flex-1 flex-col bg-[#FFFCF3] transition-colors dark:bg-[#16130A]">
      <section className="mx-auto flex w-full max-w-[944px] flex-1 flex-col px-5 py-8 sm:px-8 lg:px-10">
        {/* ── 헤더 ── */}
        <div className="mb-2 py-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 mb-3 text-[10px] font-bold tracking-[0.12em] text-amber-700 uppercase dark:bg-amber-900/40 dark:text-amber-300">
            <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
            Settings
          </span>
          <h1 className="mt-3 text-[30px] font-black leading-[1.15] tracking-[-1px] text-gray-950 dark:text-white sm:text-[40px]">
            학습 환경을 조정하세요
            <span className="text-amber-400">.</span>
          </h1>
          <div className="mt-4 ml-1.5">
            <p className="text-[13px] font-medium leading-relaxed text-[#b8975c] dark:text-amber-400/70">
              현재는 프로토타입용 mock 설정입니다. 실제 저장은 이후 백엔드 연결
              단계에서 처리합니다.
            </p>
            <div className="mt-3 border-t border-amber-200/60 dark:border-amber-800/40" />
          </div>
        </div>

        {/* ── 그리드 ── */}
        <div className="grid gap-4 lg:grid-cols-2">
          {/* 왼쪽: 프로필 + 화면설정 + 알림 */}
          <div className="flex flex-col gap-4">
            {/* 프로필 */}
            <div className="overflow-hidden rounded-2xl border border-amber-100/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/8 dark:bg-[#1E1B16]">
              <div className="flex h-12 items-center gap-1.5 border-b border-amber-100/80 px-4 dark:border-white/8">
                <UserRound
                  className="size-3.5 text-amber-500"
                  strokeWidth={1.8}
                />
                <h2 className="text-xs font-bold tracking-widest text-amber-700 uppercase dark:text-amber-400">
                  프로필
                </h2>
              </div>
              <div className="flex flex-col divide-y divide-amber-50 dark:divide-white/[0.06]">
                {[
                  { label: "이름", value: mockUser.name },
                  { label: "이메일", value: mockUser.email },
                  { label: "레벨", value: levelLabels[mockUser.level] },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex items-center justify-between gap-4 px-5 py-3"
                  >
                    <dt className="text-[10px] font-semibold uppercase tracking-widest text-[#c4ad88] dark:text-amber-400/50">
                      {row.label}
                    </dt>
                    <dd className="text-sm font-bold text-gray-950 dark:text-white">
                      {row.value}
                    </dd>
                  </div>
                ))}
              </div>
            </div>

            {/* 화면 설정 */}
            <div className="overflow-hidden rounded-2xl border border-amber-100/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/8 dark:bg-[#1E1B16]">
              <div className="flex h-12 items-center gap-1.5 border-b border-amber-100/80 px-4 dark:border-white/8">
                <Moon className="size-3.5 text-amber-500" strokeWidth={1.8} />
                <h2 className="text-xs font-bold tracking-widest text-amber-700 uppercase dark:text-amber-400">
                  화면 설정
                </h2>
              </div>
              <div className="flex items-center justify-between gap-6 px-5 py-4">
                <div className="min-w-0">
                  <label
                    className="text-sm font-bold text-gray-950 dark:text-white"
                    htmlFor="settings-dark-mode"
                  >
                    다크 모드
                  </label>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500 break-keep dark:text-gray-400">
                    장시간 학습 시 눈부심을 줄이는 설정입니다.
                  </p>
                </div>
                <Switch
                  checked={darkMode}
                  className="data-checked:bg-[#2E2A22] data-unchecked:bg-amber-100 shrink-0 dark:data-checked:bg-[#FECA43] dark:data-unchecked:bg-white/10"
                  id="settings-dark-mode"
                  onCheckedChange={setDarkMode}
                />
              </div>
            </div>

            {/* 알림 */}
            <div className="overflow-hidden rounded-2xl border border-amber-100/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/8 dark:bg-[#1E1B16]">
              <div className="flex h-12 items-center gap-1.5 border-b border-amber-100/80 px-4 dark:border-white/8">
                <Bell className="size-3.5 text-amber-500" strokeWidth={1.8} />
                <h2 className="text-xs font-bold tracking-widest text-amber-700 uppercase dark:text-amber-400">
                  알림
                </h2>
              </div>
              <div className="flex items-center justify-between gap-6 px-5 py-4">
                <div className="min-w-0">
                  <label
                    className="text-sm font-bold text-gray-950 dark:text-white"
                    htmlFor="settings-study-reminder"
                  >
                    학습 리마인더
                  </label>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500 break-keep dark:text-gray-400">
                    매일 한 번 이어서 학습할 시간을 알려줍니다.
                  </p>
                </div>
                <Switch
                  checked={studyReminder}
                  className="data-checked:bg-[#2E2A22] data-unchecked:bg-amber-100 shrink-0 dark:data-checked:bg-[#FECA43] dark:data-unchecked:bg-white/10"
                  id="settings-study-reminder"
                  onCheckedChange={setStudyReminder}
                />
              </div>
            </div>
          </div>

          {/* 오른쪽: 학습 스타일 */}
          <div className="flex flex-col overflow-hidden rounded-2xl border border-amber-100/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/8 dark:bg-[#1E1B16]">
            <div className="flex h-12 items-center gap-1.5 border-b border-amber-100/80 px-4 dark:border-white/8">
              <Brain className="size-3.5 text-amber-500" strokeWidth={1.8} />
              <h2 className="text-xs font-bold tracking-widest text-amber-700 uppercase dark:text-amber-400">
                학습 스타일
              </h2>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <p className="text-xs leading-relaxed text-[#c4ad88] break-keep dark:text-amber-400/50">
                Ducky가 답변 흐름을 맞출 때 참고하는 현재 학습 성향입니다.
              </p>
              <dl className="mt-3 flex flex-1 flex-col gap-2">
                {learningStyleRows.map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-1 flex-col justify-center gap-1.5 rounded-xl bg-amber-50/60 px-4 py-3.5 dark:bg-white/[0.03]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <dt className="text-[11px] font-bold uppercase tracking-widest text-[#c4ad88] dark:text-amber-400/50">
                        {row.label}
                      </dt>
                      <dd className="shrink-0 rounded-lg bg-gradient-to-b from-amber-50 to-amber-100/70 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 ring-1 ring-amber-200/50 dark:from-amber-900/30 dark:to-amber-900/20 dark:text-amber-300 dark:ring-amber-800/30">
                        {row.value}
                      </dd>
                    </div>
                    <p className="text-sm font-semibold leading-snug text-amber-900/70 break-keep dark:text-amber-200/60">
                      {row.description}
                    </p>
                  </div>
                ))}
              </dl>
              <Link
                href="/onboarding"
                className="mt-4 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-xl bg-[#2E2A22] px-4 text-sm font-bold text-white transition-colors hover:bg-[#1a1814] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2E2A22] dark:bg-[#FECA43] dark:text-[#2E2A22] dark:hover:bg-[#F5B522]"
              >
                다시 진단하기
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </div>
          </div>

          <MaterialLibraryMock />
        </div>
      </section>
    </div>
  );
}
