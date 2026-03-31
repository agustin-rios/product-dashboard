"use client";

import { useEffect, useState } from "react";
import { ProductView } from "@/contexts/product/domain/models/ProductView";

type UseProductsParams = {
  page: number;       // 1-indexed — el hook se encarga de convertir a skip
  limit: number;
  sortBy: string;
  order: "asc" | "desc";
};

type UseProductsResult = {
  data: ProductView[];
  total: number;
  loading: boolean;   // ← el page no necesita manejar su propio loading de tabla
};

export function useProducts(params: UseProductsParams): UseProductsResult {
  const [data, setData] = useState<ProductView[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      try {
        // Conversión correcta: page 1 → skip 0, page 2 → skip 20, etc.
        const skip = (params.page - 1) * params.limit;

        const qs = new URLSearchParams({
          skip: String(skip),
          limit: String(params.limit),
          sortBy: params.sortBy,
          order: params.order,
        });

        const res = await fetch(`/api/products?${qs}`, {
          signal: controller.signal,
        });

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const json = await res.json();
        setData(json.items ?? []);
        setTotal(json.total ?? 0);
      } catch (err: unknown) {
        if (err instanceof Error && err.name !== "AbortError") {
          console.error("Error fetching products:", err);
          setData([]);
        }
      } finally {
        setLoading(false);
      }
    }

    load();

    return () => controller.abort();
    // Los primitivos como dependencias evitan el re-render infinito
    // que causaría pasar el objeto params directamente
  }, [params.page, params.limit, params.sortBy, params.order]);

  return { data, total, loading };
}