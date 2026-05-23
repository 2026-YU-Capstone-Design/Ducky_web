"use client";

import { useState } from "react";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { Comfortaa } from "next/font/google";
const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["700"],
});

type Message = {
  role: "user" | "bot";
  text: string;
};

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "xx님 안녕하세요! 무엇을 도와드릴까요?" },
  ]);

  const sendMessage = (text: string) => {
    const userMsg = { role: "user" as const, text };

    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: "응답입니다 👍" }]);
    }, 800);
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-[#FAF8F5] items-center">
      <div className="flex flex-col w-full max-w-sm h-screen">
        {/* 헤더 영역 */}
        <div
          className={`flex items-center justify-center py-3 border-b border-gray-200 bg-[#FAF8F5] ${comfortaa.className}`}
        >
          <h1 className="text-2xl font-bold text-[#FECA43] tracking-tight select-none">
            Ducky
          </h1>
        </div>
        {/* 채팅 영역 */}
        <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
          {messages.map((msg, i) => (
            <ChatBubble key={i} role={msg.role} text={msg.text} />
          ))}
        </div>

        {/* 입력창 (하단 고정) */}
        <div className="sticky bottom-0">
          <ChatInput onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
}
