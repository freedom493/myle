import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'FlashCards and Quiz Builder | MYLE',
  description: 'Create Flashcards and Quizzes from your materials to study smarter and Faster',
  openGraph: {
    title: 'MYLE | Flashcards and Quiz builder',
    description: 'Create Flashcards and Quizzes from your material and also allow other to access it via community study tools',
    url: 'https://myle247.vercel.app/create'
  }
}

export default function CreateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
