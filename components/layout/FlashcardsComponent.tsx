"use client";

import { useState } from "react";
import { RotateCw, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from 'next/navigation';
import { updateCompletedDeck } from '@/lib/localStorage';

interface FlashcardsComponentProps {
    deckData: {
        id?: string;
        name?: string;
        cards?: { term?: string; definition?: string }[];
        [key: string]: unknown;
    };
}

export default function FlashcardsComponent({ deckData }: FlashcardsComponentProps) {
    const sampleFlashcards = deckData.cards || [];
    const deckId = (deckData.id as string) || "";

    const router = useRouter();
    const [currentCard, setCurrentCard] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [cardTransition, setCardTransition] = useState(false);

    const handleNext = () => {
        setCardTransition(true);
        setIsFlipped(false);
        setTimeout(() => {
            if (currentCard < sampleFlashcards.length - 1) {
                setCurrentCard((prev) => prev + 1);
            } else {
                updateCompletedDeck();
                router.push(`/flashcards/${deckId}/complete`);
            }
            setCardTransition(false);
        }, 200);
    };

    const handlePrev = () => {
        setCardTransition(true);
        setIsFlipped(false);
        setTimeout(() => {
            setCurrentCard((prev) => (prev - 1 + sampleFlashcards.length) % sampleFlashcards.length);
            setCardTransition(false);
        }, 200);
    };

    const progress = ((currentCard + 1) / sampleFlashcards.length) * 100;

    return (
        <>
            {/* Progress Bar */}
            <div className="mb-6 space-y-2">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-brand-muted">
                        Card {currentCard + 1} of {sampleFlashcards.length}
                    </span>
                    <span className="text-xs font-bold text-brand-lime">
                        {Math.round(progress)}%
                    </span>
                </div>
                <div className="w-full h-2 bg-brand-indigo/10 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-gradient-to-r from-brand-indigo to-brand-lime transition-all duration-300 rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Main Flashcard - Mobile Responsive */}
            <div className="mb-8 perspective">
                <div
                    onClick={() => setIsFlipped(!isFlipped)}
                    className={`group relative min-h-[280px] sm:min-h-[320px] md:min-h-[360px] rounded-3xl border-2 p-6 sm:p-8 md:p-10 flex flex-col justify-between cursor-pointer select-none transition-all duration-300 transform ${
                        cardTransition ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                    } ${isFlipped
                        ? 'bg-gradient-to-br from-brand-indigo to-brand-indigo/80 text-white border-brand-indigo shadow-lg shadow-brand-indigo/30'
                        : 'bg-white text-brand-text hover:border-brand-lime border-brand-indigo/10 hover:border-brand-lime/50 shadow-sm hover:shadow-md hover:shadow-brand-lime/10'
                    }`}
                >
                    {/* Card Label Badge */}
                    <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
                        <span className={`inline-block text-[10px] sm:text-xs font-extrabold uppercase tracking-widest px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg transition-colors ${
                            isFlipped 
                                ? 'bg-brand-lime text-brand-indigo' 
                                : 'bg-brand-indigo text-brand-lime'
                        }`}>
                            {isFlipped ? "Answer" : "Question"}
                        </span>
                    </div>

                    {/* Deck Name Badge */}
                    <div className="absolute top-4 left-4 sm:top-6 sm:left-6">
                        <span className={`text-[9px] sm:text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg ${
                            isFlipped 
                                ? 'bg-white/20 text-white' 
                                : 'bg-brand-indigo/10 text-brand-indigo'
                        }`}>
                            {deckData.name}
                        </span>
                    </div>

                    {/* Card Content */}
                    <div className="mt-8 sm:mt-10 text-center">
                        {isFlipped ? (
                            <div className="animate-in fade-in duration-300">
                                <p className="text-base sm:text-lg md:text-xl font-semibold leading-relaxed">
                                    {sampleFlashcards[currentCard].definition}
                                </p>
                            </div>
                        ) : (
                            <div className="animate-in fade-in duration-300">
                                <p className="text-xl sm:text-2xl md:text-3xl font-black leading-snug tracking-tight font-heading">
                                    {sampleFlashcards[currentCard].term}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Flip Hint */}
                    <div className="flex items-center justify-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity mt-8 sm:mt-10">
                        <RotateCw className={`h-4 w-4 ${isFlipped ? 'text-brand-lime animate-spin-slow' : 'text-brand-indigo'}`} />
                        <span className="text-xs sm:text-sm font-semibold">
                            {isFlipped ? "Tap to see question" : "Tap to reveal answer"}
                        </span>
                    </div>
                </div>
            </div>

            {/* Navigation Controls */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                <button
                    type="button"
                    onClick={handlePrev}
                    className="flex items-center justify-center gap-2 rounded-2xl border border-brand-indigo/15 bg-white px-3 py-3.5 text-sm font-bold text-brand-indigo transition hover:bg-brand-indigo/5 active:scale-95"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                </button>

                <button
                    type="button"
                    onClick={handleNext}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-brand-indigo px-3 py-3.5 text-sm font-bold text-white transition hover:bg-brand-indigo/90 active:scale-95 shadow-md shadow-brand-indigo/15"
                >
                    {currentCard < sampleFlashcards.length - 1 ? "Next" : "Finish"}
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </>
    )
}