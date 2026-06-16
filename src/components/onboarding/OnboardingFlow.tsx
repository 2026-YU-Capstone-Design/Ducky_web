"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { onboardingQuestions } from "@/data/onboardingQuestions";
import { QuestionCard } from "./QuestionCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Comfortaa } from "next/font/google";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-comfortaa",
});

type LearningStyleResult = {
  processingStyle: string;
  structureStyle: string;
  representationStyle: string;
};

export function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<"intro" | "questions">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({
    active: 0,
    reflective: 0,
    sequential: 0,
    global: 0,
    visual: 0,
    verbal: 0,
  });
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [resultData, setResultData] = useState<LearningStyleResult | null>(
    null,
  );

  const [user, setUser] = useLocalStorage("ducky_user", {
    id: "",
    name: "",
    level: "beginner",
    learningStyle: {
      processing: "active",
      expression: "visual",
      understanding: "sequential",
    },
    onboarded: false,
  });

  const handleSelect = (axis: string, value: string) => {
    if (isAnimating) return;
    const newAnswers = { ...answers, [value]: answers[value] + 1 };
    setAnswers(newAnswers);
    setIsAnimating(true);
    setTimeout(() => {
      if (currentIndex < onboardingQuestions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setIsAnimating(false);
      } else {
        calculateAndSaveResult(newAnswers);
      }
    }, 300);
  };

  const calculateAndSaveResult = (finalAnswers: Record<string, number>) => {
    const getStyle = (a: string, b: string, tA: string, tB: string) => {
      if (Math.abs(finalAnswers[a] - finalAnswers[b]) === 0) return "Mixed";
      return finalAnswers[a] > finalAnswers[b] ? tA : tB;
    };
    const processingStyle = getStyle(
      "active",
      "reflective",
      "Active",
      "Reflective",
    );
    const structureStyle = getStyle(
      "sequential",
      "global",
      "Sequential",
      "Global",
    );
    const representationStyle = getStyle(
      "visual",
      "verbal",
      "Visual",
      "Verbal",
    );

    setResultData({ processingStyle, structureStyle, representationStyle });

    if (user) {
      setUser({
        ...user,
        learningStyle: {
          processing:
            processingStyle === "Mixed"
              ? "active"
              : processingStyle.toLowerCase(),
          expression:
            representationStyle === "Mixed"
              ? "visual"
              : representationStyle.toLowerCase(),
          understanding:
            structureStyle === "Mixed"
              ? "sequential"
              : structureStyle.toLowerCase(),
        },
        onboarded: true,
      });
    }

    setShowResult(true);
    setTimeout(() => router.push("/dashboard"), 3800);
  };

  // ─── RESULT ──────────────────────────────────────────────────────────────────
  if (showResult && resultData) {
    const items = [
      { label: "정보 처리", value: resultData.processingStyle },
      { label: "이해 구조", value: resultData.structureStyle },
      { label: "정보 표현", value: resultData.representationStyle },
    ];

    return (
      <div
        className={`relative flex min-h-dvh w-full flex-col items-center justify-center overflow-hidden bg-[#FECA43] px-6 ${comfortaa.className}`}
      >
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-28 -left-28 h-72 w-72 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-white/[0.03]" />

        <div className="relative z-10 w-full max-w-sm">
          {/* 타이틀 */}
          <p className="mb-2 text-center text-[11px] font-bold uppercase tracking-[0.3em] text-white/50">
            Analysis Complete
          </p>
          <h1 className="mb-2 text-center text-[2.75rem] font-bold leading-tight text-white tracking-tight">
            분석 완료
          </h1>
          <p className="mb-10 text-center text-[13px] font-medium text-white/60">
            당신에게 맞는 학습 방식을 찾았어요
          </p>

          {/* 결과 카드 */}
          <div className="w-full overflow-hidden rounded-3xl bg-white/20 backdrop-blur-xl ring-1 ring-white/30 shadow-2xl shadow-black/10">
            {items.map((item, i) => (
              <div key={item.label}>
                <div className="flex items-center justify-between px-7 py-[1.35rem]">
                  <p className="text-sm font-semibold text-white/75">
                    {item.label}
                  </p>
                  <p className="text-[15px] font-bold text-white tracking-wide">
                    {item.value}
                  </p>
                </div>
                {i < items.length - 1 && (
                  <div className="mx-7 h-px bg-white/15" />
                )}
              </div>
            ))}
          </div>

          {/* 하단 로딩 */}
          <div className="mt-10 flex flex-col items-center gap-3">
            <div className="flex gap-1.5">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="h-1.5 w-1.5 rounded-full bg-white/60 animate-bounce"
                  style={{ animationDelay: `${i * 160}ms` }}
                />
              ))}
            </div>
            <p className="text-[13px] font-medium text-white/65">
              맞춤 학습 환경을 준비하고 있어요
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ─── INTRO ───────────────────────────────────────────────────────────────────
  if (step === "intro") {
    return (
      <div className="relative flex min-h-dvh w-full flex-col items-center overflow-hidden bg-[#FAF8F5]">
        {/* 상단 노란 배경 */}
        <div className="absolute inset-x-0 top-0 h-[44%] bg-[#FECA43]">
          <svg
            viewBox="0 0 1440 64"
            preserveAspectRatio="none"
            className="absolute bottom-0 left-0 right-0 block h-12 w-full sm:h-16"
          >
            <path
              d="M0,0 C480,64 960,64 1440,0 L1440,64 L0,64 Z"
              fill="#FAF8F5"
            />
          </svg>
        </div>

        <div className="relative z-10 flex min-h-dvh w-full max-w-md flex-col items-center px-6">
          {/* 로고 */}
          <div className="flex flex-col items-center pt-16 sm:pt-24">
            <h1
              className={`text-[5.3rem] font-bold leading-none text-white ${comfortaa.className} select-none tracking-tight drop-shadow-sm`}
            >
              Ducky
            </h1>
          </div>

          {/* 카드 */}
          <div className="mt-12 w-full rounded-3xl bg-white p-7 shadow-2xl shadow-black/[0.07] ring-1 ring-black/[0.04]">
            <p className="mb-1 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[#FECA43]">
              Learning Style Test
            </p>
            <h2 className="mb-3.5 text-center text-[1.4rem] font-bold text-gray-900 tracking-tight">
              학습 유형 검사
            </h2>
            <p className="mb-6 text-center text-[14.5px] leading-relaxed text-gray-500 break-keep">
              Ducky는 더 적절한 학습 방식을 제공하기 위해
              <br />
              학습 유형 검사를 통해 유형을 파악해요.
            </p>

            {/* 메타 정보 */}
            <div className="flex items-center border-t border-gray-100 pt-5">
              {[
                {
                  label: "문항 수",
                  value: `${onboardingQuestions.length}문항`,
                },
                { label: "소요 시간", value: "약 3분" },
                { label: "분석 항목", value: "3가지" },
              ].map((meta, i, arr) => (
                <div key={meta.label} className="flex flex-1 items-center">
                  <div className="flex flex-1 flex-col items-center">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-400">
                      {meta.label}
                    </p>
                    <p className="mt-1 text-sm font-bold text-gray-800">
                      {meta.value}
                    </p>
                  </div>
                  {i < arr.length - 1 && (
                    <div className="h-7 w-px shrink-0 bg-gray-200" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 버튼 */}
          <div className="mt-8 flex w-full flex-col gap-2.5 pb-6">
            <button
              onClick={() => setStep("questions")}
              className="w-full rounded-2xl bg-[#FECA43] py-[1.05rem] text-[15px] font-bold text-white shadow-lg shadow-[#FECA43]/30 transition-all duration-200 hover:bg-[#F5B522] hover:-translate-y-[2px] hover:shadow-xl hover:shadow-[#FECA43]/35 active:scale-[0.98] active:translate-y-0 cursor-pointer"
            >
              진단하기
            </button>

            <button
              onClick={() => {
                if (user) {
                  setUser({
                    ...user,
                    learningStyle: {
                      processing: "active",
                      expression: "visual",
                      understanding: "global",
                    },
                    onboarded: true,
                  });
                }
                router.push("/dashboard");
              }}
              className="w-full py-3 text-[13px] font-medium text-gray-400 transition-colors hover:text-gray-600 cursor-pointer"
            >
              건너뛰기
            </button>
          </div>

          <p className="pb-8 text-center text-[11px] leading-relaxed text-gray-400 break-keep">
            ※ Ducky의 진단 검사만으로는 실제 학습 유형을 알 수 없어요.
          </p>
        </div>
      </div>
    );
  }

  // ─── QUESTIONS ───────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-dvh w-full flex-col items-center justify-center overflow-y-auto bg-[#FAF8F5] px-4 py-6 sm:px-6">
      <QuestionCard
        question={onboardingQuestions[currentIndex]}
        totalQuestions={onboardingQuestions.length}
        currentIndex={currentIndex}
        onSelect={handleSelect}
        isAnimating={isAnimating}
      />
    </div>
  );
}
