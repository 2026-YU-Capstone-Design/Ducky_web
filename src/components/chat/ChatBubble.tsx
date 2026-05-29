interface Props {
  role: "user" | "bot";
  text: string;
}

export function ChatBubble({ role, text }: Props) {
  const isUser = role === "user";

  return (
    <div
      className={`flex items-end gap-2 w-full ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <img
          src="/images/splash7.png"
          alt="ducky"
          className="w-8 h-8 rounded-full object-cover"
        />
      )}

      <div
        className={`max-w-[75%]
        px-4 py-3 rounded-2xl text-sm shadow-sm
        break-keep break-words whitespace-pre-wrap
        leading-relaxed ${
          isUser ? "bg-[#FECA43] text-white" : "bg-white text-gray-800"
        }`}
      >
        {text}
      </div>
    </div>
  );
}
