import { Baloo_2 } from "next/font/google";
import { cn } from "@/lib/utils";

const baloo2Bold = Baloo_2({
  subsets: ["latin"],
  weight: "700",
});

const baloo2Semibold = Baloo_2({
  subsets: ["latin"],
  weight: "600",
});

export function DuckyWordmark() {
  return (
    <>
      <span
        className={cn(
          baloo2Bold.className,
          "dark:hidden text-[24px] tracking-[-1.1px] text-[#FECA43]",
        )}
      >
        Ducky
      </span>
      <span
        className={cn(
          baloo2Semibold.className,
          "hidden dark:inline text-[24px] tracking-[-1.1px] text-[#FECA43]",
        )}
      >
        Ducky
      </span>
    </>
  );
}
