import { ImageResponse } from "next/og";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";
export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 36,
        background: "#08172B",
      }}
    >
      <div
        style={{
          width: 112,
          height: 128,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F5B400",
          color: "#10233F",
          fontFamily: "Arial",
          fontWeight: 900,
          fontSize: 68,
          clipPath: "polygon(50% 0,100% 15%,100% 65%,50% 100%,0 65%,0 15%)",
        }}
      >
        D
      </div>
    </div>,
    size,
  );
}
