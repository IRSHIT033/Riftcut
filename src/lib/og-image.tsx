import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

export function generateToolOgImage({
  title,
  description,
  color,
  tag,
}: {
  title: string;
  description: string;
  color: string;
  tag: string;
}) {
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
            background: color,
            borderBottom: "3px solid #1a1a1a",
          }}
        />

        {/* Tag */}
        <div
          style={{
            display: "flex",
            background: color,
            border: "3px solid #1a1a1a",
            boxShadow: "4px 4px 0px #1a1a1a",
            padding: "8px 20px",
            fontSize: 18,
            fontWeight: 700,
            marginBottom: 32,
            transform: "rotate(-2deg)",
          }}
        >
          {tag}
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            color: "#1a1a1a",
            lineHeight: 1.1,
            textAlign: "center",
            maxWidth: 900,
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: 24,
            fontWeight: 500,
            color: "#1a1a1a",
            opacity: 0.6,
            textAlign: "center",
            maxWidth: 700,
            marginTop: 20,
            lineHeight: 1.4,
          }}
        >
          {description}
        </div>

        {/* Bottom */}
        <div
          style={{
            position: "absolute",
            bottom: 24,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#1a1a1a",
            }}
          >
            Riftcut
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: 500,
              color: "#1a1a1a",
              opacity: 0.4,
            }}
          >
            Free & Private
          </div>
        </div>
      </div>
    ),
    { ...ogSize }
  );
}
