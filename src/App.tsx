import { useState } from 'react';
import { tickets } from './data/tickets';
import { TicketList } from './components/TicketList';
import { Quiz, type PoolQuestion } from './components/Quiz';
import { Completion } from './components/Completion';
import { useCompletedTickets } from './hooks/useCompletedTickets';

type View =
  | { screen: 'list' }
  | { screen: 'quiz'; ticketId: number }
  | { screen: 'done'; ticketId: number }
  | { screen: 'hardcore' }
  | { screen: 'hardcore-done' };

const HARDCORE_POOL: PoolQuestion[] = tickets.flatMap((t) =>
  t.questions.map((q) => ({ ...q, ticketId: t.id, ticketDifficulty: t.difficulty })),
);

function App() {
  const [view, setView] = useState<View>({ screen: 'list' });
  const { completed, markCompleted } = useCompletedTickets();
  const [quizKey, setQuizKey] = useState(0);

  if (view.screen === 'list') {
    return (
      <TicketList
        tickets={tickets}
        completed={completed}
        onSelect={(id) => {
          setQuizKey((k) => k + 1);
          setView({ screen: 'quiz', ticketId: id });
        }}
        onHardcore={() => {
          setQuizKey((k) => k + 1);
          setView({ screen: 'hardcore' });
        }}
      />
    );
  }

  if (view.screen === 'hardcore') {
    return (
      <Quiz
        key={quizKey}
        pool={HARDCORE_POOL}
        roundSize={HARDCORE_POOL.length}
        headerLabel="Хардкор режим"
        headerTitle="Все билеты — 600 вопросов"
        restartMessage="Хардкор режим начинается заново."
        onExit={() => setView({ screen: 'list' })}
        onComplete={() => setView({ screen: 'hardcore-done' })}
      />
    );
  }

  if (view.screen === 'hardcore-done') {
    return (
      <Completion
        title="Хардкор пройден!"
        subtitle="Все 600 вопросов"
        message="Вы ответили правильно на все вопросы подряд."
        onExit={() => setView({ screen: 'list' })}
        onRetry={() => {
          setQuizKey((k) => k + 1);
          setView({ screen: 'hardcore' });
        }}
      />
    );
  }

  const ticket = tickets.find((t) => t.id === view.ticketId)!;

  if (view.screen === 'quiz') {
    return (
      <Quiz
        key={quizKey}
        pool={ticket.questions.map((q) => ({ ...q, ticketDifficulty: ticket.difficulty }))}
        roundSize={10}
        headerLabel={`Билет ${ticket.id}`}
        headerTitle={ticket.title}
        restartMessage="Все вопросы билета начнутся заново."
        onExit={() => setView({ screen: 'list' })}
        onComplete={() => {
          markCompleted(ticket.id);
          setView({ screen: 'done', ticketId: ticket.id });
        }}
      />
    );
  }

  return (
    <Completion
      title="Билет освоен!"
      subtitle={`Билет ${ticket.id}. ${ticket.title}`}
      message="Вы ответили правильно на 10 вопросов подряд."
      onExit={() => setView({ screen: 'list' })}
      onRetry={() => {
        setQuizKey((k) => k + 1);
        setView({ screen: 'quiz', ticketId: ticket.id });
      }}
    />
  );
}

export default App;
