"use client";

export function TableSkeleton({ rows = 5, cols = 9 }: { rows?: number; cols?: number }) {
  return (
    <>
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <tr key={rowIndex} className="animate-pulse">
          {Array.from({ length: cols }).map((_, colIndex) => (
            <td key={colIndex} className="px-6 py-4">
              <div className="h-4 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 rounded w-3/4 animate-[shimmer_2s_infinite]" />
            </td>
          ))}
        </tr>
      ))}

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }
      `}</style>
    </>
  );
}
