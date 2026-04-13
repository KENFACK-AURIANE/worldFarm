export function Stepper({ step }: { step: number }) {
  const steps = ["Infos", "Localisation", "Validation"];

  return (
    <div className="flex flex-row  gap-2 justify-between">
      {steps.map((s, i) => (
        <div key={i} className="flex flex-col gap-1 flex-1 text-center">
          
          {/* Cercle de l'étape */}
          <div
            className={`w-30 h-1 mx-auto rounded-full flex items-center justify-center
              ${i <= step ? "bg-white text-white" : "bg-gray-600 text-gray-600"}`}
          >
            
          </div>

          {/* Label */}
          <p className="text-xs mt-1">{s}</p>
        </div>
      ))}
    </div>
  );
}