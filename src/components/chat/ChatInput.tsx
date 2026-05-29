"use client";

import { useState } from "react";
import { Mic, SendHorizontal, Plus, X } from "lucide-react";

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
    <div className="w-full px-4 pb-4 pt-2">
      {/* 마이크 */}
      <div className="flex justify-center mb-8">
        <button
          onClick={startVoice}
          className="w-16 h-16 rounded-full bg-[#7c7a74] flex items-center justify-center text-[#FECA43] shadow-md active:scale-95 transition hover:bg-[#8e8c81] cursor-pointer"
        >
          <Mic className="w-7 h-7" />
        </button>
      </div>

      {/* 파일 미리보기 */}
      {files.length > 0 && (
        <div className="flex gap-2 mb-2 flex-wrap">
          {files.map((file, i) => (
            <div
              key={i}
              className="flex items-center gap-1 bg-gray-200 text-xs px-2 py-1 rounded"
            >
              <span className="max-w-[120px] truncate">{file.name}</span>

              <button onClick={() => removeFile(i)}>
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 입력창 */}
      <div className="flex items-center bg-white rounded-2xl px-3 py-3 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
        <label className="cursor-pointer text-gray-700 mr-2">
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

        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요."
          className="flex-1 outline-none text-sm px-2 bg-transparent"
          onKeyDown={(e) => {
            if (e.key === "Enter") send();
          }}
        />

        <button onClick={send} className="ml-2 text-gray-700 cursor-pointer">
          <SendHorizontal className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
