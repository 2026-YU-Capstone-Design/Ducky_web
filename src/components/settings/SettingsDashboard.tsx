"use client";

import { useEffect, useState } from "react";
import { Bell, Moon, Upload, UserRound } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { mockUser } from "@/data/mockUser";
import type { LearningLevel } from "@/types/user";

const levelLabels: Record<LearningLevel, string> = {
  advanced: "advanced",
  beginner: "beginner",
  intermediate: "intermediate",
};

function ProfileRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#E7DDC8] py-3 last:border-b-0 last:pb-0">
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-bold text-gray-950">
        {value}
      </dd>
    </div>
  );
}

function SectionTitle({
  children,
  icon: Icon,
}: {
  children: string;
  icon: typeof UserRound;
}) {
  return (
    <div className="flex items-center gap-2">
      <Icon className="size-5 text-[#B88700]" aria-hidden="true" />
      <h2 className="text-lg font-bold tracking-tight text-gray-950">
        {children}
      </h2>
    </div>
  );
}

export function SettingsDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [studyReminder, setStudyReminder] = useState(true);
  const [fileName, setFileName] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <section className="mx-auto flex w-full max-w-[944px] flex-1 flex-col px-5 py-9 sm:px-8 lg:px-0">
      <div className="border-b border-[#E7DDC8] pb-7">
        <p className="text-sm font-semibold text-[#B88700]">설정</p>
        <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-gray-950 break-keep sm:text-4xl">
          학습 환경을 조정합니다
        </h1>
        <p className="mt-4 text-base leading-relaxed text-gray-600 break-keep">
          현재는 프로토타입용 mock 설정입니다. 실제 저장은 이후 백엔드 연결
          단계에서 처리합니다.
        </p>
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Card className="min-h-[196px] rounded-lg border border-[#E7DDC8] bg-white py-0 shadow-sm">
          <CardContent className="p-5">
            <SectionTitle icon={UserRound}>프로필</SectionTitle>

            <dl className="mt-4">
              <ProfileRow label="이름" value={mockUser.name} />
              <ProfileRow label="이메일" value={mockUser.email} />
              <ProfileRow label="레벨" value={levelLabels[mockUser.level]} />
            </dl>
          </CardContent>
        </Card>

        <Card className="min-h-[196px] rounded-lg border border-[#E7DDC8] bg-white py-0 shadow-sm">
          <CardContent className="p-5">
            <SectionTitle icon={Moon}>화면 설정</SectionTitle>

            <div className="mt-5 flex items-center justify-between gap-6">
              <div className="min-w-0">
                <label
                  className="text-sm font-bold text-gray-950"
                  htmlFor="settings-dark-mode"
                >
                  다크 모드
                </label>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 break-keep">
                  장시간 학습 시 눈부심을 줄이는 설정입니다.
                </p>
              </div>
              <Switch
                checked={darkMode}
                className="data-checked:bg-[#FECA43] data-unchecked:bg-[#E3E7ED]"
                id="settings-dark-mode"
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[200px] rounded-lg border border-[#E7DDC8] bg-white py-0 shadow-sm">
          <CardContent className="p-5">
            <SectionTitle icon={Bell}>알림</SectionTitle>

            <div className="mt-5 flex items-center justify-between gap-6">
              <div className="min-w-0">
                <label
                  className="text-sm font-bold text-gray-950"
                  htmlFor="settings-study-reminder"
                >
                  학습 리마인더
                </label>
                <p className="mt-2 text-sm leading-relaxed text-gray-500 break-keep">
                  매일 한 번 이어서 학습할 시간을 알려줍니다.
                </p>
              </div>
              <Switch
                checked={studyReminder}
                className="data-checked:bg-[#FECA43] data-unchecked:bg-[#E3E7ED]"
                id="settings-study-reminder"
                onCheckedChange={setStudyReminder}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="min-h-[200px] rounded-lg border border-[#E7DDC8] bg-white py-0 shadow-sm">
          <CardContent className="p-5">
            <SectionTitle icon={Upload}>자료 업로드</SectionTitle>

            <label
              className="mt-5 flex min-h-28 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#D6BE91] bg-[#FAF8F5] px-4 text-center transition-colors hover:bg-[#FFF7E0] focus-within:ring-3 focus-within:ring-[#FECA43]/50"
              htmlFor="settings-file"
            >
              <Upload className="size-6 text-[#B88700]" aria-hidden="true" />
              <span className="mt-2 text-sm font-bold text-gray-950">
                파일 선택
              </span>
              <span className="mt-2 max-w-full truncate text-xs text-gray-500">
                {fileName || "실제 업로드 없이 파일명만 표시합니다."}
              </span>
              <input
                className="sr-only"
                id="settings-file"
                onChange={(event) =>
                  setFileName(event.currentTarget.files?.[0]?.name ?? "")
                }
                type="file"
              />
            </label>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
