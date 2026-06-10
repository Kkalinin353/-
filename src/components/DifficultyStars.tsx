interface DifficultyStarsProps {
  level: 1 | 2 | 3;
  className?: string;
}

const COLORS: Record<number, string> = {
  1: 'text-emerald-500',
  2: 'text-amber-500',
  3: 'text-rose-500',
};

export function DifficultyStars({ level, className = '' }: DifficultyStarsProps) {
  return (
    <span className={`inline-flex items-center gap-0.5 ${COLORS[level]} ${className}`} title={`Сложность: ${level} из 3`}>
      {[1, 2, 3].map((i) => (
        <span key={i} className={i <= level ? 'opacity-100' : 'opacity-20'}>
          ★
        </span>
      ))}
    </span>
  );
}
