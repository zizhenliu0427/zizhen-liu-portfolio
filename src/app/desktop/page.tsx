import "7.css/dist/7.scoped.css";
import type { Metadata } from "next";
import Win7Desktop from "@/components/Win7Desktop";

export const metadata: Metadata = {
  title: "Zizhen Liu — Desktop",
  description: "Portfolio as a Windows 7 desktop.",
};

export default function DesktopPage() {
  return <Win7Desktop />;
}
