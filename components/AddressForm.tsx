"use client";

import { useState } from "react";
import { validatePhone, validatePostalCode, validateRequired } from "@/lib/validation";

export interface AddressValues {
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export const EMPTY_ADDRESS: AddressValues = {
  name: "",
  phone: "",
  street: "",
  city: "",
  state: "",
  postalCode: "",
  country: "India",
  isDefault: false,
};

interface AddressFormProps {
  initial?: AddressValues;
  submitLabel: string;
  idPrefix: string;
  onSubmit: (values: AddressValues) => void | Promise<void>;
  onCancel?: () => void;
}

export function AddressForm({
  initial = EMPTY_ADDRESS,
  submitLabel,
  idPrefix,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  const [values, setValues] = useState<AddressValues>(initial);
  const [submitted, setSubmitted] = useState(false);

  const errors: Record<string, string> = {
    name: validateRequired(values.name, "Name"),
    phone: validatePhone(values.phone),
    street: validateRequired(values.street, "Address"),
    city: validateRequired(values.city, "City"),
    state: validateRequired(values.state, "State"),
    postalCode: validatePostalCode(values.postalCode),
    country: validateRequired(values.country, "Country"),
  };
  const isValid = Object.values(errors).every((message) => !message);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!isValid) {
      setSubmitted(true);
      return;
    }
    onSubmit({ ...values, name: values.name.trim(), street: values.street.trim() });
  }

  function renderField(
    field: keyof Omit<AddressValues, "isDefault">,
    label: string,
    helper?: string,
    inputMode?: "numeric" | "tel",
  ) {
    const id = `${idPrefix}-${field}`;
    const error = submitted ? errors[field] : "";
    return (
      <div>
        <label htmlFor={id} className="field-label">
          {label}
        </label>
        <input
          id={id}
          value={values[field]}
          inputMode={inputMode}
          onChange={(event) => setValues({ ...values, [field]: event.target.value })}
          aria-invalid={error ? true : undefined}
          aria-describedby={`${id}-help`}
          className={`field-input ${error ? "border-danger" : ""}`}
        />
        <p id={`${id}-help`} className={`mt-1 text-xs ${error ? "text-danger" : "text-muted"}`}>
          {error || helper}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div className="grid gap-x-4 sm:grid-cols-2">
        {renderField("name", "Full name")}
        {renderField("phone", "Mobile number", "10-digit number starting with 6-9", "tel")}
      </div>
      {renderField("street", "Address (house no, street, area)")}
      <div className="grid gap-x-4 sm:grid-cols-2">
        {renderField("city", "City")}
        {renderField("state", "State")}
        {renderField("postalCode", "PIN code", "6 digits", "numeric")}
        {renderField("country", "Country")}
      </div>
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={values.isDefault}
          onChange={(event) => setValues({ ...values, isDefault: event.target.checked })}
          className="h-4 w-4 accent-primary"
        />
        Make this my default address
      </label>
      <div className="flex gap-3">
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-outline">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
