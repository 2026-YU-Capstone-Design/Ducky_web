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
    <div className="flex flex-col w-full min-h-screen bg-[#FAF8F5] items-center">
      <div className="flex flex-col w-full max-w-sm h-screen relative">
        {/* 헤더 */}
        <div
          className={`flex items-center justify-center py-3 border-b border-gray-200 bg-[#FAF8F5] ${comfortaa.className}`}
        >
          <h1 className="text-2xl font-bold text-[#FECA43]">Ducky</h1>
        </div>

        {/* 채팅 */}
        <div className="flex-1 overflow-y-auto px-4 py-6 pb-44 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex flex-col ${
                msg.role === "user" ? "items-end" : "items-start"
              } w-full`}
            >
              {/* 텍스트 */}
              {msg.text && <ChatBubble role={msg.role} text={msg.text} />}

              {/* 파일 */}
              {msg.files && msg.files.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-2 max-w-[70%]">
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
                            className="w-28 h-28 object-cover rounded-lg shadow"
                          />
                        ) : (
                          <div className="bg-gray-200 px-3 py-2 rounded-lg text-xs">
                            📄 {file.name}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
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
