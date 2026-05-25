interface Props {
  role: "user" | "bot";
  text: string;
}

export function ChatBubble({ role, text }: Props) {
  const isUser = role === "user";

  return (
    <div
      className={`flex items-end gap-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {/* AI 프로필 */}
      {!isUser && (
        <img
          src="/images/splash7.png"
          alt="ducky"
          className="w-8 h-8 rounded-full object-cover"
        />
      )}

      {/* 말풍선 */}
      <div
        className={`max-w-[75%] w-fit px-4 py-3 rounded-2xl text-sm shadow-sm ${
          isUser ? "bg-[#FECA43] text-white" : "bg-white text-gray-800"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
