"use client";

import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import {
  CheckCircle2,
  Clock3,
  Cpu,
  Database,
  FileText,
  FolderOpen,
  MessageCircle,
  RotateCcw,
  Search,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { mockMaterials, mockMaterialSources } from "@/data/mockMaterials";
import { cn } from "@/lib/utils";
import type {
  LearningMaterial,
  LearningMaterialIndexingStatus,
  LearningMaterialKind,
  LearningMaterialSource,
  LearningMaterialStatus,
} from "@/types/material";

const ACCEPTED_FILE_TYPES =
  ".pdf,.txt,.md,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.csv,.json";

const sourceLabels: Record<LearningMaterialSource, string> = {
  chat: "대화 첨부",
  direct: "직접 추가",
  iot: "IoT 이벤트",
};

const sourceIcons = {
  chat: MessageCircle,
  direct: UploadCloud,
  iot: Cpu,
} satisfies Record<LearningMaterialSource, typeof MessageCircle>;

const statusLabels: Record<LearningMaterialStatus, string> = {
  available: "보관 중",
  queued: "등록 대기",
  review_required: "검토 필요",
};

const statusStyles: Record<LearningMaterialStatus, string> = {
  available:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  queued:
    "bg-[#FFF1BC] text-[#6B5200] dark:bg-amber-900/40 dark:text-amber-300",
  review_required:
    "bg-[#FFF1BC] text-[#6B5200] dark:bg-amber-900/40 dark:text-amber-300",
};

const indexingLabels: Record<LearningMaterialIndexingStatus, string> = {
  excluded: "RAG 제외",
  failed: "색인 실패",
  indexed: "색인 완료",
  pending: "색인 대기",
};

const indexingStyles: Record<LearningMaterialIndexingStatus, string> = {
  excluded:
    "bg-amber-50/60 text-[#c4ad88] dark:bg-white/[0.03] dark:text-amber-400/50",
  failed: "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400",
  indexed:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  pending:
    "bg-[#FFF1BC] text-[#6B5200] dark:bg-amber-900/40 dark:text-amber-300",
};

const kindLabels: Record<LearningMaterialKind, string> = {
  document: "문서",
  image: "이미지",
  note: "노트",
  pdf: "PDF",
  slide: "슬라이드",
};

function getMaterialKind(fileName: string): LearningMaterialKind {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (extension === "pdf") return "pdf";
  if (extension === "png" || extension === "jpg" || extension === "jpeg")
    return "image";
  if (extension === "ppt" || extension === "pptx") return "slide";
  if (extension === "txt" || extension === "md") return "note";
  return "document";
}

function getTitleFromFileName(fileName: string) {
  return fileName.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
}

function formatFileSize(size: number) {
  if (size >= 1024 * 1024) return `${(size / 1024 / 1024).toFixed(1)} MB`;
  return `${Math.max(Math.round(size / 1024), 1)} KB`;
}

function formatDate(value?: string) {
  if (!value) return "연결 전";
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

function createDirectMaterial(file: File): LearningMaterial {
  return {
    id: `direct-${file.lastModified}-${file.name}`,
    title: getTitleFromFileName(file.name),
    fileName: file.name,
    fileSize: file.size,
    kind: getMaterialKind(file.name),
    status: "queued",
    source: "direct",
    ragEnabled: false,
    indexingStatus: "excluded",
    uploadedAt: new Date().toISOString(),
  };
}

export function MaterialLibraryMock() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [materials, setMaterials] = useState<LearningMaterial[]>(mockMaterials);
  const [isDragging, setIsDragging] = useState(false);

  const queuedCount = useMemo(
    () => materials.filter((m) => m.status === "queued").length,
    [materials],
  );
  const ragEnabledCount = useMemo(
    () => materials.filter((m) => m.ragEnabled).length,
    [materials],
  );
  const excludedCount = materials.length - ragEnabledCount;

  function addFiles(files: FileList | File[]) {
    const nextMaterials = Array.from(files).map(createDirectMaterial);
    if (nextMaterials.length === 0) return;
    setMaterials((cur) => [
      ...nextMaterials,
      ...cur.filter((m) => !nextMaterials.some((n) => n.id === m.id)),
    ]);
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    if (event.target.files) addFiles(event.target.files);
    event.target.value = "";
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    addFiles(event.dataTransfer.files);
  }

  function registerQueuedMaterials() {
    setMaterials((cur) =>
      cur.map((m) =>
        m.status === "queued"
          ? {
              ...m,
              status: "available",
              indexingStatus: m.ragEnabled ? "pending" : "excluded",
            }
          : m,
      ),
    );
  }

  function removeMaterial(id: string) {
    setMaterials((cur) => cur.filter((m) => m.id !== id));
  }

  function resetMaterials() {
    setMaterials(mockMaterials);
  }

  function toggleRagTarget(id: string, ragEnabled: boolean) {
    setMaterials((cur) =>
      cur.map((m) =>
        m.id === id
          ? {
              ...m,
              ragEnabled,
              indexingStatus: ragEnabled
                ? m.status === "available"
                  ? "pending"
                  : "excluded"
                : "excluded",
            }
          : m,
      ),
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-amber-100/80 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.03)] dark:border-white/8 dark:bg-[#1E1B16] lg:col-span-2">
      {/* 헤더 */}
      <div className="flex items-center justify-between border-b border-amber-100/80 px-5 py-3.5 dark:border-white/8">
        <div className="flex items-center gap-1.5">
          <FolderOpen className="size-3.5 text-amber-500" strokeWidth={1.8} />
          <h2 className="text-xs font-bold tracking-widest text-amber-700 uppercase dark:text-amber-400">
            자료 보관함
          </h2>
        </div>
        <span className="rounded-full bg-[#FFF1BC] px-2.5 py-0.5 text-[11px] font-bold text-[#6B5200] dark:bg-amber-900/40 dark:text-amber-300">
          RAG 대상 선별
        </span>
      </div>

      <div className="p-5">
        {/* 통계 스트립 */}
        <div className="grid grid-cols-3 divide-x divide-amber-100/80 overflow-hidden rounded-xl border border-amber-100/80 dark:divide-white/8 dark:border-white/8">
          {[
            {
              icon: Database,
              label: "전체 자료",
              value: materials.length,
              color: "text-amber-500",
            },
            {
              icon: Search,
              label: "RAG 대상",
              value: ragEnabledCount,
              color: "text-emerald-500",
            },
            {
              icon: Clock3,
              label: "RAG 제외",
              value: excludedCount,
              color: "text-[#B88700]",
            },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center bg-amber-50/40 py-4 dark:bg-white/[0.02]"
            >
              <Icon className={cn("size-4 mb-1.5", color)} strokeWidth={1.8} />
              <p className="text-xl font-black tabular-nums tracking-tight text-gray-950 dark:text-white">
                {value}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold text-[#c4ad88] dark:text-amber-400/50">
                {label}
              </p>
            </div>
          ))}
        </div>

        {/* 소스 카드 + 업로드 */}
        <div className="mt-4 grid gap-4 xl:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="grid gap-3 lg:grid-cols-3">
            {mockMaterialSources.map((source) => {
              const Icon = sourceIcons[source.id];
              const count = materials.filter(
                (m) => m.source === source.id,
              ).length;
              return (
                <article
                  key={source.id}
                  className="flex flex-col rounded-xl border border-amber-100/80 bg-amber-50/40 p-4 dark:border-white/8 dark:bg-white/[0.02]"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-white ring-1 ring-amber-100 dark:bg-white/5 dark:ring-white/10">
                      <Icon
                        className="size-4 text-amber-500"
                        strokeWidth={1.8}
                      />
                    </div>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                      {count}개
                    </span>
                  </div>
                  <h3 className="mt-3 text-sm font-bold text-gray-950 dark:text-white">
                    {source.title}
                  </h3>
                  <p className="mt-1.5 flex-1 text-xs leading-relaxed text-gray-500 break-keep dark:text-gray-400">
                    {source.description}
                  </p>
                  <p className="mt-3 rounded-lg bg-white px-3 py-2 text-[11px] leading-relaxed text-gray-600 break-keep dark:bg-white/5 dark:text-gray-400">
                    {source.policy}
                  </p>
                  <p className="mt-2 text-[11px] text-[#c4ad88] dark:text-amber-400/50">
                    최근 동기화 {formatDate(source.lastSyncedAt)}
                  </p>
                </article>
              );
            })}
          </div>

          {/* 드래그 업로드 */}
          <div
            className={cn(
              "flex flex-col rounded-xl border border-dashed border-amber-200/80 bg-amber-50/30 p-4 transition-colors dark:border-white/10 dark:bg-white/[0.02]",
              isDragging &&
                "border-amber-400 bg-amber-50 dark:border-amber-500 dark:bg-amber-900/10",
            )}
            onDragEnter={() => setIsDragging(true)}
            onDragLeave={() => setIsDragging(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              accept={ACCEPTED_FILE_TYPES}
              className="sr-only"
              multiple
              onChange={handleFileChange}
              type="file"
            />
            <div className="flex size-9 items-center justify-center rounded-lg bg-white ring-1 ring-amber-100 dark:bg-white/5 dark:ring-white/10">
              <UploadCloud
                className="size-4 text-amber-500"
                strokeWidth={1.8}
              />
            </div>
            <h3 className="mt-3 text-sm font-bold text-gray-950 dark:text-white">
              직접 자료 추가
            </h3>
            <p className="mt-1.5 text-xs leading-relaxed text-gray-500 break-keep dark:text-gray-400">
              보관함에서 관리할 장기 자료만 추가합니다.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                type="button"
                className="flex min-h-9 w-full items-center justify-center gap-1.5 rounded-xl bg-[#2E2A22] px-4 text-xs font-bold text-white transition-colors hover:bg-[#1a1814] dark:bg-[#FECA43] dark:text-[#2E2A22] dark:hover:bg-[#F5B522]"
              >
                <UploadCloud className="size-3.5" />
                파일 선택
              </button>
              <button
                disabled={queuedCount === 0}
                onClick={registerQueuedMaterials}
                type="button"
                className="flex min-h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-amber-200/80 bg-white px-4 text-xs font-semibold text-gray-700 transition-colors hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-40 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
              >
                <CheckCircle2 className="size-3.5" />
                보관함 등록
              </button>
              <button
                onClick={resetMaterials}
                type="button"
                className="flex min-h-9 w-full items-center justify-center gap-1.5 rounded-xl border border-amber-200/80 bg-white px-4 text-xs font-semibold text-gray-700 transition-colors hover:bg-amber-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-300 dark:hover:bg-white/10"
              >
                <RotateCcw className="size-3.5" />
                mock 초기화
              </button>
            </div>
          </div>
        </div>

        {/* 자료 목록 */}
        <div className="mt-4 overflow-hidden rounded-xl border border-amber-100/80 dark:border-white/8">
          {materials.map((material, i) => (
            <article
              key={material.id}
              className={cn(
                "grid min-w-0 gap-4 bg-white px-4 py-3.5 transition-colors dark:bg-[#1E1B16] lg:grid-cols-[minmax(0,1fr)_13rem_2.5rem] lg:items-center",
                i !== 0 && "border-t border-amber-50 dark:border-white/[0.06]",
              )}
            >
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 dark:bg-white/[0.03]">
                  <FileText
                    className="size-4 text-amber-500"
                    strokeWidth={1.8}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-col gap-1.5 sm:flex-row sm:items-center">
                    <h3 className="truncate text-sm font-bold text-gray-950 dark:text-white">
                      {material.title}
                    </h3>
                    <span
                      className={cn(
                        "shrink-0 w-fit rounded-full px-2 py-0.5 text-[11px] font-bold",
                        statusStyles[material.status],
                      )}
                    >
                      {statusLabels[material.status]}
                    </span>
                  </div>
                  <p className="mt-0.5 truncate text-[11px] text-[#c4ad88] dark:text-amber-400/50">
                    {material.fileName} · {kindLabels[material.kind]} ·{" "}
                    {formatFileSize(material.fileSize)} ·{" "}
                    {sourceLabels[material.source]}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 lg:justify-end">
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold",
                    indexingStyles[material.indexingStatus],
                  )}
                >
                  {indexingLabels[material.indexingStatus]}
                </span>
                <label
                  className="flex items-center gap-2 text-xs font-bold text-gray-600 dark:text-gray-300"
                  htmlFor={`rag-${material.id}`}
                >
                  RAG 대상
                  <Switch
                    checked={material.ragEnabled}
                    className="data-checked:bg-[#2E2A22] data-unchecked:bg-amber-100 dark:data-checked:bg-[#FECA43] dark:data-unchecked:bg-white/10"
                    id={`rag-${material.id}`}
                    onCheckedChange={(checked) =>
                      toggleRagTarget(material.id, checked)
                    }
                  />
                </label>
              </div>

              <button
                aria-label={`${material.title} 삭제`}
                className="flex size-9 shrink-0 items-center justify-center rounded-lg text-[#c4ad88] transition-colors hover:bg-amber-50 hover:text-gray-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 dark:hover:bg-white/5 dark:hover:text-white"
                onClick={() => removeMaterial(material.id)}
                type="button"
              >
                <Trash2 className="size-4" />
              </button>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
