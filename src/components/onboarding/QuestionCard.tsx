import { OnboardingQuestion } from "@/types/onboarding";

interface Props {
  question: OnboardingQuestion;
  totalQuestions: number;
  currentIndex: number;
  onSelect: (axis: string, value: string) => void;
  isAnimating: boolean;
}

export function QuestionCard({
  question,
  totalQuestions,
  currentIndex,
  onSelect,
  isAnimating,
}: Props) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;
  const options = [
    { label: "A", text: question.optionA.text, value: question.optionA.value },
    { label: "B", text: question.optionB.text, value: question.optionB.value },
  ];

  return (
    <div
      className={`mx-auto flex min-h-[calc(100dvh-3rem)] w-full max-w-md flex-col px-5 pt-6 pb-8 transition-all duration-300 ease-out sm:max-w-xl sm:px-6 ${
        isAnimating ? "opacity-0 translate-x-4" : "opacity-100 translate-x-0"
      }`}
    >
      {/* ── 헤더 ── */}
      <div className="mt-2">
        <div className="mb-2.5 flex items-center justify-between">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gray-400">
            학습 성향 분석 중...
          </p>
          <p className="text-[11px] text-gray-400">
            <span className="font-bold text-gray-700">{currentIndex + 1}</span>
            <span className="font-normal"> / {totalQuestions}</span>
          </p>
        </div>
        <div className="relative h-1 w-full overflow-hidden rounded-full bg-gray-200">
          <div
            className="absolute left-0 top-0 h-full rounded-full bg-[#FECA43] transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* ── 질문 ── */}
      <div className="flex flex-1 flex-col justify-center">
        {/* Q번호 뱃지 */}
        <span className="-ml-1.5 mb-6 inline-flex w-fit items-center rounded-full bg-[#FFF6D6] px-5 py-2 text-md font-bold uppercase tracking-[0.2em] text-[#D4960A]">
          Q{String(currentIndex + 1).padStart(2, "0")}
        </span>

        {/* 질문 텍스트 */}
        <h2 className="text-[1.6rem] font-bold leading-[1.45] text-gray-900 break-keep sm:text-3xl">
          {question.text}
        </h2>

        {/* 구분 바 */}
        <div className="mt-7 flex items-center gap-2">
          <div className="h-[3px] w-16 rounded-full bg-[#FECA43]" />
          <div className="h-[3px] w-3 rounded-full bg-[#FECA43]/30" />
        </div>
      </div>

      {/* ── 선택지 ── */}
      <div className="flex flex-col gap-5 pb-10 sm:gap-5 sm:pb-10">
        {options.map((opt) => (
          <button
            key={opt.label}
            onClick={() => onSelect(question.axis, opt.value)}
            disabled={isAnimating}
            className="group relative w-full overflow-hidden rounded-2xl border border-gray-200/80 bg-white px-5 py-7 text-left shadow-sm transition-all duration-200 ease-out hover:border-[#FECA43] hover:shadow-lg hover:shadow-[#FECA43]/10 hover:-translate-y-0.5 active:scale-[0.98] active:translate-y-0 disabled:opacity-50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFFBEE] via-[#FFFDF5] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

            <div className="relative flex items-center gap-4">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-xs font-bold text-gray-400 transition-all duration-200 group-hover:bg-[#FECA43] group-hover:text-white group-hover:shadow-md group-hover:shadow-[#FECA43]/30">
                {opt.label}
              </span>
              <span className="min-w-0 flex-1 text-md font-medium leading-snug text-gray-700 break-keep">
                {opt.text}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
