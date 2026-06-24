"use client";

import {
  CalendarDays,
  MessageCircle,
  Sparkles,
  CheckCircle2,
  Clock3,
} from "lucide-react";
import type { Session } from "@/types/session";
import { cn } from "@/lib/utils";

interface SessionCardProps {
  isSelected?: boolean;
  onSelect: (session: Session) => void;
  session: Session;
}

function statusLabel(status: Session["status"]) {
  return status === "completed" ? "완료" : "진행 중";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export function SessionCard({
  isSelected,
  onSelect,
  session,
}: SessionCardProps) {
  const isCompleted = session.status === "completed";

  return (
    <button
      type="button"
      onClick={() => onSelect(session)}
      aria-label={`${session.title} 상세 보기`}
      className={cn(
        "group relative flex h-[200px] w-full overflow-hidden rounded-2xl border text-left outline-none transition-all duration-200",
        "focus-visible:ring-2 focus-visible:ring-amber-400 focus-visible:ring-offset-2",
        isSelected
          ? "border-amber-400 bg-amber-50/60 shadow-[0_0_0_3px_rgba(251,191,36,0.18)] dark:bg-amber-900/10"
          : "border-amber-200/60 bg-white hover:border-amber-300/80 hover:bg-amber-50/40 dark:bg-[#1A1714] dark:border-amber-900/30 dark:hover:border-amber-800/50 dark:hover:bg-amber-900/10",
      )}
    >
      <div className="relative flex w-full flex-col justify-between p-5">
        <div className="flex items-start justify-between gap-3">
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            <Sparkles className="size-3 shrink-0" />
            <span className="truncate">{session.topic}</span>
          </span>
          <span
            className={cn(
              "shrink-0 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold",
              isCompleted
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                : "bg-[#FFF1BC] text-[#6B5200] dark:bg-amber-900/40 dark:text-amber-300",
            )}
          >
            {statusLabel(session.status)}
          </span>
        </div>

        <div className="mt-2.5 min-h-0 flex-1">
          <h3 className="line-clamp-1 text-[15px] font-black leading-snug tracking-tight text-gray-950 break-keep dark:text-white">
            {session.title}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-gray-500 break-keep dark:text-gray-400">
            {session.summary}
          </p>
        </div>

        <div className="mt-4 flex items-center justify-between gap-2 border-t border-amber-100/80 pt-3 dark:border-white/[0.06]">
          <div className="flex items-center gap-3 text-[11px] text-[#c4ad88]">
            <span className="inline-flex items-center gap-1">
              <Sparkles className="size-3 text-amber-400" />
              힌트 {session.hintCount}회
            </span>
            <span className="inline-flex items-center gap-1">
              <MessageCircle className="size-3 text-amber-400" />
              {session.messageCount}개
            </span>
          </div>
          <span className="inline-flex shrink-0 items-center gap-1 text-[11px] text-[#c4ad88]">
            <CalendarDays className="size-3" />
            {formatDate(session.updatedAt)}
          </span>
        </div>
      </div>
    </button>
  );
}
