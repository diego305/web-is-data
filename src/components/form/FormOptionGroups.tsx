import { TypedOption } from "../../types";

interface RadioOptionGroupProps<T extends string> {
  legend: string;
  name: string;
  options: TypedOption<T>[];
  value: T | "";
  onChange: (value: T) => void;
  required?: boolean;
  error?: string;
  errorId?: string;
}

export function RadioOptionGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange,
  required = false,
  error,
  errorId
}: RadioOptionGroupProps<T>) {
  return (
    <fieldset
      className="space-y-2.5"
      aria-invalid={error ? "true" : undefined}
      aria-describedby={error && errorId ? errorId : undefined}
    >
      <legend className="block text-sm font-medium text-[#1E252D] mb-2 font-['Outfit'] leading-snug">
        {legend}
        {required && (
          <span className="text-[#B4372D] ml-1" aria-hidden="true">
            *
          </span>
        )}
      </legend>
      <div className="space-y-2">
        {options.map((opt) => {
          const checked = value === opt.id;
          return (
            <label
              key={opt.id}
              className={`flex items-start gap-3 p-3.5 min-h-[48px] rounded-xl border text-sm leading-snug cursor-pointer transition-colors ${
                checked
                  ? "bg-sky-50/80 border-[#2C6E9E] text-[#1E252D] font-medium"
                  : error
                  ? "bg-rose-50/30 border-rose-300 text-slate-700 hover:bg-rose-50/60"
                  : "bg-white border-[#E4ECF2] text-slate-700 hover:bg-[#F5F8FB]"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt.id}
                checked={checked}
                onChange={() => onChange(opt.id)}
                className="mt-0.5 w-4 h-4 shrink-0 accent-[#2C6E9E]"
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-[#B4372D] pt-0.5">
          {error}
        </p>
      )}
    </fieldset>
  );
}

interface CheckboxOptionGroupProps<T extends string> {
  legend: string;
  hint?: string;
  options: TypedOption<T>[];
  selected: T[];
  onToggle: (id: T) => void;
  columns?: 1 | 2;
  accent?: "blue" | "bronze";
  maxSelections?: number;
  required?: boolean;
  error?: string;
  errorId?: string;
}

export function CheckboxOptionGroup<T extends string>({
  legend,
  hint,
  options,
  selected,
  onToggle,
  columns = 1,
  accent = "blue",
  maxSelections,
  required = false,
  error,
  errorId
}: CheckboxOptionGroupProps<T>) {
  const limitReached =
    typeof maxSelections === "number" && selected.length >= maxSelections;

  return (
    <fieldset
      className="space-y-2.5"
      aria-invalid={error ? "true" : undefined}
      aria-describedby={error && errorId ? errorId : undefined}
    >
      <legend className="block text-sm font-medium text-[#1E252D] mb-1.5 font-['Outfit'] leading-snug">
        {legend}
        {required && (
          <span className="text-[#B4372D] ml-1" aria-hidden="true">
            *
          </span>
        )}
        {hint && (
          <span className="block text-xs font-normal text-slate-600 font-['Inter'] mt-0.5">
            {hint}
          </span>
        )}
      </legend>
      <div
        className={
          columns === 2
            ? "grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1"
            : "space-y-2 pt-1"
        }
      >
        {options.map((opt) => {
          const checked = selected.includes(opt.id);
          const disabled = !checked && limitReached;
          const activeClass =
            accent === "bronze"
              ? "bg-[#FAF7F5] border-[#7A5F4B] text-[#1E252D] font-medium"
              : "bg-sky-50/80 border-[#2C6E9E] text-[#1E252D] font-medium";

          return (
            <label
              key={opt.id}
              className={`flex items-start gap-3 p-3.5 min-h-[48px] rounded-xl border text-sm leading-snug transition-colors ${
                checked
                  ? `${activeClass} cursor-pointer`
                  : disabled
                  ? "bg-slate-50 border-[#E4ECF2] text-slate-500 cursor-not-allowed opacity-70"
                  : error
                  ? "bg-rose-50/30 border-rose-300 text-slate-700 hover:bg-rose-50/60 cursor-pointer"
                  : "bg-white border-[#E4ECF2] text-slate-700 hover:bg-[#F5F8FB] cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => onToggle(opt.id)}
                className="mt-0.5 w-4 h-4 shrink-0 rounded-sm accent-[#2C6E9E]"
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-[#B4372D] pt-0.5">
          {error}
        </p>
      )}
    </fieldset>
  );
}
