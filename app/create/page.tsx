'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { UploadCloud, Wand2, FileText, Loader2, BookOpen, ClipboardList, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

export default function CreatePage() {
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<'flashcard' | 'quiz'>('flashcard');
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [level, setLevel] = useState('');
  const [numQuestions, setNumQuestions] = useState(10);
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState('Analyzing & generating…');
  const [error, setError] = useState<string | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [successData, setSuccessData] = useState<{ id: string, type: string } | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/auth/login?next=/create');
      return;
    }

    const fetchCredits = async () => {
      try {
        const res = await fetch('/api/credits');
        if (res.ok) {
          const data = await res.json();
          setCredits(data.credits_balance);
        }
      } catch (e) {
        console.error('Failed to fetch credits', e);
      }
    };
    fetchCredits();
  }, [isAuthenticated, authLoading, router]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (selectedFile: File) => {
    setError(null);
    const validTypes = [
      'application/pdf', 
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'image/jpeg',
      'image/png',
      'image/webp'
    ];
    if (!validTypes.includes(selectedFile.type) && !/\.(jpe?g|png|webp|pdf|docx|pptx|txt)$/i.test(selectedFile.name)) {
      setError('Unsupported file type. Please upload PDF, DOCX, PPTX, TXT, or Images (JPG, PNG).');
      return;
    }
    if (selectedFile.size > 15 * 1024 * 1024) {
      setError('File size exceeds 15MB limit.');
      return;
    }
    setFile(selectedFile);
  };

  // Extract text from standard standalone images dynamically on client
  const extractTextFromImage = async (imageFile: File): Promise<string> => {
    try {
      setLoadingStatus('Extracting text from image via OCR...');
      const Tesseract = (await import('tesseract.js')).default;
      const worker = await Tesseract.createWorker('eng');
      const ret = await worker.recognize(imageFile);
      await worker.terminate();
      return ret.data.text;
    } catch (err) {
      console.error('OCR error:', err);
      throw new Error('Failed to extract text from image material.');
    }
  };

  // Extract text from scanned/image-based PDFs using dynamic PDF.js + Tesseract imports
  const extractTextFromPDF = async (pdfFile: File): Promise<string> => {
    try {
      setLoadingStatus('Reading PDF pages...');
      const pdfjsLib = await import('pdfjs-dist');
      pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

      const arrayBuffer = await pdfFile.arrayBuffer();
      const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
      const pdfDoc = await loadingTask.promise;
      const numPages = pdfDoc.numPages;

      const Tesseract = (await import('tesseract.js')).default;
      const worker = await Tesseract.createWorker('eng');
      let fullExtractedText = '';

      for (let i = 1; i <= numPages; i++) {
        setLoadingStatus(`OCR processing PDF page ${i} of ${numPages}...`);
        const page = await pdfDoc.getPage(i);
        
        const viewport = page.getViewport({ scale: 2.0 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        if (context) {
          await page.render({ canvasContext: context, viewport, canvas }).promise;
          const { data: { text } } = await worker.recognize(canvas);
          fullExtractedText += `\n--- Page ${i} ---\n` + text;
        }
      }

      await worker.terminate();
      return fullExtractedText;
    } catch (err) {
      console.error('PDF OCR error:', err);
      throw new Error('Failed to parse and read text from the scanned PDF.');
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload.');
      return;
    }
    if (credits !== null && credits <= 0) {
      setError('No generation credits remaining.');
      return;
    }
    if (type === 'quiz' && (numQuestions < 10 || numQuestions > 30)) {
      setError('Number of questions must be between 10 and 30.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const formData = new FormData();
      let processedText = '';

      if (file.type.startsWith('image/') || /\.(jpe?g|png|webp)$/i.test(file.name)) {
        processedText = await extractTextFromImage(file);
      } else if (file.type === 'application/pdf' || /\.pdf$/i.test(file.name)) {
        processedText = await extractTextFromPDF(file);
      }

      if (processedText) {
        if (processedText.trim().length < 10) {
          throw new Error('No legible text found in this document/image. Please ensure it is clear.');
        }
        const textBlob = new Blob([processedText], { type: 'text/plain' });
        formData.append('file', textBlob, `${file.name}.txt`);
      } else {
        formData.append('file', file);
      }

      setLoadingStatus('Analyzing document with AI...');
      formData.append('type', type);
      if (title) formData.append('title', title);
      if (course && type === 'quiz') formData.append('course', course);
      if (level && type === 'quiz') formData.append('level', level);
      if (type === 'quiz') formData.append('numQuestions', numQuestions.toString());

      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate content');
      }

      setCredits(data.credits_remaining);
      setSuccessData({ id: data.id, type: data.type });
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setIsGenerating(false);
      setLoadingStatus('Analyzing & generating…');
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="h-8 w-8 text-brand-indigo animate-spin" />
        <p className="text-sm text-brand-muted font-semibold">Loading...</p>
      </div>
    );
  }

  if (successData) {
    return (
      <div className="page-shell page-section max-w-2xl text-center animate-in fade-in zoom-in duration-500">
        <div className="mx-auto flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-brand-success/20 text-brand-success mb-5 sm:mb-6">
          <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10" />
        </div>
        <h1 className="font-heading text-2xl sm:text-3xl font-extrabold text-brand-indigo mb-3 sm:mb-4">
          Generation Complete!
        </h1>
        <p className="text-sm sm:text-base text-brand-muted mb-6 sm:mb-8">
          Your AI-powered {successData.type} has been created successfully.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <button
            type="button"
            onClick={() => router.push(`/${successData.type === 'flashcard' ? 'flashcards' : 'quizzes'}/${successData.id}`)}
            className="w-full sm:w-auto rounded-xl bg-brand-indigo px-6 py-3 font-bold text-white transition hover:bg-brand-indigo/90 shadow-md shadow-brand-indigo/20"
          >
            View {successData.type === 'flashcard' ? 'Deck' : 'Quiz'}
          </button>
          <button
            type="button"
            onClick={() => {
              setSuccessData(null);
              setFile(null);
              setTitle('');
            }}
            className="w-full sm:w-auto rounded-xl border border-brand-indigo/10 px-6 py-3 font-bold text-brand-indigo transition hover:bg-brand-indigo/5"
          >
            Create Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell page-section max-w-3xl space-y-8 sm:space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2 min-w-0">
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl font-extrabold text-brand-indigo flex items-center gap-2 sm:gap-3">
            <Wand2 className="h-6 w-6 sm:h-8 sm:w-8 text-brand-lime shrink-0" />
            Create with AI
          </h1>
          <p className="text-brand-muted text-sm max-w-md leading-relaxed">
            Upload your lecture notes, scanned textbooks, documents, or photos to generate study materials instantly.
          </p>
        </div>
        {credits !== null && (
          <div className="flex items-center gap-2 rounded-2xl bg-brand-lime/10 px-4 py-2 border border-brand-lime/20 text-brand-indigo w-fit shrink-0">
            <span className="font-bold text-2xl tabular-nums">{credits}</span>
            <span className="text-xs uppercase tracking-wider font-extrabold opacity-80 leading-tight">Credits<br/>Left</span>
          </div>
        )}
      </div>

      <form onSubmit={handleGenerate} className="space-y-8">
        <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setType('flashcard')}
            className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 text-left transition-all duration-300 ${
              type === 'flashcard' 
                ? 'border-brand-lime bg-brand-lime/5 shadow-md shadow-brand-lime/10' 
                : 'border-brand-indigo/5 bg-white hover:border-brand-indigo/20'
            }`}
          >
            <div className={`mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl ${type === 'flashcard' ? 'bg-brand-lime text-brand-indigo' : 'bg-brand-indigo/5 text-brand-indigo'}`}>
              <BookOpen className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-brand-indigo mb-1">Flashcard Deck</h3>
            <p className="text-xs text-brand-muted leading-relaxed">Extract key terms and definitions for spaced repetition study.</p>
          </button>

          <button
            type="button"
            onClick={() => setType('quiz')}
            className={`p-4 sm:p-6 rounded-2xl sm:rounded-3xl border-2 text-left transition-all duration-300 ${
              type === 'quiz' 
                ? 'border-brand-lime bg-brand-lime/5 shadow-md shadow-brand-lime/10' 
                : 'border-brand-indigo/5 bg-white hover:border-brand-indigo/20'
            }`}
          >
            <div className={`mb-3 sm:mb-4 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-xl sm:rounded-2xl ${type === 'quiz' ? 'bg-brand-lime text-brand-indigo' : 'bg-brand-indigo/5 text-brand-indigo'}`}>
              <ClipboardList className="h-5 w-5 sm:h-6 sm:w-6" />
            </div>
            <h3 className="font-bold text-base sm:text-lg text-brand-indigo mb-1">Practice Quiz</h3>
            <p className="text-xs text-brand-muted leading-relaxed">Generate multiple-choice questions to test your comprehension.</p>
          </button>
        </div>

        <div className="glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 space-y-5 sm:space-y-6">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-brand-indigo mb-2">
              Source Document (Supports Scanned PDFs & Images)
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`cursor-pointer rounded-2xl border-2 border-dashed p-5 sm:p-8 text-center transition-all ${
                isDragging
                  ? 'border-brand-lime bg-brand-lime/10'
                  : 'border-brand-indigo/10 bg-brand-surface hover:bg-brand-indigo/5 hover:border-brand-indigo/30'
              }`}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".pdf,.docx,.pptx,.txt,image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
              />
              {file ? (
                <div className="flex flex-col items-center gap-3 min-w-0">
                  <div className="rounded-full bg-brand-indigo/10 p-3 text-brand-indigo">
                    <FileText className="h-6 w-6" />
                  </div>
                  <div className="min-w-0 w-full">
                    <p className="font-bold text-brand-indigo text-sm sm:text-base break-all">{file.name}</p>
                    <p className="text-xs text-brand-muted mt-1">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="rounded-full bg-brand-indigo/5 p-3 sm:p-4 text-brand-indigo/40">
                    <UploadCloud className="h-7 w-7 sm:h-8 sm:w-8" />
                  </div>
                  <div>
                    <p className="font-bold text-brand-indigo text-sm sm:text-base">Click to upload or drag & drop</p>
                    <p className="text-xs text-brand-muted mt-1">PDF, Scanned PDFs, DOCX, PPTX, TXT, or Images (Max 15MB)</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-brand-indigo/5">
            <div>
              <label className="block text-xs font-bold text-brand-muted mb-1">Title (Optional)</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Biology 101 Midterm Review"
                className="w-full rounded-xl border border-brand-indigo/10 bg-white px-3 sm:px-4 py-3 text-sm font-semibold text-brand-text outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo"
              />
            </div>

            {type === 'quiz' && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-xs font-bold text-brand-muted mb-1">Course Code (Optional)</label>
                  <input
                    type="text"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                    placeholder="e.g., GST 101"
                    className="w-full rounded-xl border border-brand-indigo/10 bg-white px-3 sm:px-4 py-3 text-sm font-semibold text-brand-text outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-muted mb-1">Level (Optional)</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value)}
                    className="w-full rounded-xl border border-brand-indigo/10 bg-white px-3 sm:px-4 py-3 text-sm font-semibold text-brand-text outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo"
                  >
                    <option value="">Select Level</option>
                    <option value="100L">100L</option>
                    <option value="200L">200L</option>
                    <option value="300L">300L</option>
                    <option value="400L">400L</option>
                    <option value="500L">500L</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-muted mb-1">Number of Questions (10-30)</label>
                  <input
                    type="number"
                    min={10}
                    max={30}
                    value={numQuestions}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      setNumQuestions(isNaN(val) ? 10 : val);
                    }}
                    className="w-full rounded-xl border border-brand-indigo/10 bg-white px-3 sm:px-4 py-3 text-sm font-semibold text-brand-text outline-none focus:border-brand-indigo focus:ring-1 focus:ring-brand-indigo"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-xl bg-brand-danger/10 p-3 sm:p-4 text-sm font-semibold text-brand-danger border border-brand-danger/20">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isGenerating || !file || (credits !== null && credits <= 0)}
          className="w-full flex items-center justify-center gap-2 rounded-2xl bg-brand-indigo px-4 sm:px-8 py-3.5 sm:py-4 font-bold text-sm sm:text-base text-white transition-all hover:bg-brand-indigo/90 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-brand-indigo/15 relative overflow-hidden group"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin shrink-0" />
              <span className="truncate">{loadingStatus}</span>
              <div className="absolute inset-0 bg-white/10 animate-pulse" />
            </>
          ) : (
            <>
              <Wand2 className="h-5 w-5 text-brand-lime shrink-0" />
              <span>Generate {type === 'flashcard' ? 'Deck' : 'Quiz'}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
