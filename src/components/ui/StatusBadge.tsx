import type { ReactNode } from 'react';

type BadgeTone = 'green' | 'amber' | 'red' | 'blue' | 'violet' | 'neutral';

const toneClasses: Record<BadgeTone, string> = {
  green: 'bg-emerald-50 text-[#0f7f6d] ring-emerald-100',
  amber: 'bg-amber-50 text-[#a16207] ring-amber-100',
  red: 'bg-rose-50 text-[#b42318] ring-rose-100',
  blue: 'bg-sky-50 text-[#166a9f] ring-sky-100',
  violet: 'bg-violet-50 text-[#6d4cc9] ring-violet-100',
  neutral: 'bg-slate-50 text-[#475569] ring-slate-100',
};

export function StatusBadge({
  children,
  tone = 'green',
}: {
  children: ReactNode;
  tone?: BadgeTone;
}) {
  return (
    <span className={`inline-flex min-h-7 items-center rounded-md px-2.5 text-xs font-black ring-1 ${toneClasses[tone]}`}>
      {children}
    </span>
  );
}
