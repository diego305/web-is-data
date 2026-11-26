import { TypedOption } from "../../types";

interface RadioOptionGroupProps<T extends string> {
  legend: string;
  name: string;
  options: TypedOption<T>[];
  value: T;
  onChange: (value: T) => void;
}

export function RadioOptionGroup<T extends string>({
  legend,
  name,
  options,
  value,
  onChange
}: RadioOptionGroupProps<T>) {
  return (
    <fieldset className="space-y-2">
      <legend className="block text-xs font-medium text-[#1E252D] mb-2 font-['Outfit']">
        {legend}
      </legend>
      <div className="space-y-2">
        {options.map((opt) => {
          const checked = value === opt.id;
          return (
            <label
              key={opt.id}
              className={`flex items-start gap-2.5 p-3 min-h-[44px] rounded-xl border text-xs sm:text-sm cursor-pointer transition-colors ${
                checked
                  ? "bg-sky-50/70 border-[#3B8AC4] text-[#1E252D] font-medium"
                  : "bg-white border-[#E4ECF2] text-slate-700 hover:bg-[#F5F8FB]"
              }`}
            >
              <input
                type="radio"
                name={name}
                value={opt.id}
                checked={checked}
                onChange={() => onChange(opt.id)}
                className="mt-0.5 text-[#2C6E9E] focus:ring-[#3B8AC4]"
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
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
}

export function CheckboxOptionGroup<T extends string>({
  legend,
  hint,
  options,
  selected,
  onToggle,
  columns = 1,
  accent = "blue",
  maxSelections
}: CheckboxOptionGroupProps<T>) {
  const limitReached =
    typeof maxSelections === "number" && selected.length >= maxSelections;

  return (
    <fieldset className="space-y-2">
      <legend className="block text-xs font-medium text-[#1E252D] mb-1.5 font-['Outfit']">
        {legend}
        {hint && (
          <span className="block text-[11px] font-normal text-slate-600 font-['Inter'] mt-0.5">
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
              : "bg-sky-50/70 border-[#3B8AC4] text-[#1E252D] font-medium";

          return (
            <label
              key={opt.id}
              className={`flex items-start gap-2.5 p-3 min-h-[44px] rounded-xl border text-xs sm:text-sm transition-colors ${
                checked
                  ? `${activeClass} cursor-pointer`
                  : disabled
                  ? "bg-slate-50 border-[#E4ECF2] text-slate-500 cursor-not-allowed opacity-65"
                  : "bg-white border-[#E4ECF2] text-slate-700 hover:bg-[#F5F8FB] cursor-pointer"
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => onToggle(opt.id)}
                className="mt-0.5 rounded-sm border-[#E4ECF2] text-[#2C6E9E] focus:ring-[#3B8AC4]"
              />
              <span>{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
