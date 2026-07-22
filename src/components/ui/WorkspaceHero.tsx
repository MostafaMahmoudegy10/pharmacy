import type { ReactNode } from 'react';
import { roleConfig } from '../../data/pharmacyData';
import type { Locale, Role } from '../../types/pharmacy';
import { RoleBadge } from './RoleBadge';

export function WorkspaceHero({
  role,
  locale,
  title,
  description,
  children,
}: {
  role: Role;
  locale: Locale;
  title: string;
  description: string;
  children?: ReactNode;
}) {
  const config = roleConfig.find((item) => item.id === role) ?? roleConfig[0];
  const Icon = config.icon;

  return (
    <section className={`workspace-hero workspace-hero-${role} border border-[#d7e8e2] bg-white p-5 shadow-sm`}>
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <RoleBadge role={role} locale={locale} />
            <span className="inline-flex min-h-8 items-center rounded-md bg-white/80 px-2.5 text-xs font-black text-[#60756f] ring-1 ring-[#d7e8e2]">
              {config.label[locale]}
            </span>
          </div>
          <h1 className="max-w-3xl text-3xl font-black leading-tight text-[#123d35] md:text-4xl">
            {title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm font-semibold leading-7 text-[#5f756e] md:text-base">
            {description}
          </p>
        </div>
        <div className="grid size-20 shrink-0 place-items-center rounded-lg bg-[#0f7f6d] text-white shadow-lg shadow-emerald-900/10">
          <Icon size={34} />
        </div>
      </div>
      {children && <div className="mt-5">{children}</div>}
    </section>
  );
}
