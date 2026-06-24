"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageCircle,
  BookOpen,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { mockSessions } from "@/data/mockSessions";
import type { ChatMessage } from "@/types/chat";
import type { Session, SessionStatus } from "@/types/session";
import { cn } from "@/lib/utils";
import { SessionCard } from "./SessionCard";

type SessionFilter = "all" | SessionStatus;

const filters: Array<{ label: string; value: SessionFilter }> = [
  { label: "전체", value: "all" },
  { label: "진행 중", value: "in_progress" },
  { label: "완료", value: "completed" },
];

function statusLabel(status: SessionStatus) {
  return status === "completed" ? "완료" : "진행 중";
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function messageAuthor(message: ChatMessage) {
  if (message.role === "user") return "나";
  if (message.type === "hint") {
    const hintLabel = message.hintNumber ?? message.hintLevel;
    return hintLabel ? `힌트 ${hintLabel}` : "힌트";
  }
  return "Ducky";
}

function SessionMessage({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const isHint = message.type === "hint";

  if (message.role === "system") {
    return (
      <div className="flex justify-center">
        <p className="max-w-[min(28rem,90%)] rounded-full bg-[#F0E0A8]/60 px-3 py-1.5 text-center text-xs font-semibold text-[#5C4413] break-keep transition-colors dark:bg-[#3A2F12] dark:text-[#E8C97A]">
          {message.content}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex w-full items-end gap-2",
        isUser ? "justify-end" : "justify-start",
      )}
    >
      {!isUser && (
        <div className="relative size-[30px] shrink-0 overflow-hidden rounded-full bg-[#FECA43]">
          <Image
            src="/images/splash7.png"
            alt="Ducky"
            width={30}
            height={30}
            className="size-full object-cover"
          />
        </div>
      )}

      <div
        className={cn(
          "flex max-w-[86%] flex-col gap-[3px]",
          isUser && "items-end",
        )}
      >
        {isHint && (
          <p className="px-1.5 text-xs font-bold text-[#946200] dark:text-[#FECA43]">
            힌트 · {message.hintNumber ?? message.hintLevel}번째
          </p>
        )}

        <div
          className={cn(
            "rounded-[14px] px-[15px] py-[11px] text-[13.5px] leading-relaxed break-keep break-words whitespace-pre-wrap",
            isUser
              ? "rounded-br-[4px] border border-[#F0E0A8] bg-[#FFF9E8] text-[#3D2E0A] dark:border-white/10 dark:bg-[#2A2310] dark:text-[#F0E0C4]"
              : "rounded-bl-[4px] border border-[#F0E0A8] bg-white text-[#3D2E0A] dark:border-white/10 dark:bg-[#211C12] dark:text-[#F0E0C4]",
            isHint &&
              "border-2 border-[#FECA43] bg-[#FFE9A0] dark:border-[#FECA43] dark:bg-[#46350F]",
          )}
        >
          {message.content}
        </div>

        <time
          className={cn(
            "px-1.5 text-[10px] text-[#c4ad88]",
            isUser && "text-right",
          )}
        >
          {formatDateTime(message.createdAt)}
        </time>
      </div>
    </div>
  );
}

function SessionDetail({ session }: { session: Session }) {
  const isCompleted = session.status === "completed";

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      {/* 상단 stat 스트립 — 채팅 페이지 헤더 톤 */}
      <div className="grid shrink-0 grid-cols-3 divide-x divide-[#F0E0A8] border-b border-[#F0E0A8] bg-white dark:divide-[#5C4413]/40 dark:border-[#5C4413]/40 dark:bg-[#221C0D]">
        {[
          {
            label: "상태",
            value: statusLabel(session.status),
            accent: isCompleted
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-[#946200] dark:text-[#FECA43]",
          },
          {
            label: "힌트 사용",
            value: `${session.hintCount}회`,
            accent: "text-[#3D2E0A] dark:text-[#F0E0C4]",
          },
          {
            label: "메시지",
            value: `${session.messageCount}개`,
            accent: "text-[#3D2E0A] dark:text-[#F0E0C4]",
          },
        ].map((item) => (
          <div
            key={item.label}
            className="flex flex-col items-center justify-center py-4"
          >
            <p
              className={cn(
                "text-lg font-black tabular-nums tracking-tight",
                item.accent,
              )}
            >
              {item.value}
            </p>
            <p className="mt-0.5 text-[11px] text-[#8A6A28] dark:text-[#C4A85A]">
              {item.label}
            </p>
          </div>
        ))}
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto bg-[#FFFCF3] px-5 pb-6 pt-4 dark:bg-[#16130A]">
        {/* 요약 */}
        <div className="rounded-2xl border border-[#F0E0A8] bg-[#FFF6DC] px-4 py-4 dark:border-[#5C4413]/40 dark:bg-[#2A2310]">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#946200] dark:text-[#FECA43]">
            요약
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[#3D2E0A] break-keep dark:text-[#E8C97A]">
            {session.summary}
          </p>
          <dl className="mt-3 grid gap-3 border-t border-[#F0E0A8] pt-3 text-sm dark:border-[#5C4413]/40 sm:grid-cols-2">
            <div>
              <dt className="text-[11px] text-[#8A6A28] dark:text-[#C4A85A]">
                시작
              </dt>
              <dd className="mt-0.5 font-semibold text-[#3D2E0A] dark:text-[#F0E0C4]">
                {formatDateTime(session.startedAt)}
              </dd>
            </div>
            <div>
              <dt className="text-[11px] text-[#8A6A28] dark:text-[#C4A85A]">
                {session.completedAt ? "완료" : "최근 업데이트"}
              </dt>
              <dd className="mt-0.5 font-semibold text-[#3D2E0A] dark:text-[#F0E0C4]">
                {formatDateTime(session.completedAt ?? session.updatedAt)}
              </dd>
            </div>
          </dl>
        </div>

        {/* 대화 내역 */}
        <div className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#8A6A28] dark:text-[#C4A85A]">
              대화 내역
            </h3>
            <span className="text-[11px] text-[#8A6A28] dark:text-[#C4A85A]">
              {session.messages.length}개
            </span>
          </div>
          <div className="overflow-y-auto rounded-2xl border border-[#F0E0A8] bg-[#FFFCF3] dark:border-[#5C4413]/40 dark:bg-[#16130A]">
            <div className="space-y-4 p-4 sm:px-5 lg:px-8">
              {session.messages.map((message) => (
                <SessionMessage key={message.id} message={message} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SessionHistory() {
  const [filter, setFilter] = useState<SessionFilter>("all");
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);

  const sortedSessions = useMemo(
    () =>
      [...mockSessions].sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      ),
    [],
  );

  const filteredSessions = useMemo(
    () =>
      filter === "all"
        ? sortedSessions
        : sortedSessions.filter((s) => s.status === filter),
    [filter, sortedSessions],
  );

  const completedCount = sortedSessions.filter(
    (s) => s.status === "completed",
  ).length;
  const inProgressCount = sortedSessions.filter(
    (s) => s.status === "in_progress",
  ).length;

  return (
    <div className="flex min-h-full w-full flex-1 flex-col bg-[#FFFCF3] transition-colors dark:bg-[#16130A]">
      <section className="mx-auto flex w-full max-w-7xl flex-1 flex-col px-5 py-8 sm:px-8 lg:px-10">
        {/* ── 헤더 ── */}
        <div className="mb-2 py-6">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 mb-3 text-[10px] font-bold tracking-[0.12em] text-amber-700 uppercase dark:bg-amber-900/40 dark:text-amber-300">
            <span className="size-1.5 rounded-full bg-amber-400 animate-pulse" />
            Session History
          </span>
          <h1 className="mt-3 text-[30px] font-black leading-[1.15] tracking-[-1px] text-gray-950 dark:text-white sm:text-[40px]">
            지난 대화를 다시
            <br className="sm:hidden" /> 꺼내보세요
            <span className="text-amber-400">.</span>
          </h1>
          <div className="mt-4 ml-1.5">
            <div className="flex items-end justify-between gap-6">
              <p className="text-[13px] font-medium leading-relaxed text-[#b8975c] dark:text-amber-400/70">
                완료되었거나 진행 중인 세션을 열어 질문 흐름과 Ducky의 피드백을
                확인하세요.
              </p>
              <div className="flex shrink-0 items-center gap-4">
                {[
                  { label: "전체", value: sortedSessions.length },
                  { label: "진행 중", value: inProgressCount },
                  { label: "완료", value: completedCount },
                ].map((s) => (
                  <span
                    key={s.label}
                    className="text-[13px] text-[#b8975c] dark:text-amber-400/70"
                  >
                    {s.label}{" "}
                    <strong className="text-[18px] font-black leading-none tracking-tight text-amber-900 dark:text-amber-200">
                      {s.value}
                    </strong>
                  </span>
                ))}
              </div>
            </div>
            <div className="mt-8 border-t border-amber-200/60 dark:border-amber-800/40" />
          </div>
        </div>

        {/* ── 필터 툴바 ── */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2" aria-label="세션 필터">
            {filters.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setFilter(item.value)}
                className={cn(
                  "h-9 rounded-full px-5 text-sm font-semibold transition-all duration-200",
                  filter === item.value
                    ? "bg-[#2E2A22] text-white shadow-sm dark:bg-amber-400 dark:text-amber-950"
                    : "border border-amber-200/60 bg-white text-gray-600 hover:border-amber-400 hover:bg-amber-50 dark:border-amber-900/40 dark:bg-[#1E1B16] dark:text-gray-300 dark:hover:bg-amber-900/20",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-4 text-xs text-gray-400 dark:text-gray-500">
            <span className="inline-flex items-center gap-1.5">
              <Clock3 className="size-3.5 text-amber-500" />
              진행 중
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 className="size-3.5 text-emerald-500" />
              완료됨
            </span>
          </div>
        </div>

        {/* ── 카드 그리드 ── */}
        <div className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
          {filteredSessions.map((session) => (
            <SessionCard
              key={session.id}
              isSelected={selectedSession?.id === session.id}
              onSelect={setSelectedSession}
              session={session}
            />
          ))}
        </div>

        {filteredSessions.length === 0 && (
          <div className="mt-5 flex flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200/60 bg-white/60 px-5 py-20 text-center dark:border-amber-900/30 dark:bg-[#1E1B16]/60">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-amber-50 ring-1 ring-amber-200/60 dark:from-amber-900/40 dark:to-amber-900/10 dark:ring-amber-800/30">
              <BookOpen className="size-5 text-amber-500" />
            </div>
            <p className="mt-4 font-bold text-gray-950 dark:text-white">
              표시할 세션이 없습니다
            </p>
            <p className="mt-1.5 text-sm text-[#c4ad88]">
              다른 필터를 선택하면 세션 기록을 볼 수 있습니다.
            </p>
          </div>
        )}

        {/* ── 상세 다이얼로그 ── */}
        <Dialog
          open={selectedSession !== null}
          onOpenChange={(open) => {
            if (!open) setSelectedSession(null);
          }}
        >
          <DialogContent className="flex max-h-[92dvh] min-h-[min(42rem,92dvh)] flex-col gap-0 overflow-hidden rounded-2xl border-[#F0E0A8] bg-[#FFFCF3] p-0 dark:border-[#5C4413]/40 dark:bg-[#16130A] sm:max-w-2xl">
            {selectedSession && (
              <>
                <DialogHeader className="shrink-0 border-b border-[#F0E0A8] bg-white px-5 py-5 pr-12 dark:border-[#5C4413]/40 dark:bg-[#221C0D]">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={cn(
                        "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                        selectedSession.status === "completed"
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          : "bg-[#FFF1BC] text-[#6B5200] dark:bg-[#3A2B00] dark:text-[#FECA43]",
                      )}
                    >
                      {statusLabel(selectedSession.status)}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#946200] dark:text-[#C4A85A]">
                      <Sparkles className="size-3" />
                      {selectedSession.topic}
                    </span>
                  </div>
                  <DialogTitle className="mt-2 text-lg font-black leading-snug tracking-tight text-[#3D2E0A] break-keep dark:text-[#F0E0C4]">
                    {selectedSession.title}
                  </DialogTitle>
                  <DialogDescription className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#8A6A28] dark:text-[#C4A85A]">
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" />
                      {formatDateTime(selectedSession.updatedAt)}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MessageCircle className="size-3.5" />
                      {selectedSession.messageCount}개 메시지
                    </span>
                  </DialogDescription>
                </DialogHeader>

                <SessionDetail session={selectedSession} />
              </>
            )}
          </DialogContent>
        </Dialog>
      </section>
    </div>
  );
}
