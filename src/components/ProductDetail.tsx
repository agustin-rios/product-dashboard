import { ProductView as Product } from "@/contexts/product/domain/models/ProductView";

function StarRating({ value }: { value: number }) {
  return (
    <span className="text-amber-400 text-[13px]" aria-label={`${value} de 5`}>
      {"★".repeat(Math.round(value))}
      {"☆".repeat(5 - Math.round(value))}
    </span>
  );
}

export function ProductDetail({ product }: { product: Product }) {
  return (
    <div className="flex flex-col gap-4">
 
      <div>
        <h2 className="text-[15px] font-medium text-gray-900 dark:text-gray-100 leading-snug">
          {product.title}
        </h2>
        <p className="text-[12px] text-gray-400 mt-0.5">
          {product.brand} · {product.category}
        </p>
        <p className="text-[13px] text-gray-500 dark:text-gray-400 mt-2 leading-relaxed line-clamp-3">
          {product.description}
        </p>
      </div>
 
      <dl className="divide-y divide-gray-100 dark:divide-gray-700 text-[13px]">
        {(
          [
            { label: "Precio", value: `$${product.price.toFixed(2)}` },
            product.discountPercentage > 0
              ? {
                  label: "Precio final",
                  value: `$${product.finalPrice.toFixed(2)} (−${product.discountPercentage.toFixed(1)}%)`,
                  highlight: true,
                }
              : null,
            { label: "Rating", node: <StarRating value={product.rating} /> },
            { label: "Stock", value: `${product.stock} unid.` },
            { label: "Orden mínima", value: `${product.minimumOrderQuantity} unid.` },
            { label: "Envío", value: product.shippingInformation },
            { label: "Devolución", value: product.returnPolicy },
            { label: "Garantía", value: product.warrantyInformation },
          ] as Array<{
            label: string;
            value?: string;
            node?: React.ReactNode;
            highlight?: boolean;
          } | null>
        )
          .filter(Boolean)
          .map((row) => (
            <div
              key={row!.label}
              className="flex justify-between items-center py-2 gap-2"
            >
              <dt className="text-gray-400 shrink-0">{row!.label}</dt>
              <dd
                className={`text-right font-medium max-w-[60%] ${
                  row!.highlight
                    ? "text-emerald-600 dark:text-emerald-400"
                    : "text-gray-800 dark:text-gray-200"
                }`}
              >
                {row!.node ?? row!.value}
              </dd>
            </div>
          ))}
      </dl>
 
      {product.reviews.length > 0 && (
        <div>
          <p className="text-[11px] uppercase tracking-widest text-gray-400 font-medium mb-2">
            Reseñas recientes
          </p>
          <ul className="divide-y divide-gray-100 dark:divide-gray-700">
            {product.reviews.slice(0, 3).map((r, i) => (
              <li key={i} className="py-2">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-gray-700 dark:text-gray-300">
                    {r.reviewerName}
                  </span>
                  <StarRating value={r.rating} />
                </div>
                <p className="text-[12px] text-gray-500 dark:text-gray-400 mt-0.5">
                  {r.comment}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}