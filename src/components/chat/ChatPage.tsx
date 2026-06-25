"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMockChat } from "@/hooks/useMockChat";
import { useVoiceInput } from "@/hooks/useVoiceInput";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { HintPanel } from "./HintPanel";

export function ChatPage() {
  const [draft, setDraft] = useState("");
  const [isHintOpen, setIsHintOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const {
    activeSession,
    completeSession,
    hintCount,
    hintHistory,
    isCompleted,
    isThinking,
    messages,
    requestHint,
    sendMessage,
    stageIndex,
  } = useMockChat();

  const handleTranscript = useCallback((text: string) => {
    setDraft((current) => (current.trim() ? `${current}\n${text}` : text));
  }, []);

  const voice = useVoiceInput({
    onTranscript: handleTranscript,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isThinking]);

  const hintPanel = (
    <HintPanel
      activeTitle={activeSession.title}
      activeTopic={activeSession.topic}
      hintCount={hintCount}
      hintHistory={hintHistory}
      isCompleted={isCompleted}
      isThinking={isThinking}
      onComplete={completeSession}
      onRequestHint={requestHint}
      stageIndex={stageIndex}
    />
  );

  return (
    <div className="flex h-[calc(100dvh-5.75rem)] min-h-0 w-full bg-[#FFFCF3] transition-colors dark:bg-[#16130A] md:h-dvh">
      <div className="flex min-h-0 w-full gap-4 p-0 sm:p-4 lg:p-6">
        <section className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#FFFCF3] transition-colors dark:bg-[#16130A] sm:rounded-2xl sm:border sm:border-[#F0E0A8] sm:shadow-sm sm:dark:border-[#5C4413]/40 sm:dark:shadow-none">
          <header className="flex shrink-0 items-center justify-between gap-3 border-b border-[#F0E0A8] bg-white px-5 py-4 transition-colors dark:border-[#5C4413]/40 dark:bg-[#221C0D]">
            <h1 className="min-w-0 truncate text-lg font-bold text-[#3D2E0A] dark:text-[#F0E0C4]">
              {activeSession.topic} 질문 훈련
            </h1>

            <div className="flex shrink-0 items-center gap-3">
              <span className="text-xs font-semibold whitespace-nowrap text-[#8A6A28] dark:text-[#C4A85A]">
                메시지 {messages.length}개
              </span>

              <div className="block h-3.5 w-px bg-[#F0E0A8] lg:hidden dark:bg-[#5C4413]/40" />

              <Button
                type="button"
                onClick={() => setIsHintOpen(true)}
                className="h-9 gap-1.5 rounded-full bg-[#3D2E0A] px-4 text-[13px] font-bold text-[#FFEFC4] hover:bg-[#5C4413] dark:bg-[#FECA43] dark:text-[#3D2E0A] dark:hover:bg-[#F5B522] lg:hidden"
              >
                <Lightbulb className="size-4" aria-hidden="true" />
                힌트
              </Button>
            </div>
          </header>

          <ScrollArea className="min-h-0 flex-1">
            <div className="space-y-4 px-3 py-5 sm:px-5 lg:px-8">
              <div className="mx-auto max-w-3xl rounded-2xl border border-[#F0E0A8] bg-[#FFF6DC] px-4 py-3 text-sm leading-relaxed text-[#5C4413] break-keep transition-colors dark:border-[#5C4413]/40 dark:bg-[#2A2310] dark:text-[#E8C97A]">
                <p className="font-bold text-[#3D2E0A] dark:text-[#FECA43]">
                  오늘의 대화 목표
                </p>
                <p className="mt-1">
                  정답을 바로 받기보다, 개념을 자신의 말로 설명하도록 질문과
                  힌트를 필요한 만큼 사용합니다.
                </p>
              </div>

              {messages.map((message) => (
                <ChatBubble key={message.id} message={message} />
              ))}

              {isThinking && (
                <div className="flex items-end gap-2">
                  <div className="relative size-[30px] shrink-0 overflow-hidden rounded-full bg-[#FECA43]">
                    <Image
                      src="/images/splash7.png"
                      alt="Ducky"
                      width={30}
                      height={30}
                      className="size-full object-cover"
                    />
                  </div>
                  <div className="rounded-[14px] rounded-bl-[4px] border border-[#F0E0A8] bg-[#FFF6DC] px-[15px] py-[11px] transition-colors dark:border-[#5C4413]/40 dark:bg-[#2A2310]">
                    <span className="inline-flex gap-1">
                      <span className="size-1.5 animate-bounce rounded-full bg-[#C4A85A] [animation-delay:-0.3s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-[#C4A85A] [animation-delay:-0.15s]" />
                      <span className="size-1.5 animate-bounce rounded-full bg-[#C4A85A]" />
                    </span>
                  </div>
                </div>
              )}

              <div ref={bottomRef} />
            </div>
          </ScrollArea>

          <ChatInput
            disabled={isThinking || isCompleted}
            onChange={setDraft}
            onSend={sendMessage}
            onVoiceCancel={voice.cancel}
            onVoiceStart={voice.start}
            value={draft}
            voiceStatus={voice.status}
            voiceStatusLabel={voice.statusLabel}
          />
        </section>

        <aside className="hidden min-h-0 w-88 shrink-0 lg:block">
          {hintPanel}
        </aside>
      </div>

      <Sheet open={isHintOpen} onOpenChange={setIsHintOpen}>
        <SheetContent
          side="bottom"
          className="max-h-[84dvh] rounded-t-2xl bg-[#FFFCF3] p-0 dark:bg-[#16130A]"
        >
          <SheetHeader className="border-b border-[#F0E0A8] bg-white p-4 pr-12 dark:border-[#5C4413]/40 dark:bg-[#221C0D]">
            <SheetTitle className="text-lg font-bold text-[#3D2E0A] dark:text-[#F0E0C4]">
              힌트 패널
            </SheetTitle>
            <SheetDescription className="text-[#8A6A28] dark:text-[#C4A85A]">
              막히는 지점에서 단서를 계속 요청하고, 알겠으면 완료하세요.
            </SheetDescription>
          </SheetHeader>
          <div className="max-h-[calc(84dvh-5rem)] overflow-y-auto p-4">
            <HintPanel
              activeTitle={activeSession.title}
              activeTopic={activeSession.topic}
              className="border-0 shadow-none"
              hintCount={hintCount}
              hintHistory={hintHistory}
              isCompleted={isCompleted}
              isThinking={isThinking}
              onComplete={completeSession}
              onRequestHint={requestHint}
              showHeader={false}
              stageIndex={stageIndex}
            />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
