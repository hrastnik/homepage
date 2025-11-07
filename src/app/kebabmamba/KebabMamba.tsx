import { Fragment } from "react";
import { Animate } from "../Animate";

interface Dish {
  name: string;
  price: string;
}

const dishList: Dish[] = [
  { name: "Kebab tortilla", price: "6.5 EUR" },
  { name: "Kebab lepinja", price: "6 EUR" },
  { name: "Kebab box + pommes", price: "8.5 EUR" },
  { name: "Chicken nuggets + pommes", price: "6 EUR" },
  { name: "Hot dog", price: "3.5 EUR" },
  { name: "Pommes", price: "4 EUR" },
  { name: "Plata Mamba", price: "14.5 EUR" },
  { name: "Topli sendvič šunka/pikant", price: "4.5 EUR" },
  { name: "Čevapi", price: "9 EUR" },
  { name: "Pizza margherita", price: "8 EUR" },
  { name: "Pizza mješana", price: "9 EUR" },
  { name: "Pizza diavola", price: "10 EUR" },
  { name: '"Mamba" pizza', price: "13.5 EUR" },
];

export function KebabMamba() {
  // Split dishes into two roughly equal columns
  const midpoint = Math.ceil(dishList.length / 2);
  const leftColumn = dishList.slice(0, midpoint);
  const rightColumn = dishList.slice(midpoint);

  return (
    <div className="flex flex-col flex-1 bg-white shadow-lg rounded-lg p-2">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Kebab Mamba</h2>
        </div>
      </div>
      <div className="flex-1 relative">
        <div className="absolute top-0 left-0 w-full h-full flex flex-col overflow-hidden">
          {/* marquee container clones content if taller than parent */}
          <div className="marquee">
            <div className="flex w-full gap-4">
              {/* Left column */}
              <div className="flex-1 flex flex-col">
                {leftColumn.map((dish, index) => (
                  <Fragment key={`l-${index}-${dish.name}`}>
                    <div className="flex items-center bg-gray-50 p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <h3 className="text-md font-medium text-gray-700">
                          {index + 1}. {dish.name}
                        </h3>
                        <p className="text-gray-500">{dish.price}</p>
                      </div>
                    </div>
                    <div className="h-2" />
                  </Fragment>
                ))}
              </div>
              {/* Right column */}
              <div className="flex-1 flex flex-col">
                {rightColumn.map((dish, index) => (
                  <Fragment key={`r-${index}-${dish.name}`}>
                    <div className="flex items-center bg-gray-50 p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <h3 className="text-md font-medium text-gray-700">
                          {midpoint + index}. {dish.name}
                        </h3>
                        <p className="text-gray-500">{dish.price}</p>
                      </div>
                    </div>
                    <div className="h-2" />
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
          <Animate />
        </div>
      </div>
    </div>
  );
}
