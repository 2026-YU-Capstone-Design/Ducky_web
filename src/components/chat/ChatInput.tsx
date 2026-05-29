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
    <div className="w-full bg-[#FAF8F5] border-t border-gray-200">
      {/* 파일 미리보기 */}
      {files.length > 0 && (
        <div className="flex gap-2 px-4 pt-3 flex-wrap">
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
      <div className="px-4 py-3">
        <div className="flex items-center gap-3">
          {/* 텍스트 입력 영역 */}
          <div className="flex flex-1 items-center bg-white rounded-full px-4 py-3 mb-1 shadow-sm">
            {/* 파일 버튼 */}
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

            {/* 입력 */}
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="메시지를 입력하세요."
              className="flex-1 outline-none text-sm bg-transparent"
              onKeyDown={(e) => {
                if (e.key === "Enter") send();
              }}
            />

            {/* 전송 버튼 */}
            <button
              onClick={send}
              className="text-gray-700 cursor-pointer ml-2"
            >
              <SendHorizontal className="w-5 h-5" />
            </button>
          </div>

          {/* 음성 버튼 */}
          <button
            onClick={startVoice}
            className="
        w-11 h-11 rounded-full
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
