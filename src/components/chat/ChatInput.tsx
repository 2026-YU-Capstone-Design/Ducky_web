"use client";

import { useState } from "react";
import { Mic } from "lucide-react";
import { SendHorizontal } from "lucide-react";
import { Plus } from "lucide-react";

export function ChatInput({ onSend }: { onSend: (text: string) => void }) {
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const startVoice = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("음성 인식 지원 안됨");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";

    recognition.onresult = (e: any) => {
      const text = e.results[0][0].transcript;
      setInput(text);
    };

    recognition.start();
  };

  return (
    <div className="w-full bg-[#FAF8F5] px-4 pb-4 pt-2">
      {/* 중앙 마이크 버튼 */}
      <div className="flex justify-center mb-5">
        <button
          onClick={startVoice}
          className="w-16 h-16 rounded-full bg-[#FECA43] flex items-center justify-center text-xl text-white shadow-md active:scale-95 transition"
        >
          <Mic />
        </button>
      </div>

      {/* 입력창 */}
      <div className="flex items-center bg-white rounded-sm px-3 py-3 shadow-sm">
        {/*  파일 업로드 */}
        <label className="cursor-pointer text-gray-700 mr-2">
          <Plus className="w-5 h-5" />
          <input
            type="file"
            className="hidden"
            onChange={(e) => {
              console.log(e.target.files);
            }}
          />
        </label>

        {/* 텍스트 입력 */}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요."
          className="flex-1 outline-none text-sm px-2"
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />

        {/* 전송 버튼 */}
        <button
          onClick={send}
          className="ml-2 text-gray-700 font-bold cursor-pointer"
        >
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
