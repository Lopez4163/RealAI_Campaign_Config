import { ImageResponse } from "@vercel/og";

interface ProductInfographicProps {
  industry_header: string;
  items: string[];
}

export default function RealAiProductInfographic({
  industry_header = "EDU",
  items = ["Desk Mat", "Laptop Cooling Fan", "Hoodie", "Planner", "Book Bag"],
}: ProductInfographicProps) {
  const colors = {
    bg: "#1ea0f2",
    yellow: "#fef200",
    dark: "#232323",
    white: "#ffffff",
  };

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: colors.bg,
        fontFamily: '"Inter", sans-serif',
        // ↓ reduced a bit so it fits a taller page cleanly
        padding: "48px 48px",
        color: colors.white,
        position: "relative",
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          width: "100%",
          flexDirection: "column",
          marginBottom: "16px",
        }}
      >
        <h2
          style={{
            fontSize: "30px", // ↓ tiny reduction
            margin: 0,
            fontWeight: 700,
            textTransform: "uppercase",
            color: colors.yellow,
            lineHeight: 1.1,
          }}
        >
          REAL.AI PRODUCT RESULTS:{" "}
          <span style={{ color: colors.white }}>{industry_header}</span>
        </h2>
        <div
          style={{
            width: "420px", // ↓ tiny reduction
            height: "3px",
            backgroundColor: "#89cff9",
            marginTop: "10px",
          }}
        />
      </div>

      {/* CONTENT */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          width: "100%",
          flexGrow: 1,
          justifyContent: "center",
          gap: "18px", // ↓ helps spacing on paper
        }}
      >
        <div
          style={{
            width: 380, // ↓ slightly smaller
            height: 270, // ↓ slightly smaller
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 24,
            backgroundColor: "rgba(255,255,255,0.15)",
          }}
        >
          <span style={{ fontSize: 48 }}>📦</span>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            width: "86%", // ↑ a touch wider to use page better
          }}
        >
          <h3
            style={{
              fontSize: "26px", // ↓ tiny reduction
              fontWeight: 900,
              color: colors.yellow,
              textTransform: "uppercase",
              marginBottom: "16px",
              marginTop: 0,
            }}
          >
            GESTURE GIFT BOX CONTENTS:
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {items.map((item, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    backgroundColor: colors.white,
                    flex: "0 0 auto",
                  }}
                />
                <span
                  style={{
                    fontSize: "22px", // ↓ tiny reduction
                    fontWeight: 600,
                    textTransform: "uppercase",
                    lineHeight: 1.2,
                  }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "12px",
          marginTop: "24px", // ↓ reduced
          textAlign: "center",
          width: "100%",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontSize: "24px", fontWeight: 500, opacity: 0.9 }}>
            WANT TO MEET OR EXCEED THESE NUMBERS?
          </span>
          <span style={{ fontSize: "26px", fontWeight: 800, color: colors.yellow }}>
            BOOK A CALL TO ENRICH YOUR CAMPAIGN WITH GESTURE’S REAL.AI
          </span>
        </div>

        <div
          style={{
            backgroundColor: colors.dark,
            color: colors.white,
            padding: "18px 52px", // ↓ slightly smaller
            borderRadius: "50px",
            fontSize: "32px", // ↓ slightly smaller
            fontWeight: 700,
            marginTop: "12px",
            display: "flex",
          }}
        >
          Book a call
        </div>
      </div>

      {/* LOGO */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          left: 40,
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ fontSize: "40px", fontWeight: 900 }}>G</div>
        <div style={{ fontSize: "12px" }}>Gesture</div>
      </div>

      <div
        style={{
          position: "absolute",
          bottom: 26,
          right: 40,
          fontSize: "25px",
          opacity: 0.8,
        }}
      >
        © 2025 Gesture. All rights reserved.
      </div>
    </div>
  );
}
