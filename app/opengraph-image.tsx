import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BeforeYouSign — AI Contract Intelligence";
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
          backgroundColor: "#1c1917",
          padding: "60px 80px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Top badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            marginBottom: "auto",
          }}
        >
          <div
            style={{
              border: "1px solid #57534e",
              color: "#a8a29e",
              fontSize: 13,
              letterSpacing: "0.15em",
              padding: "6px 14px",
              textTransform: "uppercase",
            }}
          >
            Legal Intelligence Platform
          </div>
        </div>

        {/* Main headline */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 72,
              fontWeight: 800,
              color: "#fafaf9",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
            }}
          >
            BeforeYouSign
          </div>

          <div
            style={{
              borderLeft: "4px solid #fafaf9",
              paddingLeft: 24,
              marginBottom: 12,
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 300,
                color: "#a8a29e",
                lineHeight: 1.4,
                maxWidth: 700,
              }}
            >
              Upload any contract. Get instant AI analysis of risks, hidden
              clauses, and obligations in under 30 seconds.
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: "flex", gap: 48, marginTop: 8 }}>
            {[
              { value: "10,000+", label: "Contracts Analyzed" },
              { value: "Free", label: "No Account Needed" },
              { value: "<30s", label: "Analysis Time" },
            ].map(({ value, label }) => (
              <div
                key={label}
                style={{ display: "flex", flexDirection: "column", gap: 4 }}
              >
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 700,
                    color: "#fafaf9",
                  }}
                >
                  {value}
                </div>
                <div style={{ fontSize: 14, color: "#78716c" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 48,
            paddingTop: 32,
            borderTop: "1px solid #292524",
          }}
        >
          <div style={{ fontSize: 18, color: "#57534e", fontWeight: 500 }}>
            beforeyousign.vercel.app
          </div>
          <div
            style={{
              backgroundColor: "#fafaf9",
              color: "#1c1917",
              padding: "12px 28px",
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: "0.02em",
            }}
          >
            Analyze Free →
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
