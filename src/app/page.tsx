"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Mail, MessageCircle, ArrowRight, Loader2, Sparkles, AlertCircle, ChevronLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  const [signupStep, setSignupStep] = useState<1 | 2 | 3>(1);
  const [showTerms, setShowTerms] = useState<"service" | "marketing" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentSplash, setCurrentSplash] = useState(1);
  const [error, setError] = useState("");

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

  // 회원가입 상태 관리
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isEmailChecked, setIsEmailChecked] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [emailSuccess, setEmailSuccess] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordConfirmError, setPasswordConfirmError] = useState("");
  const [passwordConfirmSuccess, setPasswordConfirmSuccess] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(true);

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

  const handleEmailLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("이메일과 비밀번호를 모두 입력해 주세요.");
      return;
    }
    setIsLoading(true);
    setError("");
    
    // 이메일 로그인 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      setUser(prev => ({
        ...prev,
        id: "mock-email-user",
        name: email.split("@")[0],
      }));
      router.push("/dashboard");
    }, 1500);
  };

  const handleSignupSubmit = () => {
    setIsLoading(true);
    // 회원가입 시뮬레이션
    setTimeout(() => {
      setIsLoading(false);
      setUser(prev => ({
        ...prev,
        id: "mock-email-user",
        name: name,
        onboarded: false
      }));
      router.push("/dashboard");
    }, 1500);
  };

  // 회원가입 - 이메일 입력 핸들러
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setEmail(val);
    setIsEmailChecked(false);
    setEmailSuccess("");
    if (val.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
      setEmailError("이메일 형식이 올바르지 않습니다.");
    } else {
      setEmailError("");
    }
  };

  // 회원가입 - 중복확인 핸들러
  const handleDuplicateCheck = () => {
    if (emailError || !email) return;
    setIsCheckingEmail(true);
    setEmailSuccess("");
    setEmailError("");
    
    setTimeout(() => {
      setIsCheckingEmail(false);
      if (email === "exist@ducky.com" || email === "test@test.com") {
        setEmailError("이미 존재하는 이메일입니다.");
        setIsEmailChecked(false);
      } else {
        setEmailSuccess("중복 확인이 완료되었습니다.");
        setIsEmailChecked(true);
      }
    }, 800);
  };

  // 회원가입 - 비밀번호 입력 핸들러
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPassword(val);
    if (val.length > 0 && !/^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#&*])[a-zA-Z\d!@#&*]{8,16}$/.test(val)) {
      setPasswordError("비밀번호 형식이 올바르지 않습니다.");
    } else {
      setPasswordError("");
    }
    
    if (passwordConfirm.length > 0) {
      if (val !== passwordConfirm) {
        setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
        setPasswordConfirmSuccess("");
      } else {
        setPasswordConfirmError("");
        if (val.length > 0 && (!passwordError || /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#&*])[a-zA-Z\d!@#&*]{8,16}$/.test(val))) {
          setPasswordConfirmSuccess("비밀번호가 일치합니다.");
        }
      }
    }
  };

  // 회원가입 - 비밀번호 확인 입력 핸들러
  const handlePasswordConfirmChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setPasswordConfirm(val);
    if (val.length > 0) {
      if (val !== password) {
        setPasswordConfirmError("비밀번호가 일치하지 않습니다.");
        setPasswordConfirmSuccess("");
      } else {
        setPasswordConfirmError("");
        if (!passwordError) {
          setPasswordConfirmSuccess("비밀번호가 일치합니다.");
        }
      }
    } else {
      setPasswordConfirmError("");
      setPasswordConfirmSuccess("");
    }
  };

  const renderSignupStep1 = () => (
    <div className="w-full flex flex-col items-start space-y-10 animate-fade-in duration-300 pt-2">
      <button type="button" onClick={() => { setEmailMode("login"); setError(""); }} className="p-1 hover:bg-zinc-200/50 rounded-full transition-colors -ml-1.5 focus:outline-none" aria-label="뒤로가기">
        <ChevronLeft className="h-7 w-7 text-[#333333]" />
      </button>
      <h2 className="text-3xl font-extrabold tracking-tight text-[#333333] select-none">
        이름을 입력해주세요
      </h2>
      <div className="w-full space-y-2 pt-4">
        <label className="text-xs font-bold text-zinc-400 select-none">이름 <span className="text-red-500">*</span></label>
        <input 
          type="text" 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          className="w-full bg-transparent border-b border-zinc-300 focus:border-[#FECA43] focus:outline-none text-lg font-bold text-[#333333] pb-2 transition-colors placeholder:text-zinc-300"
          placeholder="이름 입력"
          required
        />
      </div>
      <div className="w-full pt-10">
        <Button 
          onClick={() => setSignupStep(2)}
          disabled={name.trim().length === 0}
          className={`w-full h-14 rounded-xl font-bold text-base transition-all active:scale-[0.99] border-none shadow-none ${name.trim().length > 0 ? "bg-[#FECA43] text-white hover:bg-[#FECA43]/90" : "bg-[#EFECE5] text-[#9E988E] hover:bg-[#EFECE5]"}`}
        >
          다음
        </Button>
      </div>
    </div>
  );

  const renderSignupStep2 = () => (
    <div className="w-full flex flex-col items-start space-y-10 animate-fade-in duration-300 pt-2">
      <button type="button" onClick={() => setSignupStep(1)} className="p-1 hover:bg-zinc-200/50 rounded-full transition-colors -ml-1.5 focus:outline-none" aria-label="뒤로가기">
        <ChevronLeft className="h-7 w-7 text-[#333333]" />
      </button>
      <h2 className="text-3xl font-extrabold tracking-tight text-[#333333] select-none">
        이메일을 입력해주세요
      </h2>
      <div className="w-full space-y-2 pt-4">
        <label className="text-xs font-bold text-zinc-400 select-none">이메일 <span className="text-red-500">*</span></label>
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
            {isCheckingEmail ? <Loader2 className="h-4 w-4 animate-spin" /> : "중복확인"}
          </Button>
        </div>
        {emailError && <p className="text-xs font-bold text-red-500 pt-1">{emailError}</p>}
        {emailSuccess && <p className="text-xs font-bold text-emerald-500 pt-1">{emailSuccess}</p>}
      </div>
      <div className="w-full pt-10">
        <Button 
          onClick={() => setSignupStep(3)}
          disabled={!isEmailChecked}
          className={`w-full h-14 rounded-xl font-bold text-base transition-all active:scale-[0.99] border-none shadow-none ${isEmailChecked ? "bg-[#FECA43] text-white hover:bg-[#FECA43]/90" : "bg-[#EFECE5] text-[#9E988E] hover:bg-[#EFECE5]"}`}
        >
          다음
        </Button>
      </div>
    </div>
  );

  const renderSignupStep3 = () => (
    <div className="w-full flex flex-col items-start space-y-8 animate-fade-in duration-300 pt-2">
      <button type="button" onClick={() => setSignupStep(2)} className="p-1 hover:bg-zinc-200/50 rounded-full transition-colors -ml-1.5 focus:outline-none" aria-label="뒤로가기">
        <ChevronLeft className="h-7 w-7 text-[#333333]" />
      </button>
      <h2 className="text-3xl font-extrabold tracking-tight text-[#333333] select-none">
        비밀번호를 입력해주세요
      </h2>
      <div className="w-full space-y-6 pt-2">
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 select-none">비밀번호 <span className="text-red-500">*</span></label>
          <input 
            type="password" 
            value={password} 
            onChange={handlePasswordChange} 
            className="w-full bg-transparent border-b border-zinc-300 focus:border-[#FECA43] focus:outline-none text-lg font-bold text-[#333333] pb-2 transition-colors placeholder:text-zinc-300 placeholder:text-sm placeholder:font-medium"
            placeholder="특수문자(!,@,#,&,*), 숫자, 문자의 조합, 8~16자"
            required
          />
          {passwordError && <p className="text-xs font-bold text-red-500 pt-1">{passwordError}</p>}
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-400 select-none">비밀번호 확인 <span className="text-red-500">*</span></label>
          <input 
            type="password" 
            value={passwordConfirm} 
            onChange={handlePasswordConfirmChange} 
            className="w-full bg-transparent border-b border-zinc-300 focus:border-[#FECA43] focus:outline-none text-lg font-bold text-[#333333] pb-2 transition-colors placeholder:text-zinc-300 placeholder:text-sm placeholder:font-medium"
            placeholder="비밀번호 재입력"
            required
          />
          {passwordConfirmError && <p className="text-xs font-bold text-red-500 pt-1">{passwordConfirmError}</p>}
          {passwordConfirmSuccess && <p className="text-xs font-bold text-emerald-500 pt-1">{passwordConfirmSuccess}</p>}
        </div>
      </div>

      {/* 약관 동의 체크박스 */}
      <div className="w-full space-y-3 pt-4 border-t border-zinc-100">
        <div className="flex items-center justify-between group">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${agreeTerms ? 'bg-[#FECA43] border-[#FECA43]' : 'border-zinc-300 bg-white group-hover:border-[#FECA43]/50'}`}>
              {agreeTerms && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>
            <input type="checkbox" className="hidden" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} />
            <span className="text-sm font-bold text-zinc-700 select-none">[필수] 서비스 이용 약관</span>
          </label>
          <button type="button" onClick={() => setShowTerms("service")} className="text-xs font-bold text-zinc-400 hover:text-zinc-600 underline underline-offset-2">보기</button>
        </div>
        
        <div className="flex items-center justify-between group">
          <label className="flex items-center gap-3 cursor-pointer">
            <div className={`w-5 h-5 rounded flex items-center justify-center transition-colors border ${agreeMarketing ? 'bg-[#FECA43] border-[#FECA43]' : 'border-zinc-300 bg-white group-hover:border-[#FECA43]/50'}`}>
              {agreeMarketing && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
            </div>
            <input type="checkbox" className="hidden" checked={agreeMarketing} onChange={(e) => setAgreeMarketing(e.target.checked)} />
            <span className="text-sm font-bold text-zinc-700 select-none">[선택] 마케팅 및 메시지 수신 동의</span>
          </label>
          <button type="button" onClick={() => setShowTerms("marketing")} className="text-xs font-bold text-zinc-400 hover:text-zinc-600 underline underline-offset-2">보기</button>
        </div>
      </div>

      <div className="w-full pt-6">
        <Button 
          onClick={handleSignupSubmit}
          disabled={!password || !!passwordError || !passwordConfirm || !!passwordConfirmError || !agreeTerms || isLoading}
          className={`w-full h-14 rounded-xl font-bold text-base transition-all active:scale-[0.99] border-none shadow-none ${(password && !passwordError && passwordConfirm && !passwordConfirmError && agreeTerms) ? "bg-[#FECA43] text-white hover:bg-[#FECA43]/90" : "bg-[#EFECE5] text-[#9E988E] hover:bg-[#EFECE5]"}`}
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "다음"}
        </Button>
      </div>
    </div>
  );

  const renderTermsModal = () => {
    if (!showTerms) return null;
    const isService = showTerms === "service";
    const title = isService ? "서비스 이용 약관" : "마케팅 및 메시지 수신 동의";
    
    return (
      <div className="absolute inset-0 z-50 flex flex-col bg-[#FAF8F5] animate-fade-in duration-300 rounded-lg">
        <div className="flex items-center justify-between p-2 pb-4 mb-2 border-b border-zinc-200/60">
          <button type="button" onClick={() => setShowTerms(null)} className="p-2 hover:bg-zinc-200/50 rounded-full transition-colors focus:outline-none -ml-2">
            <ChevronLeft className="h-6 w-6 text-zinc-800" />
          </button>
          <h3 className="font-extrabold text-zinc-800 text-lg">{title}</h3>
          <div className="w-10"></div> {/* Spacer for centering */}
        </div>
        <div className="flex-1 overflow-y-auto text-sm text-zinc-600 space-y-5 leading-relaxed pr-2 pb-10">
          {isService ? (
            <>
              <div>
                <p className="font-bold text-zinc-800 text-base mb-1">제1조 (목적)</p>
                <p>본 약관은 Ducky(이하 "회사")가 제공하는 AI 러버덕 학습 서비스(이하 "서비스")의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.</p>
              </div>
              <div>
                <p className="font-bold text-zinc-800 text-base mb-1">제2조 (용어의 정의)</p>
                <p>1. "회원"이란 본 약관에 따라 회사와 이용계약을 체결하고 회사가 제공하는 서비스를 이용하는 자를 말합니다.</p>
                <p>2. "덕버깅(DuckBugging)"이란 사용자가 AI 러버덕과 대화하며 스스로 문제를 해결하도록 돕는 학습 방식을 의미합니다.</p>
              </div>
              <div>
                <p className="font-bold text-zinc-800 text-base mb-1">제3조 (약관의 효력 및 변경)</p>
                <p>본 약관은 회원이 동의함으로써 효력이 발생하며, 회사는 관련 법령을 위배하지 않는 범위 내에서 약관을 개정할 수 있습니다.</p>
              </div>
              <div>
                <p className="font-bold text-zinc-800 text-base mb-1">제4조 (서비스의 제공 및 중단)</p>
                <p>회사는 연중무휴 1일 24시간 서비스 제공을 원칙으로 하나, 시스템 점검, 증설 및 교체 등의 이유로 서비스를 일시 중단할 수 있습니다.</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <p className="font-bold text-zinc-800 text-base mb-1">마케팅 정보 수신 동의</p>
                <p>회사는 회원의 학습 효율을 높이기 위한 맞춤형 팁, 신규 기능 업데이트 소식, 이벤트 및 혜택 정보를 제공하기 위해 마케팅 정보를 발송할 수 있습니다.</p>
              </div>
              <div>
                <p className="font-bold text-zinc-800 text-base mb-1">수집 및 이용 목적</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>신규 서비스 안내 및 맞춤형 학습 콘텐츠 제안</li>
                  <li>이벤트 당첨 결과 안내 및 경품 제공</li>
                </ul>
              </div>
              <div>
                <p className="font-bold text-zinc-800 text-base mb-1">보유 및 이용 기간</p>
                <p>동의 철회 시 또는 회원 탈퇴 시까지 보관 및 이용됩니다.</p>
              </div>
              <p className="text-xs font-bold text-[#FECA43] bg-[#FECA43]/10 p-3 rounded-xl">
                * 본 동의는 선택사항이므로 동의하지 않으셔도 서비스의 기본 기능은 이용하실 수 있습니다.
              </p>
            </>
          )}
        </div>
      </div>
    );
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

  // 3단계: 메인 로그인 화면
  return (
    <div className={`flex min-h-screen w-full flex-col bg-[#FAF8F5] font-sans transition-all duration-500 ${
      emailMode === "options"
        ? "items-center justify-center p-6"
        : "items-center justify-start pt-14 pb-8 px-6 md:justify-center md:pt-6"
    }`}>
      <div className="w-full max-w-sm animate-fade-in duration-500 relative flex flex-col h-full min-h-[400px]">
        
        {/* Render Terms Modal overlay */}
        {renderTermsModal()}
        
        {/* 옵션 화면 */}
        {emailMode === "options" && (
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
              <h1 className={`text-6xl font-bold tracking-tight text-[#FECA43] ${comfortaa.className} select-none`}>
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
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <MessageCircle className="h-5 w-5 fill-[#191919] text-[#191919]" />}
                카카오로 로그인
              </Button>
              <Button
                onClick={() => handleSocialLogin("naver")}
                disabled={isLoading}
                className="w-full h-13 rounded-xl bg-[#03C75A] text-white hover:bg-[#02B350] font-bold border-none shadow-none flex items-center justify-center gap-2 transition-transform active:scale-[0.99] disabled:opacity-50 text-base"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <span className="font-extrabold text-lg mr-1 select-none">N</span>}
                네이버로 로그인
              </Button>
            </div>
          </div>
        )}

        {/* 기존 이메일 로그인 양식 */}
        {emailMode === "login" && (
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
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "로그인 하기"}
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
        )}

        {/* 3단계 회원가입 위저드 */}
        {emailMode === "signup" && (
          <>
            {signupStep === 1 && renderSignupStep1()}
            {signupStep === 2 && renderSignupStep2()}
            {signupStep === 3 && renderSignupStep3()}
          </>
        )}
      </div>

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
