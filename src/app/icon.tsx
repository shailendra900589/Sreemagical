import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
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
          borderRadius: 999,
          background: "linear-gradient(135deg, #d4af37, #f0d878)",
          color: "#001a40",
          fontSize: 34,
          fontWeight: 700,
        }}
      >
        M
      </div>
    ),
    { ...size },
  );
}
