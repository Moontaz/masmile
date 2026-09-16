import type { SessionEvent } from '@/lib/vision/types';

export function SessionStats({ events, onClear }: { events: SessionEvent[]; onClear: () => void }) {
  const best = events.length ? Math.max(...events.map((event) => event.score)) : 0;
  const average = events.length ? events.reduce((sum, event) => sum + event.score, 0) / events.length : 0;
  return <section className="border-t border-black/15 pt-5" aria-label="Session statistics">
    <div className="mb-5 flex items-center justify-between"><p className="eyebrow">Session</p><button type="button" onClick={onClear} className="text-[9px] uppercase tracking-[.14em] text-black/45 transition-colors hover:text-black">Clear session</button></div>
    <div className="grid grid-cols-3 border-y border-black/10">
      <div className="border-r border-black/10 py-4"><p className="text-[9px] uppercase tracking-[.12em] text-black/45">Best</p><p className="mt-2 font-display text-3xl tracking-[-.08em]">{best}<span className="text-sm">%</span></p></div>
      <div className="border-r border-black/10 px-3 py-4"><p className="text-[9px] uppercase tracking-[.12em] text-black/45">Average</p><p className="mt-2 font-display text-3xl tracking-[-.08em]">{average ? average.toFixed(1) : '—'}<span className="text-sm">%</span></p></div>
      <div className="py-4 pl-3"><p className="text-[9px] uppercase tracking-[.12em] text-black/45">Total</p><p className="mt-2 font-display text-3xl tracking-[-.08em]">{String(events.length).padStart(2, '0')}</p></div>
    </div>
    <div className="mt-4 space-y-0">{events.slice().reverse().slice(0, 4).map((event) => <div className="flex items-center justify-between border-b border-black/10 py-3 text-xs" key={event.id}><span className="font-mono text-[10px] text-black/40">{String(event.id).padStart(2, '0')} / {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span><span className="font-semibold">{event.score}%</span></div>)}</div>
  </section>;
}
