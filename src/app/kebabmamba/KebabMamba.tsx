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

// Tailwind background color palette (soft pastels) will be cycled per dish
const bgPalette: string[] = [
  "bg-rose-100",
  "bg-orange-100",
  "bg-amber-100",
  "bg-yellow-100",
  "bg-lime-100",
  "bg-green-100",
  "bg-emerald-100",
  "bg-teal-100",
  "bg-cyan-100",
  "bg-sky-100",
  "bg-blue-100",
  "bg-indigo-100",
  "bg-violet-100",
  "bg-fuchsia-100",
  "bg-pink-100",
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
          {/* 1 px hrozontal line */}

          {/* marquee container clones content if taller than parent */}
          <div className="marquee">
            <div className="h-px w-full bg-gray-300 my-1" />

            <div className="flex w-full gap-4">
              {/* Left column */}
              <div className="flex-1 flex flex-col">
                {leftColumn.map((dish, index) => (
                  <Fragment key={`l-${index}-${dish.name}`}>
                    <DishItem dish={dish} index={index} />
                    <div className="h-1" />
                  </Fragment>
                ))}
              </div>
              {/* Right column */}
              <div className="flex-1 flex flex-col">
                {rightColumn.map((dish, index) => (
                  <Fragment key={`r-${index}-${dish.name}`}>
                    <DishItem dish={dish} index={midpoint + index} />
                    <div className="h-1" />
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

function DishItem({ dish, index }: { dish: Dish; index: number }) {
  return (
    <div
      className={`flex items-center ${
        bgPalette[index % bgPalette.length]
      } p-1 rounded-lg shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex-1">
        <h3 className="text-md font-medium text-gray-700">
          {index + 1}. {dish.name} - {dish.price}
        </h3>
      </div>
    </div>
  );
}
