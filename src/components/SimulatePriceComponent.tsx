import React, { useEffect, useState } from "react";

const PRICES_URL = "https://cloud-prod.colyseus.io/api/prices";
const CLUSTER_FEE = 100;
const MAX_INSTANCES = 12;

interface AddedLocation {
  location: any;
  plan: any;
  numInstances: number;
  scaleStrategy: string;
  price: number;
}

// CCU a single vCPU carries, by how heavy the room logic is.
const WORKLOADS = [
  { label: "Lightweight", dot: "bg-green-400", ratio: 3000 },
  { label: "Moderate", dot: "bg-yellow-400", ratio: 500 },
  { label: "Resource-intensive", dot: "bg-red-400", ratio: 80 },
];

const money = (n: number) => (Number.isInteger(n) ? String(n) : n.toFixed(2));

const selectClass =
  "w-full appearance-none rounded-lg border border-white/10 bg-white/5 pl-3.5 pr-10 py-3 text-white transition-colors " +
  "hover:border-white/20 focus:border-blue-400/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 " +
  "disabled:bg-white/[0.02] disabled:text-gray-500 disabled:hover:border-white/10 disabled:cursor-not-allowed";

function Chevron() {
  return (
    <svg className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export default function SimulatePriceComponent({ title = "Pricing Simulator" }) {
  const [tierNames, setTierNames] = useState<any>([]);
  const [plans, setPlans] = useState<any>([]);
  const [failed, setFailed] = useState(false);

  const [regions, setRegions] = useState<any>({ none: "Loading..." });
  const [locations, setLocations] = useState<any>([{ id: "none", region_code: "none", description: "Loading..."}]);

  const [selectedLocation, setSelectedLocation] = useState<any>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedNumInstances, setSelectedNumInstances] = useState<number>(1);
  const [selectedScaleStrategy, setSelectedScaleStrategy] = useState<string>("vertical");

  const [addedLocations, setAddedLocations] = useState<AddedLocation[]>([]);

  useEffect(() => {
    fetch(PRICES_URL)
      .then((res) => res.json())
      .then((data) => {
        setPlans(data.plans);
        setLocations(data.locations);

        const allTierNames: any = {};
        data.plans.forEach((plan: any) => {
          if (!allTierNames[plan.tier]) {
            allTierNames[plan.tier] = plan.tier;
          }
        });
        setTierNames(allTierNames);

        const allRegions: any = {};
        data.locations.forEach((location: any) => {
          if (!allRegions[location.region_code]) {
            allRegions[location.region_code] = location.region;
          }
        });
        setRegions(allRegions);
      })
      .catch(() => setFailed(true));
  }, []);

  const addedLocationIds = addedLocations.map((added) => added.location.id);
  const isCluster = selectedScaleStrategy === "horizontal";

  const onChangeLocation = (e: any) => {
    setSelectedLocation(e.target.value);
    // auto-select first plan from this location
    const fistPlanFromLocation = plans.filter((plan: any) => plan.locations.indexOf(e.target.value) >= 0)[0];
    if (fistPlanFromLocation) {
      setSelectedPlan(fistPlanFromLocation.id);
    }
  };

  const onChangeScaleStrategy = (strategy: string) => {
    if (strategy === "vertical") {
      setSelectedNumInstances(1);

    } else if (selectedNumInstances === 1) {
      setSelectedNumInstances(2);
    }
    setSelectedScaleStrategy(strategy);
  };

  const getCCU = (ratio: number) => {
    const plan = plans.find((plan: any) => plan.id === selectedPlan);
    return (plan.cpu_count * ratio) * selectedNumInstances;
  };

  const getPrice = () => {
    if (!selectedPlan) { return 0; }

    const plan = plans.find((plan: any) => plan.id === selectedPlan);
    const redisPlan = plans.find((p: any) => plan.tier === p.tier);

    return plan.price * selectedNumInstances + (isCluster ? CLUSTER_FEE + redisPlan.price : 0);
  };

  const onAddLocation = () => {
    setAddedLocations([ ...addedLocations, {
      location: locations.find((location: any) => location.id === selectedLocation),
      plan: plans.find((plan: any) => plan.id === selectedPlan),
      numInstances: selectedNumInstances,
      scaleStrategy: selectedScaleStrategy,
      price: getPrice(),
    }]);

    // reset
    setSelectedLocation("");
    setSelectedPlan("");
    setSelectedNumInstances(1);
    setSelectedScaleStrategy("vertical");
  };

  const onRemoveLocation = (index: number) => {
    setAddedLocations(addedLocations.filter((_, i) => i !== index));
  };

  const total = addedLocations.reduce((acc, added) => acc + added.price, 0);

  const strategies = [
    { value: "vertical", name: "Single instance", hint: "Scale vertically" },
    { value: "horizontal", name: "Cluster", hint: "Scale horizontally", badge: "Beta", extra: `+$${CLUSTER_FEE}/mo` },
  ];

  if (failed) {
    return (
      <p className="text-gray-400 text-center py-6">
        Couldn't load the current prices. See them in the{" "}
        <a href="https://cloud.colyseus.io/" className="text-blue-300 hover:text-blue-200">Colyseus Cloud dashboard</a>.
      </p>
    );
  }

  return (
    <div>
      {(title && <h3 className="text-2xl font-semibold text-white mb-6">{title}</h3>)}

      <div className="flex flex-col space-y-5">
        <label className="block">
          <span className="block text-sm font-medium text-gray-300 mb-1.5">Location</span>
          <span className="relative block">
            <select className={selectClass} onChange={onChangeLocation} value={selectedLocation}>
              <option className="hidden" value="">Select a location</option>
              {Object.keys(regions).map((region_code: any) => (
                <optgroup key={region_code} label={regions[region_code]} >
                  {locations.filter((location: any) => location.region_code === region_code).map((location: any) => {
                    return (
                      <option key={location.id} value={location.id} disabled={addedLocationIds.indexOf(location.id) >= 0}>
                        {location.description}
                      </option>
                    );
                  })}
                  </optgroup>
              ))}
            </select>
            <Chevron />
          </span>
        </label>

        <label className="block">
          <span className="block text-sm font-medium text-gray-300 mb-1.5">Plan</span>
          <span className="relative block">
            <select disabled={!selectedLocation} className={selectClass} onChange={(e) => setSelectedPlan(e.target.value)} value={selectedPlan}>
              {(selectedLocation)
                ? Object.keys(tierNames).map((tierName: any) => (
                    <optgroup key={tierName} label={tierName}>
                      {plans
                        .filter((plan: any) => (
                          plan.tier === tierName &&
                          plan.locations.indexOf(selectedLocation) >= 0)
                        )
                        .map((plan: any) => {
                          return (
                            <option key={plan.id} value={plan.id}>
                              {plan.description}
                            </option>
                          );
                      })}
                    </optgroup>
                  ))
                : <option className="hidden">Select a location first</option> }
            </select>
            <Chevron />
          </span>
        </label>

        <fieldset>
          <legend className="block text-sm font-medium text-gray-300 mb-1.5">Scale strategy</legend>
          <div className="grid grid-cols-2 gap-2">
            {strategies.map((strategy) => {
              const checked = selectedScaleStrategy === strategy.value;
              return (
                <label key={strategy.value} className={`relative cursor-pointer rounded-lg border px-3.5 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500/40 ${checked ? "border-blue-400/60 bg-blue-500/10" : "border-white/10 bg-white/[0.03] hover:border-white/20"}`}>
                  <input type="radio" name="scale_strategy" value={strategy.value} checked={checked} onChange={() => onChangeScaleStrategy(strategy.value)} className="sr-only" />
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1 text-white font-medium">
                    {strategy.name}
                    {strategy.badge && <span className="rounded bg-blue-500/20 border border-blue-400/30 px-1.5 py-px text-[10px] font-semibold uppercase tracking-wide text-blue-200">{strategy.badge}</span>}
                  </span>
                  <span className="block text-xs sm:text-sm text-gray-400 mt-0.5">
                    {strategy.hint}
                    {strategy.extra && <span className="text-blue-300"> · {strategy.extra}</span>}
                  </span>
                </label>
              );
            })}
          </div>
        </fieldset>

        {isCluster && (
          <label className="block">
            <span className="flex items-baseline justify-between text-sm font-medium text-gray-300 mb-2">
              Number of instances
              <span className="text-white text-base tabular-nums">{selectedNumInstances}</span>
            </span>
            <input type="range" onChange={(e) => setSelectedNumInstances(Number(e.target.value))} value={selectedNumInstances} min="1" max={MAX_INSTANCES} className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500" />
            <span className="flex justify-between text-xs text-gray-600 mt-1 px-0.5" aria-hidden="true">
              <span>1</span>
              <span>{MAX_INSTANCES}</span>
            </span>
          </label>
        )}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 rounded-xl border border-white/10 bg-white/[0.03] p-3 sm:pl-5 sm:pr-2.5 sm:py-2.5">
        <p aria-live="polite" className="px-1 sm:px-0">
          <span className="block text-xs text-gray-500">This location</span>
          <span className="text-2xl font-semibold text-white tabular-nums">${money(getPrice())}</span>
          <span className="text-sm text-gray-400">/mo</span>
        </p>
        <button onClick={onAddLocation} disabled={!selectedPlan} className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-lg px-4 py-3 font-medium text-white bg-blue-600 transition-colors hover:bg-blue-500 active:bg-blue-700 disabled:bg-white/10 disabled:text-gray-500 disabled:cursor-not-allowed">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
          Add location
        </button>
      </div>

      {(selectedPlan)
        ? <div className="mt-3 rounded-xl border border-white/5 bg-white/[0.02] p-3 sm:p-4 text-xs sm:text-sm">
            <p className="text-sm text-white font-medium mb-2">Capacity estimation</p>
            <table className="w-full tabular-nums">
              <thead>
                <tr className="text-xs text-gray-500">
                  <th className="text-left font-normal pb-1">Workload</th>
                  <th className="text-right font-normal pb-1">CCU</th>
                  <th className="text-right font-normal pb-1">DAU</th>
                  <th className="text-right font-normal pb-1">MAU</th>
                </tr>
              </thead>
              <tbody>
                {WORKLOADS.map((workload) => {
                  const ccu = getCCU(workload.ratio);
                  return (
                    <tr key={workload.label} className="border-t border-white/5 text-gray-300">
                      <th scope="row" className="text-left font-normal py-1.5">
                        <span className="flex items-center gap-2">
                          <span className={`w-1.5 h-1.5 shrink-0 rounded-full ${workload.dot}`}></span>
                          {workload.label}
                        </span>
                      </th>
                      <td className="text-right py-1.5 pl-2">{ccu.toLocaleString("en-US")}</td>
                      <td className="text-right py-1.5 pl-2">{(ccu * 4 * 24).toLocaleString("en-US")}</td>
                      <td className="text-right py-1.5 pl-2">{(ccu * 4 * 24 * 30).toLocaleString("en-US")}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <p className="text-xs mt-2 text-gray-500">
              Actual capacity varies based on your room's CPU usage.
            </p>
          </div>
        : null }

      {(addedLocations.length > 0)
        ? <div className="mt-6 border-t border-white/10 pt-5">
            <ul className="space-y-3 text-sm">
              {addedLocations.map((added, i) => (
                <li key={added.location.id} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-white">{added.location.description}</p>
                    <p className="text-gray-500 truncate">
                      {(added.numInstances > 1) ? `${added.numInstances}× ` : ""}{added.plan.description}
                    </p>
                  </div>
                  <span className="text-white font-medium tabular-nums whitespace-nowrap">${money(added.price)}<span className="text-gray-500 font-normal">/mo</span></span>
                  <button onClick={() => onRemoveLocation(i)} aria-label={`Remove ${added.location.description}`} className="p-1.5 rounded-md text-gray-500 hover:text-white hover:bg-white/5 transition-colors">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12" /></svg>
                  </button>
                </li>
              ))}
            </ul>
            <p className="flex items-baseline justify-between border-t border-white/10 mt-5 pt-5 text-white">
              <span className="font-medium">Total</span>
              <span><span className="text-3xl font-semibold tabular-nums">${money(total)}</span><span className="text-gray-400">/mo</span></span>
            </p>
          </div>
        : null }

    </div>
  );
}
