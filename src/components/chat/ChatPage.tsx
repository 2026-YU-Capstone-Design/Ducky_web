"use client";

import { useState, useRef, useEffect } from "react";
import { ChatBubble } from "./ChatBubble";
import { ChatInput } from "./ChatInput";
import { Comfortaa } from "next/font/google";

const comfortaa = Comfortaa({
  subsets: ["latin"],
  weight: ["700"],
});

type Message = {
  role: "user" | "bot";
  text?: string;
  files?: File[];
};

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "xx님 안녕하세요! 무엇을 도와드릴까요?" },
  ]);

  const sendMessage = (data: { text: string; files?: File[] }) => {
    const userMsg: Message = {
      role: "user",
      text: data.text.trim() || undefined,
      files: data.files,
    };

    setMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      setMessages((prev) => [...prev, { role: "bot", text: "응답입니다 👍" }]);
    }, 800);
  };

  const openFile = (file: File) => {
    const url = URL.createObjectURL(file);
    window.open(url);
  };

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex min-h-dvh w-full flex-col items-center bg-[#FAF8F5] sm:px-4 lg:px-8">
      <div className="relative flex h-dvh w-full max-w-full flex-col bg-[#FAF8F5] sm:my-4 sm:h-[calc(100dvh-2rem)] sm:max-w-2xl sm:overflow-hidden sm:rounded-lg sm:border sm:border-[#ECE7DC] sm:shadow-sm lg:max-w-4xl xl:max-w-5xl">
        {/* 헤더 */}
        <div
          className={`flex shrink-0 items-center justify-center border-b border-[#ECE7DC] bg-[#FAF8F5] px-4 py-4 ${comfortaa.className}`}
        >
          <h1 className="text-2xl font-bold text-[#FECA43]">Ducky</h1>
        </div>

        {/* 채팅 */}
        <div className="flex-1 space-y-4 overflow-y-auto px-3 py-5 pb-28 sm:px-5 sm:py-6 sm:pb-32 lg:px-8">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              } w-full`}
            >
              {/* 파일 */}
              {msg.files && msg.files.length > 0 && (
                <div className="mb-2 mr-1 flex max-w-[min(20rem,82%)] flex-wrap gap-2 sm:max-w-[70%]">
                  {msg.files.map((file, idx) => {
                    const isImage = file.type.startsWith("image/");

                    return (
                      <div
                        key={idx}
                        onClick={() => openFile(file)}
                        className="cursor-pointer"
                      >
                        {isImage ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={file.name}
                            className="h-24 w-24 rounded-lg object-cover shadow sm:h-28 sm:w-28"
                          />
                        ) : (
                          <div className="max-w-full rounded-lg bg-gray-200 px-3 py-2 text-xs break-words">
                            📄 {file.name}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* 텍스트 */}
              {msg.text && <ChatBubble role={msg.role} text={msg.text} />}
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {/* 입력창 */}
        <div className="absolute bottom-0 left-0 right-0">
          <ChatInput onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
}
