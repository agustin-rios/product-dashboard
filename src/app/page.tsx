"use client";

import { useEffect, useState } from "react";
import { ProductView as Product } from "@/contexts/product/domain/models/ProductView";
import { KpiCard } from "@/components/Kpi";
import { ProductTable } from "@/components/ProductTable";
import { ProductDetail } from "@/components/ProductDetail";
import { useProducts } from "./hooks/useProducts";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface DashboardStats {
  totalProducts: number;
  averagePrice: number;
  averageRating: number;
  lowStockCount: number;
  outOfStockCount: number;
  topCategory: string;
  categoryCounts: Record<string, number>;
}

type SortKey = "title" | "category" | "price" | "finalPrice" | "rating" | "stock";
type SortDir = "asc" | "desc";

// ---------------------------------------------------------------------------
// API
// ---------------------------------------------------------------------------

async function fetchStats(): Promise<DashboardStats> {
  const res = await fetch("/api/products/stats");
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

const LIMIT = 8;

export default function ProductDashboardPage() {
  const [stats, setStats]       = useState<DashboardStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [selected, setSelected] = useState<Product | null>(null);

  // Todo el estado de navegación vive aquí — ProductTable es solo presentación
  const [page, setPage]   = useState(1);
  const [sort, setSort]   = useState<{ key: SortKey; order: SortDir }>({
    key: "price",
    order: "asc",
  });

  // El hook devuelve su propio loading — no necesitamos duplicarlo en el page
  const { data, total, loading: tableLoading } = useProducts({
    page,
    limit: LIMIT,
    sortBy: sort.key,
    order: sort.order,
  });

  useEffect(() => {
    fetchStats()
      .then(setStats)
      .catch(console.error)
      .finally(() => setStatsLoading(false));
  }, []);

  function handleSortChange(newSort: { key: SortKey; order: SortDir }) {
    setSort(newSort);
    setPage(1); // volver a página 1 al cambiar orden
  }

  return (
    <main className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 p-6 lg:p-8 font-sans">

      {/* Header */}
      <header className="mb-6">
        <h1 className="text-xl font-medium tracking-tight">Product Insights</h1>
        <p className="text-[13px] text-gray-400 mt-0.5">Catálogo interno</p>
      </header>

      {/* KPIs */}
      <section
        className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6"
        aria-label="Métricas generales"
      >
        <KpiCard
          label="Total productos"
          value={stats?.totalProducts.toString() ?? "—"}
          loading={statsLoading}
        />
        <KpiCard
          label="Precio promedio"
          value={stats ? `$${stats.averagePrice.toFixed(2)}` : "—"}
          loading={statsLoading}
        />
        <KpiCard
          label="Rating promedio"
          value={stats ? `${stats.averageRating.toFixed(2)} / 5` : "—"}
          sub={stats ? `Top: ${stats.topCategory}` : undefined}
          loading={statsLoading}
        />
        <KpiCard
          label="Bajo stock"
          value={stats ? `${stats.lowStockCount} productos` : "—"}
          sub={stats ? `${stats.outOfStockCount} sin stock` : undefined}
          loading={statsLoading}
          accent={stats && stats.lowStockCount > 0 ? "warning" : undefined}
        />
      </section>

      {/* Tabla + detalle */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-4">

        <ProductTable
          products={data}
          loading={tableLoading}
          page={page}
          total={total}
          limit={LIMIT}
          sort={sort}
          selectedProductId={selected?.id ?? null}
          onPageChange={setPage}
          onSelectProduct={setSelected}
          onSortChange={handleSortChange}
        />

        <div className="rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 overflow-y-auto max-h-[600px]">
          {selected ? (
            <ProductDetail product={selected} />
          ) : (
            <div className="flex items-center justify-center h-full py-16 text-[13px] text-gray-400 text-center">
              Selecciona un producto
              <br />
              para ver el detalle
            </div>
          )}
        </div>

      </div>
    </main>
  );
}