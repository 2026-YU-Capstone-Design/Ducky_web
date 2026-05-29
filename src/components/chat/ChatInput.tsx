"use client";

import { useState } from "react";
import { Mic, SendHorizontal, Plus, X } from "lucide-react";

type BrowserSpeechRecognitionEvent = {
  results: {
    [index: number]: {
      [index: number]: {
        transcript: string;
      };
    };
  };
};

type BrowserSpeechRecognition = {
  lang: string;
  onresult: ((event: BrowserSpeechRecognitionEvent) => void) | null;
  start: () => void;
};

type BrowserSpeechRecognitionConstructor = new () => BrowserSpeechRecognition;

declare global {
  interface Window {
    SpeechRecognition?: BrowserSpeechRecognitionConstructor;
    webkitSpeechRecognition?: BrowserSpeechRecognitionConstructor;
  }
}

export function ChatInput({
  onSend,
}: {
  onSend: (payload: { text: string; files?: File[] }) => void;
}) {
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);

  const send = () => {
    if (!input.trim() && files.length === 0) return;

    onSend({
      text: input,
      files,
    });

    setInput("");
    setFiles([]);
  };

  const removeFile = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i));
  };

  const startVoice = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("음성 인식 지원 안됨");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "ko-KR";

    recognition.onresult = (e) => {
      const text = e.results[0][0].transcript;
      setInput(text);
    };

    recognition.start();
  };

  return (
    <div className="w-full border-t border-gray-200 bg-[#FAF8F5]">
      {/* 파일 미리보기 */}
      {files.length > 0 && (
        <div className="flex flex-wrap gap-2 px-3 pt-3 sm:px-4 lg:px-6">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex max-w-full items-center gap-1 rounded bg-gray-200 px-2 py-1 text-xs"
            >
              <span className="max-w-[9rem] truncate sm:max-w-[12rem]">{file.name}</span>

              <button onClick={() => removeFile(i)}>
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 입력창 */}
      <div className="px-3 py-3 sm:px-4 lg:px-6">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 텍스트 입력 영역 */}
          <div className="mb-1 flex min-w-0 flex-1 items-center rounded-full bg-white px-3 py-3 shadow-sm sm:px-4">
            {/* 파일 버튼 */}
            <label className="mr-2 shrink-0 cursor-pointer text-gray-700">
              <Plus className="w-5 h-5" />

              <input
                type="file"
                className="hidden"
                multiple
                onChange={(e) => {
                  const selected = e.target.files;

                  if (!selected) return;

                  setFiles((prev) => [...prev, ...Array.from(selected)]);
                }}
              />
            </label>

            {/* 입력 */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요."
              className="min-w-0 flex-1 bg-transparent text-sm outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
            />

            {/* 전송 버튼 */}
            <button
              onClick={send}
              className="ml-2 shrink-0 cursor-pointer text-gray-700"
            >
              <SendHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* 음성 버튼 */}
          <button
            onClick={startVoice}
            className="
        h-10 w-10 rounded-full sm:h-11 sm:w-11
        bg-[#FECA43]
        flex items-center justify-center
        shrink-0
        active:scale-95
        transition-all duration-300
        cursor-pointer

        shadow-[0_0_12px_rgba(254,202,67,0.55),
                0_0_24px_rgba(254,202,67,0.25)]

        hover:shadow-[0_0_18px_rgba(254,202,67,0.8),
                      0_0_34px_rgba(254,202,67,0.35)]
      "
          >
            <Mic className="w-5 h-5 text-[#3a3935]" />
          </button>
        </div>
      </div>
    </div>
  );
}
