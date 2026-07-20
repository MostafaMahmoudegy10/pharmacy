import { Activity } from 'lucide-react';
import type { ReactNode } from 'react';

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  compact = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={compact ? 'flex items-start justify-between gap-4' : 'mb-4 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'}>
      <div className="min-w-0">
        <p className="inline-flex items-center gap-2 text-sm font-black text-[#0f7f6d]">
          <Activity size={16} />
          {eyebrow}
        </p>
        <h2 className={compact ? 'mt-1 text-xl font-black text-[#173d36]' : 'mt-1 text-3xl font-black leading-tight text-[#173d36]'}>
          {title}
        </h2>
        {description && (
          <p className="mt-2 max-w-2xl text-sm font-semibold leading-7 text-[#657b73]">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
