"use client";

import { ProductView as Product } from "@/contexts/product/domain/models/ProductView";
import { Skeleton } from "@/components/Skeleton";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type SortKey = "title" | "category" | "price" | "finalPrice" | "rating" | "stock";
type SortDir = "asc" | "desc";

interface SortState {
  key: SortKey;
  order: SortDir;
}

interface ProductTableProps {
  products: Product[];
  loading: boolean;
  page: number;
  total: number;
  limit: number;
  sort: SortState;                               // controlled — viene del page
  selectedProductId?: number | null;
  onPageChange: (page: number) => void;
  onSelectProduct: (product: Product) => void;
  onSortChange: (sort: SortState) => void;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const COLUMNS: { key: SortKey; label: string; align?: "right" }[] = [
  { key: "title",      label: "Nombre" },
  { key: "category",   label: "Categoría" },
  { key: "price",      label: "Precio",   align: "right" },
  { key: "finalPrice", label: "P. final", align: "right" },
  { key: "rating",     label: "Rating" },
  { key: "stock",      label: "Stock" },
];

function SortIcon({ active, dir }: { active: boolean; dir: SortDir }) {
  // Usamos caracteres unicode en vez de SVG inline para evitar
  // hydration mismatch — el SVG genera diffs de className entre
  // el HTML que renderiza el servidor y el que monta el cliente.
  if (!active)
    return (
      <span className="ml-1 text-gray-300 dark:text-gray-600 text-[10px] leading-none">
        ⇅
      </span>
    );
  return (
    <span className="ml-1 text-blue-500 text-[10px] leading-none">
      {dir === "asc" ? "↑" : "↓"}
    </span>
  );
}

function StockBadge({ stock, status }: { stock: number; status: string }) {
  if (status === "Out of Stock" || stock === 0)
    return <span className="inline-flex rounded-md bg-red-50 dark:bg-red-900/20 px-2 py-0.5 text-[11px] font-medium text-red-700 dark:text-red-400">Sin stock</span>;
  if (status === "Low Stock" || stock < 10)
    return <span className="inline-flex rounded-md bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 text-[11px] font-medium text-amber-700 dark:text-amber-400">Bajo ({stock})</span>;
  return <span className="inline-flex rounded-md bg-emerald-50 dark:bg-emerald-900/20 px-2 py-0.5 text-[11px] font-medium text-emerald-700 dark:text-emerald-400">{stock}</span>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ProductTable({
  products = [],
  loading,
  page,
  total,
  limit,
  sort,
  selectedProductId = null,
  onPageChange,
  onSelectProduct,
  onSortChange,
}: ProductTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  function handleSort(key: SortKey) {
    const order: SortDir =
      sort.key === key && sort.order === "asc" ? "desc" : "asc";
    onSortChange({ key, order });
  }

  const rangeStart = total === 0 ? 0 : (page - 1) * limit + 1;
  const rangeEnd = Math.min(page * limit, total);

  return (
    <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 flex flex-col gap-3 min-w-0">

      <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium">
        Catálogo de productos
      </p>

      <div className="overflow-x-auto">
        <table className="w-full text-[13px] table-fixed">
          <thead>
            <tr className="border-b border-gray-100 dark:border-gray-800">
              {COLUMNS.map((col) => (
                <th
                  key={col.key}
                  onClick={() => handleSort(col.key)}
                  className={`py-2 px-2 text-[11px] uppercase tracking-wider font-medium text-gray-400 cursor-pointer select-none hover:text-gray-600 dark:hover:text-gray-200 transition-colors ${col.align === "right" ? "text-right" : "text-left"}`}
                >
                  {col.label}
                  <SortIcon active={sort.key === col.key} dir={sort.order} />
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-50 dark:divide-gray-800/50">
            {loading
              ? Array.from({ length: limit }).map((_, i) => (
                  <tr key={i}>
                    {COLUMNS.map((col) => (
                      <td key={col.key} className="py-2.5 px-2">
                        <Skeleton className="h-4 w-full" />
                      </td>
                    ))}
                  </tr>
                ))
              : products.length === 0
              ? (
                  <tr>
                    <td colSpan={COLUMNS.length} className="py-10 text-center text-gray-400 text-[13px]">
                      Sin productos
                    </td>
                  </tr>
                )
              : products.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => onSelectProduct(p)}
                    className={`cursor-pointer transition-colors ${
                      selectedProductId === p.id
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800/40"
                    }`}
                  >
                    <td className="py-2.5 px-2 font-medium truncate text-gray-800 dark:text-gray-200">
                      {p.title}
                    </td>
                    <td className="py-2.5 px-2 text-gray-500 dark:text-gray-400 truncate">
                      {p.category}
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums">
                      ${p.price.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-2 text-right tabular-nums text-emerald-600 dark:text-emerald-400">
                      ${(p.price * (1 - p.discountPercentage / 100)).toFixed(2)}
                    </td>
                    <td className="py-2.5 px-2 tabular-nums text-gray-700 dark:text-gray-300">
                      {p.rating.toFixed(2)}
                    </td>
                    <td className="py-2.5 px-2">
                      <StockBadge stock={p.stock} status={p.availabilityStatus} />
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between pt-1 text-[12px] text-gray-400">
        <span>
          {total > 0 ? `${rangeStart}–${rangeEnd} de ${total}` : "Sin resultados"}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(1)}
            disabled={page === 1}
            className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:cursor-not-allowed transition-colors"
          >
            «
          </button>
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page === 1}
            className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:cursor-not-allowed transition-colors"
          >
            ‹
          </button>
          <span className="px-3 py-1 text-gray-600 dark:text-gray-300 font-medium">
            {page} / {totalPages}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page === totalPages}
            className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:cursor-not-allowed transition-colors"
          >
            ›
          </button>
          <button
            onClick={() => onPageChange(totalPages)}
            disabled={page === totalPages}
            className="px-2 py-1 rounded border border-gray-200 dark:border-gray-700 disabled:opacity-30 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:cursor-not-allowed transition-colors"
          >
            »
          </button>
        </div>
      </div>

    </div>
  );
}