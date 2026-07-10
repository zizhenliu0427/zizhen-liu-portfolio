import "7.css/dist/7.scoped.css";
import type { Metadata } from "next";
import Win7Desktop from "@/components/Win7Desktop";

export const metadata: Metadata = {
  title: "Zizhen Liu — Aero Lab",
  description:
    "A hand-built Frutiger Aero, Y2K-era desktop lab. Windows 7 is the first build; XP and 98 are next.",
};

export default function DesktopPage() {
  return <Win7Desktop />;
}
