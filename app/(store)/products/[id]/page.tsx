"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { HeartIcon, TruckIcon } from "@/components/Icons";
import { ProductCard } from "@/components/ProductCard";
import { QuantitySelector } from "@/components/QuantitySelector";
import { Skeleton } from "@/components/Skeleton";
import { StarRating } from "@/components/StarRating";
import { MAX_QUANTITY_PER_ITEM } from "@/lib/constants";
import { useWishlist } from "@/lib/hooks/useWishlist";
import { currentUser } from "@/lib/stores/auth-store";
import * as cartStore from "@/lib/stores/cart-store";
import * as productStore from "@/lib/stores/product-store";
import * as reviewStore from "@/lib/stores/review-store";
import { discountPercent, effectivePrice, formatDate, formatPrice } from "@/lib/utils";
import { validateRequired } from "@/lib/validation";
import type { Product, Review } from "@/types";

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { productIds, toggle } = useWishlist();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [sizeError, setSizeError] = useState(false);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const loadReviews = useCallback(async () => {
    setReviews(await reviewStore.getByProduct(params.id));
  }, [params.id]);

  useEffect(() => {
    setLoading(true);
    Promise.all([productStore.getById(params.id), productStore.getAll()]).then(([found, all]) => {
      setProduct(found ?? null);
      if (found) {
        setColor(found.colors[0]?.name ?? "");
        setRelated(all.filter((item) => item.category === found.category && item.id !== found.id).slice(0, 4));
      }
      setLoading(false);
    });
    loadReviews();
  }, [params.id, loadReviews]);

  if (loading) {
    return (
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 md:grid-cols-2" role="status" aria-label="Loading product">
        <Skeleton className="aspect-[3/4] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-10 w-1/3" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Product not found</h1>
        <p className="mt-2 text-muted">This product may have been removed.</p>
        <Link href="/products" className="btn-primary mt-6">
          Browse products
        </Link>
      </div>
    );
  }

  const wishlisted = productIds.includes(product.id);
  const outOfStock = product.stock === 0;
  const maxQuantity = Math.min(product.stock, MAX_QUANTITY_PER_ITEM);
  const percent = discountPercent(product);
  const reviewTitleError = validateRequired(reviewTitle, "Title");
  const reviewCommentError = validateRequired(reviewComment, "Review");
  const reviewValid = !reviewTitleError && !reviewCommentError;

  async function handleAddToCart() {
    if (!product) return;
    if (!size) {
      setSizeError(true);
      toast.error("Please select a size");
      return;
    }
    await cartStore.create(
      {
        productId: product.id,
        quantity,
        size,
        color,
        priceAtAdd: effectivePrice(product),
      },
      product.stock,
    );
    toast.success("Added to bag");
    router.push("/cart");
  }

  async function handleReviewSubmit(event: React.FormEvent) {
    event.preventDefault();
    const user = currentUser();
    if (!user) {
      toast("Please log in to write a review");
      router.push(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setReviewSubmitted(true);
    if (!reviewValid || !product) return;
    await reviewStore.create({
      productId: product.id,
      userId: user.id,
      userName: user.name,
      rating: reviewRating,
      title: reviewTitle.trim(),
      comment: reviewComment.trim(),
    });
    toast.success("Thanks for your review!");
    setReviewTitle("");
    setReviewComment("");
    setReviewRating(5);
    setReviewSubmitted(false);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-xs text-muted">
        <Link href="/" className="hover:text-primary">
          Home
        </Link>
        <span className="mx-1">/</span>
        <Link href={`/products?category=${product.category}`} className="capitalize hover:text-primary">
          {product.category}
        </Link>
        <span className="mx-1">/</span>
        <span className="font-semibold text-ink">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="grid grid-cols-[72px_1fr] gap-3">
          <div className="space-y-3">
            {product.images.map((image, index) => (
              <button
                key={image}
                type="button"
                aria-label={`View image ${index + 1}`}
                aria-current={index === activeImage}
                onClick={() => setActiveImage(index)}
                className={`block overflow-hidden border-2 ${index === activeImage ? "border-primary" : "border-transparent"}`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="" className="aspect-[3/4] w-full bg-surface object-cover" />
              </button>
            ))}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={product.images[activeImage]}
            alt={`${product.name} — view ${activeImage + 1}`}
            className="aspect-[3/4] w-full bg-surface object-cover"
          />
        </div>

        <div>
          <h1 className="text-2xl font-bold">{product.brand}</h1>
          <p className="text-lg text-muted">{product.name}</p>
          <div className="mt-3 flex items-center gap-2">
            <StarRating rating={product.rating} />
            <span className="text-sm text-muted">
              {product.rating.toFixed(1)} | {product.reviewCount.toLocaleString("en-IN")} ratings
            </span>
          </div>

          <div className="mt-4 flex flex-wrap items-baseline gap-3 border-t border-line pt-4">
            <span className="text-2xl font-bold">{formatPrice(effectivePrice(product))}</span>
            {product.discountPrice && (
              <>
                <span className="text-lg text-muted line-through">{formatPrice(product.price)}</span>
                <span className="font-bold text-warning">({percent}% OFF)</span>
              </>
            )}
          </div>
          <p className="text-xs font-semibold text-success">inclusive of all taxes</p>

          {product.colors.length > 1 && (
            <fieldset className="mt-6">
              <legend className="mb-2 text-sm font-bold uppercase">Color: {color}</legend>
              <div className="flex gap-3">
                {product.colors.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    aria-label={item.name}
                    aria-pressed={color === item.name}
                    onClick={() => setColor(item.name)}
                    className={`h-9 w-9 rounded-full border-2 ${
                      color === item.name ? "border-primary ring-2 ring-primary/30" : "border-line"
                    }`}
                    style={{ backgroundColor: item.hex }}
                  />
                ))}
              </div>
            </fieldset>
          )}

          <fieldset className="mt-6">
            <legend className="mb-2 text-sm font-bold uppercase">Select size</legend>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((item) => (
                <button
                  key={item}
                  type="button"
                  aria-pressed={size === item}
                  onClick={() => {
                    setSize(item);
                    setSizeError(false);
                  }}
                  className={`min-w-12 rounded-full border px-4 py-2 text-sm font-bold ${
                    size === item ? "border-primary text-primary" : "border-line hover:border-primary"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            {sizeError && (
              <p role="alert" className="mt-2 text-sm text-danger">
                Please select a size
              </p>
            )}
          </fieldset>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-bold uppercase">Qty</span>
            <QuantitySelector value={quantity} max={Math.max(maxQuantity, 1)} onChange={setQuantity} />
            {!outOfStock && product.stock <= 10 && (
              <span className="text-sm font-semibold text-warning">Only {product.stock} left!</span>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button type="button" onClick={handleAddToCart} disabled={outOfStock} className="btn-primary flex-1">
              {outOfStock ? "Out of stock" : "Add to bag"}
            </button>
            <button
              type="button"
              onClick={() => toggle(product.id)}
              aria-pressed={wishlisted}
              className="btn-outline flex-1"
            >
              <HeartIcon className={`h-5 w-5 ${wishlisted ? "text-primary" : ""}`} filled={wishlisted} />
              {wishlisted ? "Wishlisted" : "Wishlist"}
            </button>
          </div>

          <p className="mt-6 flex items-center gap-2 text-muted">
            <TruckIcon className="h-5 w-5" />
            Free delivery on orders above ₹999
          </p>

          <div className="mt-6 border-t border-line pt-4">
            <h2 className="mb-2 text-sm font-bold uppercase">Product details</h2>
            <p className="text-muted">{product.description}</p>
          </div>
        </div>
      </div>

      <section aria-labelledby="reviews-heading" className="mt-14 grid gap-8 md:grid-cols-2">
        <div>
          <h2 id="reviews-heading" className="mb-4 text-xl font-bold">
            Ratings &amp; reviews
          </h2>
          {reviews.length === 0 ? (
            <p className="text-muted">No reviews yet. Be the first to review this product.</p>
          ) : (
            <ul className="space-y-4">
              {reviews.map((review) => (
                <li key={review.id} className="border-b border-line pb-4">
                  <div className="flex items-center gap-2">
                    <StarRating rating={review.rating} />
                    <span className="font-bold">{review.title}</span>
                  </div>
                  <p className="mt-1 text-muted">{review.comment}</p>
                  <p className="mt-1 text-xs text-muted">
                    {review.userName} · {formatDate(review.createdAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <form onSubmit={handleReviewSubmit} noValidate className="space-y-4 rounded border border-line p-5">
          <h3 className="font-bold">Write a review</h3>
          <div>
            <label htmlFor="review-rating" className="field-label">
              Rating
            </label>
            <select
              id="review-rating"
              value={reviewRating}
              onChange={(event) => setReviewRating(Number(event.target.value))}
              className="field-input"
            >
              {[5, 4, 3, 2, 1].map((value) => (
                <option key={value} value={value}>
                  {value} star{value > 1 ? "s" : ""}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="review-title" className="field-label">
              Title
            </label>
            <input
              id="review-title"
              value={reviewTitle}
              onChange={(event) => setReviewTitle(event.target.value)}
              aria-describedby={reviewSubmitted && reviewTitleError ? "review-title-error" : undefined}
              className="field-input"
            />
            {reviewSubmitted && reviewTitleError && (
              <p id="review-title-error" className="mt-1 text-xs text-danger">
                {reviewTitleError}
              </p>
            )}
          </div>
          <div>
            <label htmlFor="review-comment" className="field-label">
              Your review
            </label>
            <textarea
              id="review-comment"
              rows={3}
              value={reviewComment}
              onChange={(event) => setReviewComment(event.target.value)}
              aria-describedby={reviewSubmitted && reviewCommentError ? "review-comment-error" : undefined}
              className="field-input"
            />
            {reviewSubmitted && reviewCommentError && (
              <p id="review-comment-error" className="mt-1 text-xs text-danger">
                {reviewCommentError}
              </p>
            )}
          </div>
          <button type="submit" className="btn-primary">
            Submit review
          </button>
        </form>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="related-heading" className="mt-14">
          <h2 id="related-heading" className="mb-6 text-xl font-bold uppercase">
            Similar products
          </h2>
          <div className="grid grid-cols-2 gap-x-4 gap-y-8 md:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
