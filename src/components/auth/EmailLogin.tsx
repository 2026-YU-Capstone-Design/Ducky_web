"use client";

import { Dispatch, SetStateAction, FormEvent } from "react";
import { ChevronLeft, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

/**
 * 이메일 로그인 화면 컴포넌트에 전달되는 props
 */
interface EmailLoginProps {
  /** 사용자가 입력한 이메일 */
  email: string;
  /** 이메일 상태를 업데이트하는 함수 */
  setEmail: Dispatch<SetStateAction<string>>;
  /** 사용자가 입력한 비밀번호 */
  password: "";
  /** 비밀번호 상태를 업데이트하는 함수 */
  setPassword: Dispatch<SetStateAction<string>>;
  /** 로그인 에러 메시지 */
  error: string;
  /** 로그인 요청 중 여부 (로딩 상태) */
  isLoading: boolean;
  /** 이메일 모드 (options, login, signup)를 변경하는 함수 */
  setEmailMode: Dispatch<SetStateAction<"options" | "login" | "signup">>;
  /** 에러 메시지 상태를 업데이트하는 함수 */
  setError: Dispatch<SetStateAction<string>>;
  /** 이메일 로그인 폼 제출 핸들러 */
  handleEmailLoginSubmit: (e: FormEvent) => void;
  /** 회원가입 단계를 변경하는 함수 (1, 2, 3) */
  setSignupStep: Dispatch<SetStateAction<1 | 2 | 3>>;
}

/**
 * 이메일 로그인 양식 컴포넌트
 */
export function EmailLogin({
  email,
  setEmail,
  password,
  setPassword,
  error,
  isLoading,
  setEmailMode,
  setError,
  handleEmailLoginSubmit,
  setSignupStep,
}: EmailLoginProps) {
  return (
    <div className="w-full flex flex-col items-start space-y-8 animate-fade-in duration-300">
      <button
        type="button"
        onClick={() => {
          setEmailMode("options");
          setError("");
        }}
        className="p-1 hover:bg-zinc-200/50 rounded-full transition-colors -ml-1.5 focus:outline-none"
        aria-label="뒤로가기"
      >
        <ChevronLeft className="h-7 w-7 text-[#333333]" />
      </button>
      <h2 className="text-3.5xl font-bold tracking-tight text-[#333333] select-none pt-2">
        이메일로 로그인
      </h2>
      <form onSubmit={handleEmailLoginSubmit} className="w-full space-y-4 pt-4">
        {error && (
          <div className="flex items-center gap-2 p-3.5 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        <Input
          type="email"
          placeholder="이메일 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full h-13 px-4 rounded-xl bg-[#EFECE5] text-[#333333] placeholder-[#9E988E] border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none text-base font-medium transition-all shadow-none"
          required
        />
        <Input
          type="password"
          placeholder="비밀번호 입력"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full h-13 px-4 rounded-xl bg-[#EFECE5] text-[#333333] placeholder-[#9E988E] border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none text-base font-medium transition-all shadow-none"
          required
        />
        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-13 rounded-xl bg-[#FECA43] hover:bg-[#FECA43]/90 text-white font-bold text-base transition-transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-none border-none"
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "로그인 하기"
            )}
          </Button>
        </div>
      </form>
      <div className="w-full flex justify-center items-center text-sm text-zinc-500 pt-4">
        <button
          type="button"
          onClick={() => {
            setEmailMode("signup");
            setSignupStep(1);
            setError("");
          }}
          className="hover:underline font-bold text-[#FECA43]"
        >
          회원가입하기
        </button>
      </div>
    </div>
  );
}
