import { roleConfig } from '../../data/pharmacyData';
import type { Locale, Role } from '../../types/pharmacy';

export function RoleBadge({
  role,
  locale,
  active = false,
}: {
  role: Role;
  locale: Locale;
  active?: boolean;
}) {
  const config = roleConfig.find((item) => item.id === role) ?? roleConfig[0];
  const Icon = config.icon;

  return (
    <span
      className={[
        'inline-flex min-h-8 items-center gap-2 rounded-md px-2.5 text-xs font-black ring-1',
        active ? 'bg-[#0f7f6d] text-white ring-[#0f7f6d]' : `${config.accent} ring-current/10`,
      ].join(' ')}
    >
      <Icon size={15} />
      {config.badge[locale]}
    </span>
  );
}
