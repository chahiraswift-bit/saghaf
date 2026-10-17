"use client";

import { useMemo, useState } from "react";

export function QuoteEstimator() {
  const [seats, setSeats] = useState(10);
  const perSeat = seats >= 250 ? 8400 : seats >= 50 ? 11200 : 14500;
  const total = useMemo(() => seats * perSeat, [seats, perSeat]);
  return <div className="mb-4 grid gap-3 rounded-xl border border-[#eeeaf3] bg-[#f8f6fb] p-4 dark:border-white/[.07] dark:bg-white/[.03] sm:grid-cols-[1fr_auto] sm:items-center">
    <label className="text-[10px] font-medium">Estimated employee seats <input type="range" min={5} max={500} step={5} value={seats} onChange={e => setSeats(Number(e.target.value))} className="mt-2 block w-full accent-[#7945c3]"/><span className="mt-1 block text-xs font-semibold">{seats} seats</span></label>
    <div className="sm:text-right"><p className="text-[9px] uppercase tracking-wider text-[#928a9b]">Indicative annual estimate</p><p className="mt-1 text-lg font-bold">{total.toLocaleString()} DZD</p><p className="text-[9px] text-[#928a9b]">{perSeat.toLocaleString()} DZD / seat · final quote after review</p></div>
  </div>;
}
