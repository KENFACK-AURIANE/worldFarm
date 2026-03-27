/* eslint-disable @typescript-eslint/no-explicit-any */
export default function InputInfo({ icon, label, value, onChange, disabled }: any) {
  return (
    <div>
      <label className="text-sm text-gray-600">{label}</label>

      <div className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2 mt-1">
        {icon}
        <input
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="flex-1 outline-none bg-transparent"
        />
      </div>
    </div>
  );
}