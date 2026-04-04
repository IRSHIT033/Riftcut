import { ImageResponse } from "next/og";

export const alt = "Riftcut — Free Private File Toolkit";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          background: "#FFFDF7",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            background: "#FFDE59",
            borderBottom: "3px solid #1a1a1a",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            background: "#A7F205",
            border: "3px solid #1a1a1a",
            boxShadow: "4px 4px 0px #1a1a1a",
            padding: "8px 20px",
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 32,
            transform: "rotate(-2deg)",
          }}
        >
          FREE & 100% PRIVATE
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            color: "#1a1a1a",
            lineHeight: 1.1,
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <span>Your All-In-One</span>
          <div
            style={{
              display: "flex",
              background: "#FFDE59",
              border: "3px solid #1a1a1a",
              padding: "4px 16px",
              marginTop: 8,
              transform: "rotate(1deg)",
            }}
          >
            File Toolkit
          </div>
        </div>

        {/* Tools row */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 40,
          }}
        >
          {[
            { label: "BG Remover", color: "#FF6B6B" },
            { label: "Converter", color: "#FFDE59" },
            { label: "Merge PDF", color: "#4CC9F0" },
            { label: "Images to PDF", color: "#A7F205" },
          ].map((tool) => (
            <div
              key={tool.label}
              style={{
                display: "flex",
                background: tool.color,
                border: "3px solid #1a1a1a",
                boxShadow: "3px 3px 0px #1a1a1a",
                padding: "10px 20px",
                fontSize: 18,
                fontWeight: 700,
                borderRadius: 8,
              }}
            >
              {tool.label}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            fontSize: 20,
            fontWeight: 700,
            color: "#1a1a1a",
            opacity: 0.4,
          }}
        >
          riftcut.app
        </div>
      </div>
    ),
    { ...size }
  );
}
