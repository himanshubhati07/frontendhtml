import { formatPrice, type Totals } from "@/lib/utils";

export function PriceSummary({ totals, couponCode }: { totals: Totals; couponCode?: string }) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between">
        <dt>Bag total</dt>
        <dd>{formatPrice(totals.subtotal)}</dd>
      </div>
      {totals.discount > 0 && (
        <div className="flex justify-between text-success">
          <dt>Coupon discount{couponCode ? ` (${couponCode})` : ""}</dt>
          <dd>−{formatPrice(totals.discount)}</dd>
        </div>
      )}
      <div className="flex justify-between">
        <dt>Estimated tax (5% GST)</dt>
        <dd>{formatPrice(totals.tax)}</dd>
      </div>
      <div className="flex justify-between">
        <dt>Shipping</dt>
        <dd className={totals.shipping === 0 ? "text-success" : ""}>
          {totals.shipping === 0 ? "FREE" : formatPrice(totals.shipping)}
        </dd>
      </div>
      <div className="flex justify-between border-t border-line pt-3 text-base font-bold">
        <dt>Total amount</dt>
        <dd>{formatPrice(totals.total)}</dd>
      </div>
    </dl>
  );
}
