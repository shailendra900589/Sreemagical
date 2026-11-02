import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Sri Magicale — Education & Youth Empowerment by SM Groups";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #001a40 0%, #002b5c 55%, #001530 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 999,
              background: "linear-gradient(135deg, #d4af37, #f0d878)",
              color: "#001a40",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 32,
              fontWeight: 700,
            }}
          >
            M
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 28, fontWeight: 700 }}>Sri Magicale</div>
            <div style={{ fontSize: 18, color: "rgba(255,255,255,0.7)" }}>Powered by SM Groups</div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ fontSize: 54, fontWeight: 700, lineHeight: 1.15, maxWidth: 920 }}>
            Education & Youth Empowerment
          </div>
          <div style={{ fontSize: 26, color: "rgba(255,255,255,0.78)", maxWidth: 880, lineHeight: 1.4 }}>
            Classes 8–12 · Competitive prep · Trading skills · Transparent BP compensation
          </div>
        </div>

        <div
          style={{
            display: "flex",
            gap: 12,
            fontSize: 18,
            color: "#001a40",
          }}
        >
          {["Edu ₹5,000", "BP ₹10,000", "LMS + Live charts"].map((label) => (
            <div
              key={label}
              style={{
                background: "#d4af37",
                borderRadius: 999,
                padding: "10px 18px",
                fontWeight: 700,
              }}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size },
  );
}
