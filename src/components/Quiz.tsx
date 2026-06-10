import { useState } from 'react';
import type { Question, Ticket } from '../types';
import { ProgressBar } from './ProgressBar';

const ROUND_SIZE = 10;

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

interface RoundQuestion extends Question {
  shuffledOptions: { text: string; isCorrect: boolean }[];
}

function buildRound(pool: Question[]): RoundQuestion[] {
  const size = Math.min(ROUND_SIZE, pool.length);
  const picked = shuffle(pool).slice(0, size);
  // if pool smaller than ROUND_SIZE, fill up by repeating random questions
  while (picked.length < ROUND_SIZE) {
    picked.push(pool[Math.floor(Math.random() * pool.length)]);
  }
  return picked.map((q) => ({
    ...q,
    shuffledOptions: shuffle(
      q.options.map((text, i) => ({ text, isCorrect: i === q.correct })),
    ),
  }));
}

interface QuizProps {
  ticket: Ticket;
  onExit: () => void;
  onComplete: () => void;
}

export function Quiz({ ticket, onExit, onComplete }: QuizProps) {
  const [round, setRound] = useState<RoundQuestion[]>(() => buildRound(ticket.questions));
  const [index, setIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);

  const total = round.length;
  const current = round[index];
  const answered = selected !== null;
  const isCorrect = answered && current.shuffledOptions[selected].isCorrect;

  const handleSelect = (i: number) => {
    if (answered) return;
    setSelected(i);
  };

  const handleNext = () => {
    if (!answered) return;

    if (!isCorrect) {
      // restart the whole round with fresh random questions
      setRound(buildRound(ticket.questions));
      setIndex(0);
      setCorrectCount(0);
      setSelected(null);
      return;
    }

    const newCorrect = correctCount + 1;
    if (newCorrect >= total) {
      onComplete();
      return;
    }

    setCorrectCount(newCorrect);
    setIndex(index + 1);
    setSelected(null);
  };

  const optionStyle = (i: number) => {
    const opt = current.shuffledOptions[i];
    if (!answered) {
      return 'bg-white border-slate-200 hover:border-indigo-400 hover:shadow-md hover:-translate-y-0.5';
    }
    if (opt.isCorrect) {
      return 'bg-emerald-50 border-emerald-400 ring-2 ring-emerald-300';
    }
    if (i === selected) {
      return 'bg-rose-50 border-rose-400 ring-2 ring-rose-300';
    }
    return 'bg-white border-slate-200 opacity-50';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={onExit}
            className="text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1"
          >
            ← К списку билетов
          </button>
          <div className="text-xs font-semibold uppercase tracking-widest text-indigo-500">
            Билет {ticket.id}
          </div>
        </div>

        <div className="mb-6">
          <ProgressBar current={correctCount} total={total} />
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">{ticket.title}</h2>
        <p className="text-sm text-slate-400 mb-6">Вопрос {index + 1} из {total}</p>

        <div className="rounded-2xl bg-white shadow-sm ring-1 ring-slate-200 p-5 sm:p-6 mb-5">
          <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">
            {current.question}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {current.shuffledOptions.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={answered}
              className={`text-left rounded-xl border p-4 transition-all duration-150 text-slate-700 font-medium ${optionStyle(i)}`}
            >
              {opt.text}
            </button>
          ))}
        </div>

        {answered && (
          <div
            className={`mt-5 rounded-xl p-4 text-sm font-semibold ${
              isCorrect ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }`}
          >
            {isCorrect
              ? 'Верно!'
              : 'Неправильно. Все вопросы билета начнутся заново.'}
          </div>
        )}

        <button
          onClick={handleNext}
          disabled={!answered}
          className={`mt-6 w-full rounded-xl py-3.5 font-semibold text-white transition-all duration-150 ${
            answered
              ? 'bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg hover:-translate-y-0.5'
              : 'bg-slate-300 cursor-not-allowed'
          }`}
        >
          Далее
        </button>
      </div>
    </div>
  );
}
