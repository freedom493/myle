'use client';

import { useState } from "react";
import { RotateCw } from "lucide-react";
import nigeria_legal_system from '@/content/flashcards/nigerian-legal-system.json';
import legal_methods from '@/content/flashcards/legal-methods.json';

interface FlashcardsComponentProps {
    deckId: string
}

export default function FlashcardsComponent({ deckId } : FlashcardsComponentProps) {
    const flashcards = [
        legal_methods, 
        nigeria_legal_system 
    ];

    const findFlashcardId = () => {
        return flashcards[0].id === deckId ? flashcards[0] : flashcards[1]
    }

    const sampleFlashcards = findFlashcardId().cards;

    const [currentCard, setCurrentCard] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);

    const handleNext = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCard((prev) => (prev + 1) % sampleFlashcards.length);
        }, 180);
    };

    const handlePrev = () => {
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCard((prev) => (prev - 1 + sampleFlashcards.length) % sampleFlashcards.length);
        }, 180);
    };

    return (
        <>
            <div
                onClick={() => setIsFlipped(!isFlipped)}
                className={`group min-h-[220px] rounded-2xl border border-brand-indigo/10 p-6 flex flex-col justify-between cursor-pointer select-none transition-all duration-300 ${isFlipped
                    ? 'bg-brand-indigo text-white shadow-inner'
                    : 'bg-brand-surface text-brand-text hover:border-brand-lime/45 hover:shadow-md'
                    }`}
            >
                <div className="flex justify-between items-start gap-4">
                    <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md ${isFlipped ? 'bg-brand-lime text-brand-indigo' : 'bg-brand-indigo text-brand-lime'
                        }`}>
                        {findFlashcardId().name}
                    </span>
                    <span className="text-[10px] text-brand-muted font-semibold group-hover:text-brand-indigo/80">
                        {isFlipped ? "Showing Answer" : "Click to Reveal"}
                    </span>
                </div>

                <div className="my-6">
                    {isFlipped ? (
                        <p className="text-sm font-medium leading-relaxed animate-fade-in">
                            {sampleFlashcards[currentCard].definition}
                        </p>
                    ) : (
                        <p className="text-base font-bold leading-snug tracking-tight font-heading">
                            {sampleFlashcards[currentCard].term}
                        </p>
                    )}
                </div>

                <div className="flex justify-between items-center text-xs font-semibold">
                    <span className={isFlipped ? 'text-brand-lime' : 'text-brand-indigo'}>
                        Card {currentCard + 1} of {sampleFlashcards.length}
                    </span>
                    <div className="flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                        <RotateCw className="h-3.5 w-3.5 animate-spin-slow" />
                        <span>Flip Card</span>
                    </div>
                </div>
            </div>

            {/* Pagination controls */}
            <div className="mt-4 flex justify-between items-center">
                <button
                    onClick={handlePrev}
                    className="rounded-full border border-brand-indigo/10 px-4 py-2 text-xs font-bold text-brand-indigo transition hover:bg-brand-indigo/5"
                >
                    Previous
                </button>
                <button
                    onClick={handleNext}
                    className="rounded-full bg-brand-indigo px-5 py-2 text-xs font-bold text-white transition hover:bg-brand-indigo/90 shadow-sm"
                >
                    Next Card
                </button>
            </div>
        </>
    )
}