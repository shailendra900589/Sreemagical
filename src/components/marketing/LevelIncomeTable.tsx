const rows = [
  [1, 5, 500],
  [2, 10, 1000],
  [3, 15, 1500],
  [4, 20, 2000],
  [5, 25, 2500],
  [6, 30, 3000],
  [7, 35, 3500],
  [8, 40, 4000],
  [9, 45, 4500],
  [10, 50, 5000],
];

export function LevelIncomeTable() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:p-7">
      <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#9a7b1a]">
        Second Income · BP only
      </p>
      <h2 className="mt-2 text-2xl font-bold text-[#001a40]">Level Distribution Income</h2>
      <p className="mt-2 text-sm leading-7 text-slate-600">
        Team development के अनुसार 10 levels तक — BP base ₹10,000। Percentages admin panel से किसी भी
        समय बदले जा सकते हैं।
      </p>
      <div className="mt-5 overflow-hidden rounded-xl border border-slate-200">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3 font-medium">Level</th>
              <th className="px-4 py-3 font-medium">%</th>
              <th className="px-4 py-3 font-medium">Per BP Join</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(([level, pct, amt]) => (
              <tr key={level} className="border-t border-slate-100 hover:bg-slate-50/80">
                <td className="px-4 py-2.5 font-medium text-[#001a40]">Level {level}</td>
                <td className="px-4 py-2.5 text-[#9a7b1a]">{pct}%</td>
                <td className="px-4 py-2.5">₹{amt.toLocaleString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
