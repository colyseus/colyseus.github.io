import React, { useEffect, useState } from "react";

interface AddedLocation {
  location: any;
  plan: any;
  numInstances: number;
  scaleStrategy: string;
  price: number;
}

function DeploymentLocation(props: AddedLocation) {
  return (
    <div className="flex flex-cols items-center space-x-4 min-w-">
      <div className="font-medium text-base">
        ${props.price}<small>/mo</small>
      </div>
      <div>
        <h4>{props.location.description}</h4>
        <p>{(props.numInstances > 1) ? <span className="text-semibold">{props.numInstances}x </span> : ""}{props.plan.description}</p>
      </div>
    </div>
  );
}

export default function SimulatePriceComponent() {
  const [tierNames, setTierNames] = useState<any>([]);
  const [plans, setPlans] = useState<any>([]);

  const [regions, setRegions] = useState<any>({ none: "Loading..." });
  const [locations, setLocations] = useState<any>([{ id: "none", region_code: "none", description: "Loading..."}]);

  const [selectedLocation, setSelectedLocation] = useState<any>("");
  const [selectedPlan, setSelectedPlan] = useState<string>("");
  const [selectedNumInstances, setSelectedNumInstances] = useState<number>(1);
  const [selectedScaleStrategy, setSelectedScaleStrategy] = useState<string>("vertical");

  const [addedLocations, setAddedLocations] = useState<AddedLocation[]>([]);
  const [addedLocationIds, setAddedLocationIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/prices").then((res) => {
      res.json().then((data) => {
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
      });
    });
  }, []);

  const onChangeLocation = (e: any) => {
    setSelectedLocation(e.target.value);
    // auto-select first plan from this location
    const fistPlanFromLocation = plans.filter((plan: any) => plan.locations.indexOf(e.target.value) >= 0)[0];
    if (fistPlanFromLocation) {
      setSelectedPlan(fistPlanFromLocation.id);
    }
  };

  const onChangePlan = (e: any) => {
    setSelectedPlan(e.target.value);
  };

  const onChangeScaleStrategy = (e: any) => {
    if (e.target.value === "vertical") {
      setSelectedNumInstances(1);

    } else if (selectedNumInstances === 1) {
      setSelectedNumInstances(2);
    }
    setSelectedScaleStrategy(e.target.value);
  };

  const onChangeNumInstances = (e: any) => {
    setSelectedNumInstances(e.target.value);
  };

  const getEstimation = (ratio) => {
    const plan = plans.find((plan) => plan.id === selectedPlan);
    const ccu = (plan.cpu_count * ratio) * selectedNumInstances;
    return `CCU: ${ccu} · DAU: ${(ccu * 4 * 24).toLocaleString()} · MAU: ${(ccu * 4 * 24 * 30).toLocaleString()}`;
  };

  const getPrice = () => {
    if (!selectedPlan) { return 0; }

    const plan = plans.find((plan) => plan.id === selectedPlan);
    const redisPlan = plans.find((p) => plan.tier === p.tier);

    const price = plan.price * selectedNumInstances + (
      selectedScaleStrategy === "horizontal"
        ? 100 + (redisPlan.price)
        : 0
    );

    return price;
  };

  const onAddLocation = () => {
    setAddedLocationIds([ ...addedLocationIds, selectedLocation]);

    setAddedLocations([ ...addedLocations, {
      location: locations.find((location) => location.id === selectedLocation),
      plan: plans.find((plan) => plan.id === selectedPlan),
      numInstances: selectedNumInstances,
      scaleStrategy: selectedScaleStrategy,
      price: getPrice(),
    }]);

    // reset
    setSelectedLocation("");
    setSelectedPlan("");
    setSelectedNumInstances(1);
    setSelectedScaleStrategy("vertical");
  }

  return (
    <div>
      <h1 className="text-3xl text-center">Pricing Simulator</h1>

      <div className="flex flex-col mt-4 space-y-4">
        <div className="space-y-1">
          <span className="font-semibold block">Location</span>
          <select className="border p-3 rounded" onChange={onChangeLocation} placeholder="Select a location" value={selectedLocation}>
            <option className="hidden" value="">Select a location</option>
            {Object.keys(regions).map((region_code: any) => (
              <optgroup key={region_code} label={regions[region_code]} >
                {locations.filter((location) => location.region_code === region_code).map((location: any) => {
                  return (
                    <option key={location.id} value={location.id} disabled={addedLocationIds.indexOf(location.id) >= 0}>
                      {location.description}
                    </option>
                  );
                })}
                </optgroup>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <span className="font-semibold block">Plan</span>
          <select disabled={!selectedLocation} className="border p-3 rounded disabled:bg-gray-100" onChange={onChangePlan} value={selectedPlan} placeholder="Select plan">
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
              : <option className="hidden">Select plan</option> }
          </select>
        </div>

        <div className="space-y-1">
          <span className="font-semibold block">Scale strategy</span>

          <div>
            <input type="radio" onChange={onChangeScaleStrategy} checked={selectedScaleStrategy === "vertical"} name="scale_strategy" id="scale_vertical" value="vertical" className="mr-2" />
            <label htmlFor="scale_vertical">Single instance - Scale vertically</label>
          </div>

          <div>
            <input type="radio" onChange={onChangeScaleStrategy} checked={selectedScaleStrategy === "horizontal"} name="scale_strategy" id="scale_horizontal" value="horizontal" className="mr-2" />
            <label htmlFor="scale_horizontal">Cluster - Scale horizontally <span className="text-blue-600">(+$100<small>/mo</small>)</span></label>

            <div className={`scaling-num-instances col-span-2 pb-4 my-4 ${(selectedScaleStrategy !== "horizontal") ?  "hidden" : ""}`}>
                <label className="font-semibold block">Number of instances</label>
                <input type="range" onInput={onChangeNumInstances} value={selectedNumInstances} min="1" max="12" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />

                <div className="flex justify-between text-xs text-gray-600 mt-1 px-1">
                    <span className="pl-0.5 ">1</span>
                    <span className=" w-2">2</span>
                    <span className=" w-2">3</span>
                    <span className=" w-2">4</span>
                    <span className=" w-2">5</span>
                    <span className=" w-2">6</span>
                    <span className=" w-2">7</span>
                    <span className=" w-2">8</span>
                    <span className=" w-2">9</span>
                    <span className=" w-2">10</span>
                    <span className=" w-2">11</span>
                    <span className="pr-0.5 w-2">12</span>
                </div>
            </div>
          </div>

          {(selectedPlan)
            ? <div className="pt-2">
                <div className="col-span-2 text-sm text-white bg-purple-600 rounded-xl p-4 ">
                  <label className="inline-block text-white font-semibold mb-1">Capacity estimation</label>
                  <p className="capacity-estimation" data-template="">

                    <span className="font-medium text-red-400">High CPU Usage</span>
                    <span> · {getEstimation(80)}</span>
                    <br />

                    <span className="font-medium text-yellow-400">Moderate CPU Usage</span>
                    <span> · {getEstimation(500)}</span>
                    <br />

                    <span className="font-medium text-green-400">Minimal CPU Usage</span>
                    <span> · {getEstimation(3000)}</span>

                  </p>
                  <p className="text-xs mt-1 opacity-80">
                      * The actual capacity may be higher or lower than estimated, depending on the actual CPU usage of your room's code.
                  </p>
                </div>
              </div>
            : null }
        </div>
      </div>

      <button onClick={onAddLocation} disabled={!selectedPlan} className="block mt-4 w-full rounded p-4 text-white bg-blue-600 transition-all hover:bg-blue-700 active:bg-blue-800 disabled:bg-gray-400">
        Add location: ${getPrice()}<small>/mo</small>
      </button>

      {(addedLocations.length > 0)
        ?
          <div>
            <div className="border-t border-gray-300 mt-6 pt-6 space-y-3 text-sm">
              {addedLocations.map((addedLocation: any, i) => (
                <DeploymentLocation key={i} {...addedLocation} />
              ))}
            </div>
            <div className="border-t border-gray-300 mt-6 pt-6 font-medium text-xl text-center">
              Total: ${addedLocations.reduce((acc, added) => {
                return acc + added.price;
              }, 0)}<small>/mo</small>
            </div>
          </div>
        : null }

    </div>

  );
}
