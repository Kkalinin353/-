import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'exam-quiz-completed-tickets';

function load(): Set<number> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw) as number[]);
  } catch {
    return new Set();
  }
}

export function useCompletedTickets() {
  const [completed, setCompleted] = useState<Set<number>>(() => load());

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...completed]));
  }, [completed]);

  const markCompleted = useCallback((id: number) => {
    setCompleted((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      return next;
    });
  }, []);

  const reset = useCallback(() => {
    setCompleted(new Set());
  }, []);

  return { completed, markCompleted, reset };
}
