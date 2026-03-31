import { ProductViewPort } from "@/contexts/product/application/ports/ProductView";
import { ProductRepository } from "@/contexts/product/infra/http/ProductView";
import { DummyJsonClient } from "@/util/DummyJsonCli";

export const productRepository: ProductViewPort = new ProductRepository(
  new DummyJsonClient(
    'https://dummyjson.com'
  )
);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const searchParams = url.searchParams;

  const limit  = parseInt(searchParams.get("limit")  ?? "10", 10);
  const skip   = parseInt(searchParams.get("skip")   ?? "0",  10);
  const sortBy = searchParams.get("sortBy") ?? "price";
  const order  = (searchParams.get("order") ?? "asc") as "asc" | "desc";

  try {
    const { items, total } = await productRepository.findAll({
      limit,
      skip,
      sortBy,
      order,
    });

    return new Response(
      JSON.stringify({
        items,
        total,
      }),
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (err) {
    console.error("Error fetching products:", err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch products" }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}