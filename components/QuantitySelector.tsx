interface QuantitySelectorProps {
  value: number;
  max: number;
  onChange: (value: number) => void;
  label?: string;
}

export function QuantitySelector({ value, max, onChange, label = "Quantity" }: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded border border-line" role="group" aria-label={label}>
      <button
        type="button"
        aria-label="Decrease quantity"
        disabled={value <= 1}
        onClick={() => onChange(value - 1)}
        className="px-3 py-1.5 text-lg disabled:text-disabled"
      >
        −
      </button>
      <span className="min-w-8 text-center font-semibold" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase quantity"
        disabled={value >= max}
        onClick={() => onChange(value + 1)}
        className="px-3 py-1.5 text-lg disabled:text-disabled"
      >
        +
      </button>
    </div>
  );
}
