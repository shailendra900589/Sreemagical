export default function AdminLoading() {
  return (
    <div
      className="admin-ledger-page flex min-h-[calc(100vh-8rem)] flex-col space-y-5"
      aria-busy="true"
      aria-label="Loading admin page"
    >
      <div className="space-y-2">
        <div className="h-3 w-40 rounded bg-slate-200" />
        <div className="h-8 w-52 rounded-lg bg-slate-200" />
        <div className="h-4 max-w-lg rounded bg-slate-100" />
      </div>

      <div className="admin-stat-grid grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[5.5rem] rounded-xl border border-slate-100 bg-white"
          />
        ))}
      </div>

      <div className="admin-substat-grid grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="min-h-[5.25rem] rounded-xl border border-slate-100 bg-white"
          />
        ))}
      </div>

      <div className="min-h-[28rem] flex-1 rounded-2xl border border-slate-100 bg-white" />
    </div>
  );
}
