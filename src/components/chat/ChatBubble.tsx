interface Props {
  role: "user" | "bot";
  text: string;
}

export function ChatBubble({ role, text }: Props) {
  const isUser = role === "user";

  return (
    <div
      className={`flex w-full items-end gap-2 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <img
          src="/images/splash7.png"
          alt="ducky"
          className="h-8 w-8 shrink-0 rounded-full object-cover"
        />
      )}

      <div
        className={`max-w-[82%] sm:max-w-[72%] lg:max-w-[62%]
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
