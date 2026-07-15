"use client";

export default function StudyPage() {
  const generateStudyNotes = async () => {
    const res = await fetch('/api/generate', {
      method: 'POST',
      body: JSON.stringify({ prompt: "Explain the concept of 'Consideration' in Contract Law briefly." }),
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await res.json();
    console.log(data.result);
  };

  return <button onClick={generateStudyNotes}>Generate Notes</button>;
}