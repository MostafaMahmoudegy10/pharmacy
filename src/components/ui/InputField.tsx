import type { ChangeEventHandler, HTMLInputTypeAttribute } from 'react';

export function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
}) {
  const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    onChange(event.target.value);
  };

  return (
    <label className="grid gap-2">
      <span className="text-xs font-black text-[#49645d]">{label}</span>
      <input
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        type={type}
        required={required}
        className="min-h-13 rounded-xl border border-[#d7e8e2] bg-[#fbfdfc] px-4 text-sm font-bold text-[#173d36] outline-none transition placeholder:text-[#96a7a2] focus:border-[#0f7f6d] focus:bg-white focus:ring-4 focus:ring-[#0f7f6d]/5"
      />
    </label>
  );
}
