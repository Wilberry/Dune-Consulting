import { ImageResponse } from "next/og";
export const alt =
  "Dune Consulting — Protecting People. Protecting Your Business.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100%",
        background: "#08172B",
        color: "white",
        padding: 72,
        position: "relative",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.05) 1px,transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          position: "relative",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 54,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#F5B400",
              color: "#10233F",
              fontWeight: 900,
              fontSize: 30,
              clipPath: "polygon(50% 0,100% 15%,100% 65%,50% 100%,0 65%,0 15%)",
            }}
          >
            D
          </div>
          <span style={{ fontSize: 30, fontWeight: 800 }}>DUNE CONSULTING</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              color: "#F5B400",
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            Health · Safety · Environment
          </div>
          <div
            style={{
              marginTop: 20,
              maxWidth: 960,
              fontSize: 66,
              lineHeight: 1.08,
              fontWeight: 800,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Protecting People.</span>
            <span>Protecting Your Business.</span>
          </div>
        </div>
      </div>
    </div>,
    size,
  );
}
