import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FFDE59",
          borderRadius: 6,
          border: "2px solid #1a1a1a",
          fontFamily: "sans-serif",
        }}
      >
        <span
          style={{
            fontSize: 22,
            fontWeight: 900,
            color: "#1a1a1a",
            lineHeight: 1,
          }}
        >
          R
        </span>
      </div>
    ),
    { ...size }
  );
}
