"use client";

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * 회원가입 2단계 컴포넌트에 전달되는 props
 */
interface SignupStep2Props {
  /** 사용자가 입력한 이메일 */
  email: string;
  /** 이메일 관련 에러 메시지 */
  emailError: string;
  /** 이메일 중복 확인 성공 메시지 */
  emailSuccess: string;
  /** 이메일 중복 확인 완료 여부 */
  isEmailChecked: boolean;
  /** 이메일 중복 확인 요청 중 여부 (로딩 상태) */
  isCheckingEmail: boolean;
  /** 이메일 입력 변경 핸들러 */
  handleEmailChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** 이메일 중복 확인 버튼 클릭 핸들러 */
  handleDuplicateCheck: () => void;
  /** 회원가입 단계를 변경하는 함수 (1, 2, 3) */
  setSignupStep: Dispatch<SetStateAction<1 | 2 | 3>>;
}

/**
 * 회원가입 2단계: 이메일 입력 및 중복 확인 화면 컴포넌트
 */
export function SignupStep2({
  email,
  emailError,
  emailSuccess,
  isEmailChecked,
  isCheckingEmail,
  handleEmailChange,
  handleDuplicateCheck,
  setSignupStep,
}: SignupStep2Props) {
  return (
    <div className="w-full flex flex-col items-start space-y-10 animate-fade-in duration-300 pt-2">
      <button
        type="button"
        onClick={() => setSignupStep(1)}
        className="p-1 hover:bg-zinc-200/50 rounded-full transition-colors -ml-1.5 focus:outline-none"
        aria-label="뒤로가기"
      >
        <ChevronLeft className="h-7 w-7 text-[#333333]" />
      </button>
      <h2 className="text-3xl font-extrabold tracking-tight text-[#333333] select-none">
        이메일을 입력해주세요
      </h2>
      <div className="w-full space-y-2 pt-4">
        <label className="text-xs font-bold text-zinc-400 select-none">
          이메일 <span className="text-red-500">*</span>
        </label>
        <div className="relative w-full border-b border-zinc-300 focus-within:border-[#FECA43] flex items-center pb-2 transition-colors">
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            className="flex-1 bg-transparent focus:outline-none text-lg font-bold text-[#333333] placeholder:text-zinc-300"
            placeholder="이메일 입력"
            required
          />
          <Button
            type="button"
            disabled={!email || !!emailError || isEmailChecked || isCheckingEmail}
            onClick={handleDuplicateCheck}
            className={`h-9 px-4 ml-2 rounded-lg text-xs font-extrabold shadow-none transition-colors border ${
              isEmailChecked || (!email || !!emailError)
                ? "bg-zinc-100 text-zinc-400 border-zinc-200 hover:bg-zinc-100"
                : "border-[#FECA43] text-[#FECA43] bg-white hover:bg-[#FECA43]/10"
            }`}
          >
            {isCheckingEmail ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "중복확인"
            )}
          </Button>
        </div>
        {emailError && (
          <p className="text-xs font-bold text-red-500 pt-1">{emailError}</p>
        )}
        {emailSuccess && (
          <p className="text-xs font-bold text-emerald-500 pt-1">{emailSuccess}</p>
        )}
      </div>
      <div className="w-full pt-10">
        <Button
          onClick={() => setSignupStep(3)}
          disabled={!isEmailChecked}
          className={`w-full h-14 rounded-xl font-bold text-base transition-all active:scale-[0.99] border-none shadow-none ${
            isEmailChecked
              ? "bg-[#FECA43] text-white hover:bg-[#FECA43]/90"
              : "bg-[#EFECE5] text-[#9E988E] hover:bg-[#EFECE5]"
          }`}
        >
          다음
        </Button>
      </div>
    </div>
  );
}
