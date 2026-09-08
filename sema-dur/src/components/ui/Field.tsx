import { useId, type ComponentProps, type ReactNode } from "react";

const fieldCss =
  "w-full rounded-[var(--radius-sm)] border border-[var(--color-line-strong)] bg-white px-3.5 py-2.5 text-[0.95rem] text-[var(--color-ink)] outline-none transition-colors placeholder:text-[var(--color-ink-muted)] focus-visible:border-[var(--color-brand)] focus-visible:ring-2 focus-visible:ring-[var(--color-brand-tint)] user-invalid:border-[var(--color-danger)]";

type BaseProps = {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  className?: string;
  children?: ReactNode;
};

function Wrapper({
  id,
  label,
  hint,
  error,
  required,
  className = "",
  children,
}: BaseProps & { id: string }) {
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className="text-sm font-medium text-[var(--color-ink)]">
        {label}
        {required ? (
          <span className="text-[var(--color-danger)]" aria-hidden>
            {" "}
            *
          </span>
        ) : (
          <span className="text-[var(--color-ink-muted)]"> (opcional)</span>
        )}
      </label>
      {hint ? (
        <span id={`${id}-hint`} className="text-xs text-[var(--color-ink-muted)]">
          {hint}
        </span>
      ) : null}
      {children}
      {error ? (
        <span
          id={`${id}-error`}
          className="text-xs font-medium text-[var(--color-danger)]"
        >
          {error}
        </span>
      ) : null}
    </div>
  );
}

export function Input({
  label,
  hint,
  error,
  required,
  className,
  id: providedId,
  ...props
}: BaseProps & ComponentProps<"input"> & { id?: string }) {
  const reactId = useId();
  const id = providedId ?? reactId;
  return (
    <Wrapper
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <input
        id={id}
        required={required}
        aria-describedby={
          [hint && `${id}-hint`, error && `${id}-error`]
            .filter(Boolean)
            .join(" ") || undefined
        }
        aria-invalid={error ? true : undefined}
        className={fieldCss}
        {...props}
      />
    </Wrapper>
  );
}

export function Textarea({
  label,
  hint,
  error,
  required,
  className,
  id: providedId,
  ...props
}: BaseProps & ComponentProps<"textarea"> & { id?: string }) {
  const reactId = useId();
  const id = providedId ?? reactId;
  return (
    <Wrapper
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <textarea
        id={id}
        required={required}
        rows={4}
        aria-describedby={
          [hint && `${id}-hint`, error && `${id}-error`]
            .filter(Boolean)
            .join(" ") || undefined
        }
        className={`${fieldCss} resize-y`}
        {...props}
      />
    </Wrapper>
  );
}

export function Select({
  label,
  hint,
  error,
  required,
  className,
  id: providedId,
  children,
  ...props
}: BaseProps & ComponentProps<"select"> & { id?: string }) {
  const reactId = useId();
  const id = providedId ?? reactId;
  return (
    <Wrapper
      id={id}
      label={label}
      hint={hint}
      error={error}
      required={required}
      className={className}
    >
      <select
        id={id}
        required={required}
        className={`${fieldCss} appearance-none bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%235B7185%22 stroke-width=%222%22 stroke-linecap=%22round%22><path d=%22m6 9 6 6 6-6%22/></svg>')] bg-[length:18px] bg-[right_0.75rem_center] bg-no-repeat pr-10`}
        {...props}
      >
        {children}
      </select>
    </Wrapper>
  );
}
