import { OnboardingQuestion } from "@/types/onboarding";

interface Props {
  question: OnboardingQuestion;
  totalQuestions: number;
  currentIndex: number;
  onSelect: (axis: string, value: string) => void;
  isAnimating: boolean;
}

export function QuestionCard({ question, totalQuestions, currentIndex, onSelect, isAnimating }: Props) {
  const progress = ((currentIndex + 1) / totalQuestions) * 100;

  return (
    <div className={`flex flex-col w-full h-full max-w-md mx-auto p-6 transition-all duration-300 ${isAnimating ? "opacity-0 -translate-x-4" : "opacity-100 translate-x-0"}`}>
      {/* Progress */}
      <div className="w-full mb-10 mt-4">
        <div className="flex justify-between items-center mb-3">
          <span className="text-sm font-medium text-gray-400">학습 성향 분석 중...</span>
          <span className="text-sm font-bold text-[#FECA43]">{currentIndex + 1} / {totalQuestions}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-[#FECA43] h-2 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center items-center mb-12">
        <h2 className="text-2xl font-bold text-gray-800 text-center leading-relaxed break-keep">
          {question.text}
        </h2>
      </div>

      {/* Options */}
      <div className="flex flex-col gap-4 mt-auto pb-8">
        <button
          onClick={() => onSelect(question.axis, question.optionA.value)}
          disabled={isAnimating}
          className="w-full p-6 text-left bg-white border-2 border-transparent rounded-2xl shadow-sm hover:border-[#FECA43] hover:shadow-md transition-all duration-200 active:scale-95 group disabled:opacity-50"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold mr-4 group-hover:bg-[#FECA43] group-hover:text-white transition-colors">A</div>
            <span className="text-gray-700 font-medium text-lg">{question.optionA.text}</span>
          </div>
        </button>

        <button
          onClick={() => onSelect(question.axis, question.optionB.value)}
          disabled={isAnimating}
          className="w-full p-6 text-left bg-white border-2 border-transparent rounded-2xl shadow-sm hover:border-[#FECA43] hover:shadow-md transition-all duration-200 active:scale-95 group disabled:opacity-50"
        >
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 font-bold mr-4 group-hover:bg-[#FECA43] group-hover:text-white transition-colors">B</div>
            <span className="text-gray-700 font-medium text-lg">{question.optionB.text}</span>
          </div>
        </button>
      </div>
    </div>
  );
}
