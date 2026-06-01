import Link from "next/link";

export default function DashboardPage() {
  return (
    <main className="flex min-h-dvh w-full bg-[#FAF8F5] px-5 py-10 text-[#2E2A22] sm:px-8">
      <section className="mx-auto flex w-full max-w-2xl flex-col justify-center">
        <p className="mb-3 text-2xl font-bold text-[#FECA43]">Ducky</p>

        <h1 className="text-3xl font-bold tracking-tight text-gray-950 sm:text-4xl">
          대시보드 준비 중
        </h1>

        <p className="mt-4 max-w-xl text-base leading-relaxed text-gray-600 break-keep sm:text-lg">
          로그인과 온보딩 이후의 이동 흐름을 확인하기 위한 임시 화면입니다.
        </p>

        <div className="mt-8 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
          <Link
            href="/chat"
            className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#FECA43] px-5 text-sm font-semibold text-[#2E2A22] transition-colors hover:bg-[#F5B522] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FECA43]"
          >
            학습 대화 시작
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-12 items-center justify-center rounded-lg border border-[#E7DDC8] bg-white px-5 text-sm font-semibold text-gray-700 transition-colors hover:bg-[#FFF7E0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FECA43]"
          >
            처음으로
          </Link>
        </div>
      </section>
    </main>
  );
}
