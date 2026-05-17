"use client";

import { ChangeEvent, Dispatch, SetStateAction } from "react";
import { ChevronLeft, Loader2, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * 회원가입 3단계 컴포넌트에 전달되는 props
 */
interface SignupStep3Props {
  /** 사용자가 입력한 비밀번호 */
  password: "";
  /** 비밀번호 관련 에러 메시지 */
  passwordError: string;
  /** 사용자가 입력한 비밀번호 확인 */
  passwordConfirm: string;
  /** 비밀번호 확인 관련 에러 메시지 */
  passwordConfirmError: string;
  /** 비밀번호 확인 성공 메시지 */
  passwordConfirmSuccess: string;
  /** 필수 서비스 이용 약관 동의 여부 */
  agreeTerms: boolean;
  /** 필수 서비스 이용 약관 동의 상태를 업데이트하는 함수 */
  setAgreeTerms: Dispatch<SetStateAction<boolean>>;
  /** 선택 마케팅 수신 동의 여부 */
  agreeMarketing: boolean;
  /** 선택 마케팅 수신 동의 상태를 업데이트하는 함수 */
  setAgreeMarketing: Dispatch<SetStateAction<boolean>>;
  /** 회원가입 요청 중 여부 (로딩 상태) */
  isLoading: boolean;
  /** 비밀번호 입력 변경 핸들러 */
  handlePasswordChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** 비밀번호 확인 입력 변경 핸들러 */
  handlePasswordConfirmChange: (e: ChangeEvent<HTMLInputElement>) => void;
  /** 약관 모달 표시 상태를 업데이트하는 함수 (service, marketing, null) */
  setShowTerms: Dispatch<SetStateAction<"service" | "marketing" | null>>;
  /** 최종 회원가입 완료 버튼 클릭 핸들러 */
  handleSignupSubmit: () => void;
  /** 회원가입 단계를 변경하는 함수 (1, 2, 3) */
  setSignupStep: Dispatch<SetStateAction<1 | 2 | 3>>;
}

/**
 * 회원가입 3단계: 비밀번호 입력 및 약관 동의 화면 컴포넌트
 */
export function SignupStep3({
  password,
  passwordError,
  passwordConfirm,
  passwordConfirmError,
  passwordConfirmSuccess,
  agreeTerms,
  setAgreeTerms,
  agreeMarketing,
  setAgreeMarketing,
  isLoading,
  handlePasswordChange,
  handlePasswordConfirmChange,
  setShowTerms,
  handleSignupSubmit,
  setSignupStep,
}: SignupStep3Props) {
  return (
    <div className="w-full flex flex-col items-start space-y-8 animate-fade-in duration-300 pt-2">
      <button
        type="button"
        onClick={() => setSignupStep(2)}
        className="p-1 hover:bg-zinc-200/50 rounded-full transition-colors -ml-1.5 focus:outline-none"
        aria-label="뒤로가기"
      >
        <ChevronLeft className="h-7 w-7 text-[#333333]" />
      </button>
      <h2 className="text-3xl font-extrabold tracking-tight text-[#333333] select-none">
        비밀번호를 입력해주세요
      </h2>
      <div className="w-full space-y-6 pt-2">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 select-none">
            비밀번호 <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            className="w-full bg-transparent border-b border-zinc-300 focus:border-[#FECA43] focus:outline-none text-lg font-bold text-[#333333] pb-2 transition-colors placeholder:text-zinc-300 placeholder:text-sm placeholder:font-medium"
            placeholder="특수문자(!,@,#,&,*), 숫자, 문자의 조합, 8~16자"
            required
          />
          {passwordError && (
            <p className="text-xs font-bold text-red-500 pt-1">{passwordError}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 select-none">
            비밀번호 확인 <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={passwordConfirm}
            onChange={handlePasswordConfirmChange}
            className="w-full bg-transparent border-b border-zinc-300 focus:border-[#FECA43] focus:outline-none text-lg font-bold text-[#333333] pb-2 transition-colors placeholder:text-zinc-300 placeholder:text-sm placeholder:font-medium"
            placeholder="비밀번호 재입력"
            required
          />
          {passwordConfirmError && (
            <p className="text-xs font-bold text-red-500 pt-1">
              {passwordConfirmError}
            </p>
          )}
          {passwordConfirmSuccess && (
            <p className="text-xs font-bold text-emerald-500 pt-1">
              {passwordConfirmSuccess}
            </p>
          )}
        </div>
      </div>

      {/* 약관 동의 체크박스 */}
      <div className="w-full space-y-3 pt-4 border-t border-zinc-100">
        <div className="flex items-center justify-between group">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${
                agreeTerms
                  ? "bg-[#FECA43] border-[#FECA43]"
                  : "border-zinc-300 bg-white group-hover:border-[#FECA43]/50"
              }`}
            >
              {agreeTerms && (
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              )}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
            />
            <span className="text-sm font-bold text-zinc-700 select-none">
              [필수] 서비스 이용 약관
            </span>
          </label>
          <button
            type="button"
            onClick={() => setShowTerms("service")}
            className="text-xs font-bold text-zinc-400 hover:text-zinc-600 underline underline-offset-2"
          >
            보기
          </button>
        </div>

        <div className="flex items-center justify-between group">
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${
                agreeMarketing
                  ? "bg-[#FECA43] border-[#FECA43]"
                  : "border-zinc-300 bg-white group-hover:border-[#FECA43]/50"
              }`}
            >
              {agreeMarketing && (
                <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
              )}
            </div>
            <input
              type="checkbox"
              className="hidden"
              checked={agreeMarketing}
              onChange={(e) => setAgreeMarketing(e.target.checked)}
            />
            <span className="text-sm font-bold text-zinc-700 select-none">
              [선택] 마케팅 및 메시지 수신 동의
            </span>
          </label>
          <button
            type="button"
            onClick={() => setShowTerms("marketing")}
            className="text-xs font-bold text-zinc-400 hover:text-zinc-600 underline underline-offset-2"
          >
            보기
          </button>
        </div>
      </div>

      <div className="w-full pt-6">
        <Button
          onClick={handleSignupSubmit}
          disabled={
            !password ||
            !!passwordError ||
            !passwordConfirm ||
            !!passwordConfirmError ||
            !agreeTerms ||
            isLoading
          }
          className={`w-full h-14 rounded-xl font-bold text-base transition-all active:scale-[0.99] border-none shadow-none ${
            password &&
            !passwordError &&
            passwordConfirm &&
            !passwordConfirmError &&
            agreeTerms
              ? "bg-[#FECA43] text-white hover:bg-[#FECA43]/90"
              : "bg-[#EFECE5] text-[#9E988E] hover:bg-[#EFECE5]"
          }`}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "다음"}
        </Button>
      </div>
    </div>
  );
}
