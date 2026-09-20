import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Answer Rush | MYLE Study Game",
  description:
    "Looking for something fun to do today? Study while you play with Answer Rush By MYLE Study Game. Run through the gate with the right answer.",
};

export default function AnswerRushPage() {
  return (
    <main style={{ position: "fixed", inset: 0, background: "#0d0a24" }}>
      <iframe
        src="/answer-rush.html"
        title="Answer Rush - MYLE Study Game"
        allow="autoplay; fullscreen"
        style={{ display: "block", width: "100%", height: "100%", border: 0 }}
      />
    </main>
  );
}
