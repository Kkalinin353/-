import type { Ticket } from '../types';

interface TicketListProps {
  tickets: Ticket[];
  completed: Set<number>;
  onSelect: (id: number) => void;
}

export function TicketList({ tickets, completed, onSelect }: TicketListProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-violet-50">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:py-14">
        <header className="text-center mb-10">
          <p className="text-sm font-semibold uppercase tracking-widest text-indigo-500 mb-2">
            Подготовка к экзамену
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
            Билеты по журналистике
          </h1>
          <p className="mt-3 text-slate-500">
            Выберите билет и ответьте на 10 вопросов подряд без ошибок
          </p>
          <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
            <span className="text-emerald-500 font-bold">{completed.size}</span>
            <span>из {tickets.length} билетов пройдено</span>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {tickets.map((ticket) => {
            const done = completed.has(ticket.id);
            return (
              <button
                key={ticket.id}
                onClick={() => onSelect(ticket.id)}
                className={`group relative text-left rounded-2xl border p-4 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 ${
                  done
                    ? 'bg-emerald-50 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                      done
                        ? 'bg-emerald-500 text-white'
                        : 'bg-indigo-100 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition-colors'
                    }`}
                  >
                    {done ? '✓' : ticket.id}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                      Билет {ticket.id}
                    </p>
                    <p className="text-sm font-medium text-slate-800 leading-snug line-clamp-3">
                      {ticket.title}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
