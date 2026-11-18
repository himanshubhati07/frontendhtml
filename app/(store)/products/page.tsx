import { Suspense } from "react";
import { ProductListing } from "./product-listing";
import { ProductGridSkeleton } from "@/components/Skeleton";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-8">
          <ProductGridSkeleton />
        </div>
      }
    >
      <ProductListing />
    </Suspense>
  );
}
