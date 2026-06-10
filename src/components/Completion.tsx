import type { Ticket } from '../types';

interface CompletionProps {
  ticket: Ticket;
  onRetry: () => void;
  onExit: () => void;
}

export function Completion({ ticket, onRetry, onExit }: CompletionProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl bg-white shadow-lg ring-1 ring-slate-200 p-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-3xl">
          🎉
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Билет освоен!</h2>
        <p className="text-slate-500 mb-1">
          Билет {ticket.id}. {ticket.title}
        </p>
        <p className="text-slate-500 mb-8">
          Вы ответили правильно на 10 вопросов подряд.
        </p>
        <div className="flex flex-col gap-3">
          <button
            onClick={onExit}
            className="w-full rounded-xl py-3.5 font-semibold text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-150"
          >
            К списку билетов
          </button>
          <button
            onClick={onRetry}
            className="w-full rounded-xl py-3.5 font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors duration-150"
          >
            Пройти ещё раз
          </button>
        </div>
      </div>
    </div>
  );
}
