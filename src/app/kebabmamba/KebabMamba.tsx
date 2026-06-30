import { Fragment } from "react";
import { Animate } from "../Animate";

interface Dish {
  name: string;
  price: string;
}

const dishList: Dish[] = [
  // Kebab
  { name: "Kebab tortilla", price: "€7" },
  { name: "Kebab lepinja", price: "€6.5" },
  { name: "Kebab box + pommes", price: "€8.5" },
  { name: "Pileca kebab salata", price: "€8" },

  // Pommes i nuggets
  { name: "Pommes", price: "€4" },
  { name: "Chicken nuggets + pommes", price: "€6.5" },

  // Special
  { name: "Mamba chicken roll", price: "€6.5" },

  // burgeri i cevapi
  { name: "Hamburger", price: "€7" },
  { name: "Cheeseburger", price: "€7" },
  { name: "5 čevapa u lepinji", price: "€6" },
  { name: "10 čevapa u lepinji", price: "€11" },

  // Sandwich
  { name: "Topli sendvič šunka sir", price: "€6" },
  { name: "Topli sendvič kulen sir", price: "€6" },
  { name: "Topli sendvič tuna sir", price: "€6.5" },
  { name: "Topli sendvič pršut sir", price: "€7" },

  // Pizze
  { name: "Pizza mamba", price: "€14" },
  { name: "Pizza margherita", price: "€8.5" },
  { name: "Pizza mješana", price: "€10" },
  { name: "Pizza fungi", price: "€9.5" },
  { name: "Pizza diavola", price: "€10.5" },
  { name: "Pizza salami", price: "€10" },
  { name: "Pizza pršut", price: "€12.5" },
  { name: "Pizza tuna", price: "€12" },
  { name: "Pizza seljačka", price: "€12.5" },

  // Calzone
  { name: "Calzone mamba", price: "€12" },
  { name: "Calzone tuna", price: "9.5" },
  { name: "Calzone šunka", price: "9.5" },
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
      <div className="flex-1 flex">
        <h3 className="flex-1 text-sm font-medium text-gray-700">
          {index + 1}. {dish.name}
        </h3>
        <h3 className="ml-1 text-sm font-medium text-gray-700">{dish.price}</h3>
      </div>
    </div>
  );
}
