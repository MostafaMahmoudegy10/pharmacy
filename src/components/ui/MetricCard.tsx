import { motion } from 'framer-motion';
import type { Metric } from '../../types/pharmacy';

export function MetricCard({ label, value, detail, icon: Icon }: Metric) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      className="metric-card border border-[#d7e8e2] bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-black text-[#637b73]">{label}</p>
          <p className="mt-2 break-words text-2xl font-black text-[#173d36]">{value}</p>
        </div>
        <div className="grid size-11 shrink-0 place-items-center rounded-lg bg-[#edf7f3] text-[#0f7f6d]">
          <Icon size={21} />
        </div>
      </div>
      <p className="mt-3 text-xs font-bold leading-5 text-[#73877f]">{detail}</p>
    </motion.article>
  );
}
