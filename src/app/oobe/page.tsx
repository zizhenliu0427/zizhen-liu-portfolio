import type { Metadata } from "next";
import AeroBackground from "@/components/AeroBackground";
import GlassFilter from "@/components/GlassFilter";
import OobeWizard from "@/components/OobeWizard";

export const metadata: Metadata = {
  title: "Zizhen Liu — Welcome",
  description:
    "Frontend engineer portfolio, presented as a Windows Aero setup wizard.",
};

export default function OobePage() {
  return (
    <>
      <GlassFilter />
      <AeroBackground wallpaper="aurora" />
      <OobeWizard />
    </>
  );
}
