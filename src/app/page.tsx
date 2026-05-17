"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, MessageCircle, ArrowRight, Loader2, Sparkles, AlertCircle, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Comfortaa } from "next/font/google";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-comfortaa",
});

export default function LandingPage() {
  const router = useRouter();
  const [phase, setPhase] = useState<1 | 2 | 3>(1);
  const [emailMode, setEmailMode] = useState<"options" | "login" | "signup">("options");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [currentSplash, setCurrentSplash] = useState(1);

  // 사용자 로그인 상태 및 정보 영구 저장
  const [user, setUser] = useLocalStorage("ducky_user", {
    id: "",
    name: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    learningStyle: {
      processing: "active" as "active" | "reflective",
      expression: "visual" as "visual" | "verbal",
      understanding: "sequential" as "sequential" | "global"
    },
    onboarded: false
  });

  useEffect(() => {
    // 1단계 -> 2단계 전환 (1.2초)
    const t1 = setTimeout(() => {
      setPhase(2);
    }, 1200);

    // 2단계 -> 3단계 전환 (총 2.4초)
    const t2 = setTimeout(() => {
      setPhase(3);
    }, 2400);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  // 3단계일 때 1부터 7까지 스플래시 이미지 동적 순환
  useEffect(() => {
    if (phase !== 3) return;
    const interval = setInterval(() => {
      setCurrentSplash((prev) => (prev % 7) + 1);
    }, 4500); // 4.5초 주기
    return () => clearInterval(interval);
  }, [phase]);

  const handleSocialLogin = (platform: "kakao" | "naver") => {
    setIsLoading(true);
    setError("");
    // API 로그인 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      setUser(prev => ({
        ...prev,
        id: `mock-${platform}-user`,
        name: platform === "kakao" ? "카카오 유저" : "네이버 유저",
      }));
      router.push("/dashboard");
    }, 1500);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }
    if (emailMode === "signup" && !name) {
      setError("이름을 입력해 주세요.");
      return;
    }

    setIsLoading(true);
    setError("");

    // 이메일 인증 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      setUser(prev => ({
        ...prev,
        id: "mock-email-user",
        name: name || email.split("@")[0],
      }));
      router.push("/dashboard");
    }, 1500);
  };

  // 1단계: 순수 스플래시 화면 (선명한 옐로우 배경 #FECA43)
  if (phase === 1) {
    return (
      <div className={`flex h-screen w-full flex-col items-center justify-center bg-[#FECA43] text-white ${comfortaa.className} transition-all duration-700`}>
        <div className="flex flex-col items-center space-y-4">
          <h1 className="text-6xl font-bold tracking-tight select-none">Ducky</h1>
        </div>
      </div>
    );
  }

  // 2단계: 은은한 크림 베이지 배경 및 옐로우 로고 스플래시 (배경: #FAF8F5, 로고: #FECA43)
  if (phase === 2) {
    return (
      <div className={`flex h-screen w-full flex-col items-center justify-center bg-[#FAF8F5] text-[#FECA43] ${comfortaa.className} transition-all duration-700`}>
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-6xl font-bold tracking-tight select-none">Ducky</h1>
        </div>
      </div>
    );
  }

  // 3단계: 메인 로그인 화면 (Splash2.png 레이아웃, 텍스트, 색상 및 스타일 완벽 일치)
  return (
    <div className={`flex min-h-screen w-full flex-col bg-[#FAF8F5] font-sans transition-all duration-500 ${
      emailMode === "options"
        ? "items-center justify-center p-6"
        : "items-center justify-start pt-14 pb-8 px-6 md:justify-center md:pt-6"
    }`}>
      <div className="w-full max-w-sm animate-fade-in duration-500">

        {/* 오리 캐릭터 일러스트 및 Ducky 텍스트 로고 */}
        {emailMode === "options" ? (
          <div className="space-y-12">
            <div className="flex flex-col items-center space-y-6">
              <div className="relative transition-all duration-500 hover:scale-105 flex items-center justify-center h-44 w-44">
                {[1, 2, 3, 4, 5, 6, 7].map((num) => (
                  <img
                    key={num}
                    src={`/images/splash${num}.png`}
                    alt="Ducky Scholar Character"
                    className={`absolute inset-0 h-44 w-44 object-contain transition-all duration-1000 ease-in-out ${currentSplash === num
                      ? "opacity-100 scale-100 z-10"
                      : "opacity-0 scale-95 z-0 pointer-events-none"
                      }`}
                  />
                ))}
              </div>

              {/* 와이어프레임과 동일한 Ducky 로고 색상(#FECA43) 및 폰트 스타일 */}
              <h1 className={`text-6xl font-bold tracking-tight text-[#FECA43] ${comfortaa.className} select-none`}>
                Ducky
              </h1>
            </div>

            {/* 동적 로그인 폼 및 옵션 */}
            <div className="space-y-3.5">
              {/* 이메일 로그인 버튼 (배경: #EFECE5, 텍스트: #333333) */}
              <Button
                onClick={() => setEmailMode("login")}
                disabled={isLoading}
                className="w-full h-13 rounded-xl bg-[#EFECE5] text-[#333333] hover:bg-[#E5E1D8] font-bold border-none shadow-none flex items-center justify-center gap-2 transition-transform active:scale-[0.99] disabled:opacity-50 text-base"
              >
                <Mail className="h-5 w-5 text-[#333333]" />
                이메일로 로그인
              </Button>

              {/* 카카오 로그인 버튼 (배경: #FFE600, 텍스트: #191919) */}
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

              {/* 네이버 로그인 버튼 (배경: #03C75A, 텍스트: 흰색) */}
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
        ) : (
          /* 이메일 로그인 / 회원가입 양식 (회원가입-한 페이지씩-2.png 와이어프레임 완벽 일치) */
          <div className="w-full flex flex-col items-start space-y-8 animate-fade-in duration-300">
            {/* 뒤로가기 버튼 */}
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

            {/* 좌측 정렬된 굵고 큰 타이틀 */}
            <h2 className="text-3.5xl font-bold tracking-tight text-[#333333] select-none pt-2">
              {emailMode === "login" ? "이메일로 로그인" : "이메일로 회원가입"}
            </h2>

            {/* 입력 폼 및 로그인 실행 버튼 */}
            <form onSubmit={handleEmailSubmit} className="w-full space-y-4 pt-4">
              {error && (
                <div className="flex items-center gap-2 p-3.5 text-sm text-red-600 bg-red-50 rounded-xl border border-red-100">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* 회원가입 시 이름 입력 필드 */}
              {emailMode === "signup" && (
                <Input
                  type="text"
                  placeholder="이름 입력"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-13 px-4 rounded-xl bg-[#EFECE5] text-[#333333] placeholder-[#9E988E] border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none text-base font-medium transition-all shadow-none"
                  required
                />
              )}

              {/* 이메일 입력 필드 */}
              <Input
                type="email"
                placeholder="이메일 입력"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-13 px-4 rounded-xl bg-[#EFECE5] text-[#333333] placeholder-[#9E988E] border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none text-base font-medium transition-all shadow-none"
                required
              />

              {/* 비밀번호 입력 필드 */}
              <Input
                type="password"
                placeholder="비밀번호 입력"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-13 px-4 rounded-xl bg-[#EFECE5] text-[#333333] placeholder-[#9E988E] border-none focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none text-base font-medium transition-all shadow-none"
                required
              />

              {/* 로그인 / 회원가입 실행 버튼 */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-13 rounded-xl bg-[#FECA43] hover:bg-[#FECA43]/90 text-white font-bold text-base transition-transform active:scale-[0.99] flex items-center justify-center gap-2 shadow-none border-none"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    emailMode === "login" ? "로그인 하기" : "가입하기"
                  )}
                </Button>
              </div>
            </form>

            {/* 로그인 / 회원가입 전환 텍스트 */}
            <div className="w-full flex justify-center items-center text-sm text-zinc-500 pt-4">
              <button
                type="button"
                onClick={() => {
                  setEmailMode(emailMode === "login" ? "signup" : "login");
                  setError("");
                }}
                className="hover:underline font-bold text-[#FECA43]"
              >
                {emailMode === "login" ? "회원가입하기" : "로그인하기"}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 딜레이 없는 렌더링을 위해 스플래시 이미지를 캐싱하는 숨겨진 프리로더 */}
      <div className="hidden pointer-events-none absolute w-0 h-0 overflow-hidden">
        <img src="/images/splash1.png" alt="preload" />
        <img src="/images/splash2.png" alt="preload" />
        <img src="/images/splash3.png" alt="preload" />
        <img src="/images/splash4.png" alt="preload" />
        <img src="/images/splash5.png" alt="preload" />
        <img src="/images/splash6.png" alt="preload" />
        <img src="/images/splash7.png" alt="preload" />
      </div>
    </div>
  );
}
