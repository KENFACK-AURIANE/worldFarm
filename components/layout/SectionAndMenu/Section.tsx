/* eslint-disable @typescript-eslint/no-explicit-any */
export default function Section({ title, children }: any) {
  return (
    <div>
      <h3 className="text-gray-700 font-semibold mb-2">{title}</h3>
      <div className="bg-white rounded-2xl flex flex-col shadow divide-y">
        {children}
      </div>
    </div>
  );
}