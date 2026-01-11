import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: "50%",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: "45%",
            background: "#ef4444",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "45%",
            left: 0,
            right: 0,
            height: "10%",
            background: "#1f2937",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "45%",
            background: "#ffffff",
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "#ffffff",
            border: "2px solid #1f2937",
            zIndex: 10,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#ffffff",
            border: "1px solid #1f2937",
            zIndex: 11,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
