"use client";

import { Dispatch, SetStateAction } from "react";
import { Mail, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * 로그인 옵션 선택 화면 컴포넌트에 전달되는 props
 */
interface LoginOptionsProps {
  /** 현재 스플래시 이미지 인덱스 (1~7) */
  currentSplash: number;
  /** Comfortaa 폰트 클래스 이름 */
  comfortaaClassName: string;
  /** 로그인 처리 중 여부 (로딩 상태) */
  isLoading: boolean;
  /** 이메일 모드 (options, login, signup)를 변경하는 함수 */
  setEmailMode: Dispatch<SetStateAction<"options" | "login" | "signup">>;
  /** 소셜 로그인 버튼 클릭 핸들러 (kakao, naver) */
  handleSocialLogin: (platform: "kakao" | "naver") => void;
}

/**
 * 로그인 옵션 (이메일, 카카오, 네이버) 선택 화면 컴포넌트
 */
export function LoginOptions({
  currentSplash,
  comfortaaClassName,
  isLoading,
  setEmailMode,
  handleSocialLogin,
}: LoginOptionsProps) {
  return (
    <div className="space-y-12">
      <div className="flex flex-col items-center space-y-6">
        <div className="relative transition-all duration-500 hover:scale-105 flex items-center justify-center h-44 w-44">
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <img
              key={num}
              src={`/images/splash${num}.png`}
              alt="Ducky Scholar Character"
              className={`absolute inset-0 h-44 w-44 object-contain transition-all duration-1000 ease-in-out ${
                currentSplash === num
                  ? "opacity-100 scale-100 z-10"
                  : "opacity-0 scale-95 z-0 pointer-events-none"
              }`}
            />
          ))}
        </div>
        <h1
          className={`text-6xl font-bold tracking-tight text-[#FECA43] ${comfortaaClassName} select-none`}
        >
          Ducky
        </h1>
      </div>

      <div className="space-y-3.5">
        <Button
          onClick={() => setEmailMode("login")}
          disabled={isLoading}
          className="w-full h-13 rounded-xl bg-[#EFECE5] text-[#333333] hover:bg-[#E5E1D8] font-bold border-none shadow-none flex items-center justify-center gap-2 transition-transform active:scale-[0.99] disabled:opacity-50 text-base"
        >
          <Mail className="h-5 w-5 text-[#333333]" />
          이메일로 로그인
        </Button>
        <Button
          onClick={() => handleSocialLogin("kakao")}
          disabled={isLoading}
          className="w-full h-13 rounded-xl bg-[#FFE600] text-[#191919] hover:bg-[#F2DA00] font-bold border-none shadow-none flex items-center justify-center gap-2 transition-transform active:scale-[0.99] disabled:opacity-50 text-base"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <MessageCircle className="h-5 w-5 fill-[#191919] text-[#191919]" />
          )}
          카카오로 로그인
        </Button>
        <Button
          onClick={() => handleSocialLogin("naver")}
          disabled={isLoading}
          className="w-full h-13 rounded-xl bg-[#03C75A] text-white hover:bg-[#02B350] font-bold border-none shadow-none flex items-center justify-center gap-2 transition-transform active:scale-[0.99] disabled:opacity-50 text-base"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <span className="font-extrabold text-lg mr-1 select-none">N</span>
          )}
          네이버로 로그인
        </Button>
      </div>
    </div>
  );
}
