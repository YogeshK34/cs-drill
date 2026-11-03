import { ImageResponse } from "next/og";

export const alt = "CS Drill - CS Fundamentals MCQ Prep";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

const TOPICS = [
  "OS",
  "Networks",
  "DBMS",
  "OOP",
  "DSA Theory",
  "SQL Lab",
];

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#09090b",
        }}
      >
        {/* Top: app name cs/drill in large monospace font, color #58a6ff */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 76,
            fontWeight: 800,
            color: "#58a6ff",
            fontFamily: "monospace",
            letterSpacing: "-0.02em",
          }}
        >
          cs/drill
        </div>

        {/* Middle: tagline CS Fundamentals MCQ Prep in zinc-400 */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
            fontWeight: 500,
            color: "#a1a1aa",
            marginTop: 24,
          }}
        >
          CS Fundamentals MCQ Prep
        </div>

        {/* Bottom: topic pills in a row — OS · Networks · DBMS · OOP · DSA Theory · SQL Lab in zinc-600 */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            gap: 14,
            marginTop: 52,
          }}
        >
          {TOPICS.map((topic) => (
            <div
              key={topic}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingTop: 10,
                paddingBottom: 10,
                paddingLeft: 22,
                paddingRight: 22,
                borderRadius: 9999,
                backgroundColor: "#18181b",
                color: "#52525b",
                fontSize: 20,
                fontWeight: 600,
                fontFamily: "monospace",
              }}
            >
              {topic}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
