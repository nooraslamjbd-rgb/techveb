import { ImageResponse } from "next/og";

export const runtime = "nodejs";

export async function GET() {
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
          background: "linear-gradient(135deg, #0A0F1C 0%, #0D1B3E 50%, #0A0F1C 100%)",
          color: "white",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: "absolute",
            top: "-50%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "800px",
            height: "800px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(0,96,224,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Grid pattern */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        {/* Logo circle */}
        <div
          style={{
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #0060E0 0%, #00D4FF 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "30px",
            boxShadow: "0 0 60px rgba(0,96,224,0.4)",
          }}
        >
          <span
            style={{
              fontSize: "48px",
              fontWeight: "900",
              color: "white",
              fontFamily: "sans-serif",
            }}
          >
            T
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: "64px",
            fontWeight: "800",
            letterSpacing: "-2px",
            marginBottom: "12px",
            background: "linear-gradient(to right, #FFFFFF 0%, #B0C4DE 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
        >
          TechVeb
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: "28px",
            color: "#6B8DB2",
            fontWeight: "400",
            letterSpacing: "2px",
            textTransform: "uppercase",
          }}
        >
          AI & Technology Blog
        </div>

        {/* Accent line */}
        <div
          style={{
            width: "80px",
            height: "4px",
            borderRadius: "2px",
            background: "linear-gradient(to right, #0060E0, #00D4FF)",
            marginTop: "24px",
          }}
        />

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: "40px",
            fontSize: "22px",
            color: "#4A6B8A",
            letterSpacing: "1px",
          }}
        >
          techveb.com
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
