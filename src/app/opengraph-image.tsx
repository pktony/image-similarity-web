import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "포켓몬 닮은꼴 찾기 - 나와 닮은 포켓몬을 찾아보세요!";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background - Pokeball inspired gradient */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(180deg, #ef4444 0%, #ef4444 45%, #1f2937 45%, #1f2937 55%, #f8fafc 55%, #f8fafc 100%)",
          }}
        />

        {/* Center pokeball button */}
        <div
          style={{
            position: "absolute",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: "white",
            border: "8px solid #1f2937",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
          }}
        >
          <div
            style={{
              width: 50,
              height: 50,
              borderRadius: "50%",
              background: "white",
              border: "6px solid #1f2937",
            }}
          />
        </div>

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            zIndex: 10,
            marginTop: 200,
          }}
        >
          {/* Title */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <span style={{ fontSize: 72 }}>⚡</span>
            <h1
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: "#1f2937",
                margin: 0,
                textShadow: "2px 2px 0 white",
              }}
            >
              포켓몬 닮은꼴 찾기
            </h1>
          </div>

          {/* Subtitle */}
          <p
            style={{
              fontSize: 32,
              color: "#4b5563",
              margin: 0,
              fontWeight: 600,
            }}
          >
            사진을 업로드하면 AI가 닮은 포켓몬을 찾아드립니다!
          </p>

          {/* URL */}
          <p
            style={{
              fontSize: 24,
              color: "#9ca3af",
              marginTop: 24,
              fontWeight: 500,
            }}
          >
            image-similarity-web.vercel.app
          </p>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
