"use client";

export default function FuelWidget() {
  const fuels = [
    { type: "Petrol", price: 252.50, icon: "⛽" },
    { type: "Diesel", price: 262.50, icon: "🛢️" },
    { type: "Kerosene", price: 161.00, icon: "🪔" },
    { type: "LDO", price: 149.50, icon: "🔥" },
  ];

  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <span className="text-lg">⛽</span>
        <h3 className="font-heading text-sm font-bold">Fuel Prices</h3>
        <span className="ml-auto text-[10px] text-muted-foreground">PKR/Ltr</span>
      </div>
      <div className="divide-y divide-border">
        {fuels.map((fuel) => (
          <div
            key={fuel.type}
            className="flex items-center justify-between px-4 py-2.5 hover:bg-surface-hover transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm">{fuel.icon}</span>
              <span className="text-xs font-medium text-foreground">{fuel.type}</span>
            </div>
            <span className="text-xs font-bold text-foreground">
              Rs. {fuel.price}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
