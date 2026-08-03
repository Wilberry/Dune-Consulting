"use client";
import Link from "next/link";
export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            fontFamily: "system-ui",
            color: "#172033",
          }}
        >
          <div style={{ maxWidth: 560, textAlign: "center" }}>
            <p style={{ color: "#D99C00", fontWeight: 800 }}>DUNE CONSULTING</p>
            <h1>We could not load the website.</h1>
            <p>Please try again. No technical details have been exposed.</p>
            <button
              onClick={reset}
              style={{
                border: 0,
                borderRadius: 6,
                background: "#F5B400",
                padding: "12px 20px",
                fontWeight: 700,
              }}
            >
              Try again
            </button>
            <p>
              <Link href="/">Return to homepage</Link>
            </p>
          </div>
        </main>
      </body>
    </html>
  );
}
