import type { Statistic } from "@/data/statistics";
export function StatCard({ stat }: { stat: Statistic }) {
  return (
    <div className="border-amber border-l-2 pl-5 text-center sm:text-left">
      <strong className="font-heading block text-4xl font-extrabold text-white sm:text-5xl">
        {stat.value}
      </strong>
      <span className="mt-2 block text-sm leading-6 text-white/65">
        {stat.label}
      </span>
    </div>
  );
}
