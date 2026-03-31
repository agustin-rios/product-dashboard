import { productRepository } from "@/app/api/products/route";

export async function GET() {
  try {
    // limit=0 en DummyJSON devuelve todos los productos sin paginar
    // lo necesitamos para calcular agregaciones sobre el catálogo completo
    const { items } = await productRepository.findAll({
      limit: 0,
      skip: 0,
      sortBy: "price",
      order: "asc",
    });

    // --- agregaciones ---

    const totalProducts = items.length;

    const averagePrice =
      totalProducts === 0
        ? 0
        : Number(
            (items.reduce((sum, p) => sum + p.price, 0) / totalProducts).toFixed(2)
          );

    const averageRating =
      totalProducts === 0
        ? 0
        : Number(
            (items.reduce((sum, p) => sum + p.rating, 0) / totalProducts).toFixed(2)
          );

    const lowStockCount = items.filter(
      (p) => p.stock > 0 && p.stock < 10
    ).length;

    const outOfStockCount = items.filter(
      (p) => p.availabilityStatus === "Out of Stock" || p.stock === 0
    ).length;

    // frecuencia por categoría
    const categoryCounts = items.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {});

    const topCategory =
      Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "—";

    return new Response(
      JSON.stringify({
        totalProducts,
        averagePrice,
        averageRating,
        lowStockCount,
        outOfStockCount,
        topCategory,
        categoryCounts,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error calculating stats:", err);
    return new Response(
      JSON.stringify({ error: "Failed to calculate stats" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}