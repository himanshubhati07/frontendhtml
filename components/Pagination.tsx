import { ChevronLeftIcon, ChevronRightIcon } from "@/components/Icons";

interface PaginationProps {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null;
  return (
    <nav aria-label="Pagination" className="mt-8 flex items-center justify-center gap-2">
      <button
        type="button"
        aria-label="Previous page"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="rounded border border-line p-2 disabled:opacity-40"
      >
        <ChevronLeftIcon className="h-4 w-4" />
      </button>
      {Array.from({ length: totalPages }).map((_, position) => {
        const number = position + 1;
        return (
          <button
            key={number}
            type="button"
            aria-label={`Page ${number}`}
            aria-current={number === page ? "page" : undefined}
            onClick={() => onChange(number)}
            className={`h-9 w-9 rounded-full text-sm font-semibold ${
              number === page ? "bg-primary text-white" : "hover:bg-surface"
            }`}
          >
            {number}
          </button>
        );
      })}
      <button
        type="button"
        aria-label="Next page"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="rounded border border-line p-2 disabled:opacity-40"
      >
        <ChevronRightIcon className="h-4 w-4" />
      </button>
    </nav>
  );
}
