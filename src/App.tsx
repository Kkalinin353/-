import { useState } from 'react';
import { tickets } from './data/tickets';
import { TicketList } from './components/TicketList';
import { Quiz } from './components/Quiz';
import { Completion } from './components/Completion';
import { useCompletedTickets } from './hooks/useCompletedTickets';

type View = { screen: 'list' } | { screen: 'quiz'; ticketId: number } | { screen: 'done'; ticketId: number };

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
      />
    );
  }

  const ticket = tickets.find((t) => t.id === view.ticketId)!;

  if (view.screen === 'quiz') {
    return (
      <Quiz
        key={quizKey}
        ticket={ticket}
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
      ticket={ticket}
      onExit={() => setView({ screen: 'list' })}
      onRetry={() => {
        setQuizKey((k) => k + 1);
        setView({ screen: 'quiz', ticketId: ticket.id });
      }}
    />
  );
}

export default App;
