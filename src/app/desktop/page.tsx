import "7.css/dist/7.scoped.css";
import type { Metadata } from "next";
import Win7Window from "@/components/Win7Window";

export const metadata: Metadata = { title: "Win7 Desktop — test" };

export default function DesktopPage() {
  return (
    <div
      className="win7"
      style={{
        position: "relative",
        height: "100dvh",
        overflow: "hidden",
        backgroundImage: "url('/bg-hill1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Win7Window title="About — Zizhen Liu" initialX={60} initialY={60} width={400}>
        <p>
          Drag me by the title bar. Double-click the title bar (or the maximize
          button) to maximize; close hides the window.
        </p>
        <p style={{ marginTop: 12 }}>
          <button>OK</button> <button className="default">Next</button>{" "}
          <button disabled>Disabled</button>
        </p>
      </Win7Window>

      <Win7Window title="Projects" initialX={520} initialY={150} width={360}>
        <p>A second window — click either window to bring it to the front.</p>
        <ul className="tree-view" style={{ marginTop: 8 }}>
          <li>Conversational-AI Sensor Analytics</li>
          <li>CMO-DB — Weapon Database</li>
          <li>CTV — Violence Detection</li>
        </ul>
      </Win7Window>
    </div>
  );
}
