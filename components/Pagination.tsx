"use client";

interface PaginationProps {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  total,
  page,
  pageSize,
  onPageChange,
}: PaginationProps) {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-3 py-1 rounded border disabled:opacity-40 hover:bg-gray-50"
      >
        Previous
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`px-3 py-1 rounded border ${
            p === page
              ? "bg-blue-600 text-white border-blue-600"
              : "hover:bg-gray-50"
          }`}
        >
          {p}
        </button>
      ))}

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-3 py-1 rounded border disabled:opacity-40 hover:bg-gray-50"
      >
        Next
      </button>
    </div>
  );
}
