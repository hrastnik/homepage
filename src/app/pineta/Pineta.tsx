import * as cheerio from "cheerio";
import { Fragment } from "react";

export async function Pineta() {
  async function getPineta() {
    const response = await fetch(
      "https://www.pizzeria-pineta-labin.com.hr/restauracja/pizzeria-pineta-labin",
      {
        // Cache request for 1 hour
        next: { revalidate: 3600 },
      }
    );
    const html = await response.text();
    const $ = await cheerio.load(html);
    const menu = $("#menu-dnevna-ponuda-marendi");
    const dishElementList = menu.find("li");

    const dishList = dishElementList
      .map((_index, element) => {
        const elementCheerio = $(element);
        return {
          imageURL: elementCheerio.find("img").attr("src"),
          price: elementCheerio.find(".add-button").text().trim(),
          name: elementCheerio.find("h4").text().trim(),
        };
      })
      .toArray();

    return { dishList };
  }

  const pineta = await getPineta();

  return (
    <div className="flex flex-1 gap-4">
      <div className="flex flex-1 flex-col bg-white shadow-lg rounded-lg p-2">
        <div className="flex justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800">Pineta</h2>
            <a href="tel:+38552421201">
              <h3 className="text-l font-semibold text-gray-800 mb-2">
                052 421 201
              </h3>
            </a>
          </div>
          <img src={"/pineta-qr.svg"} alt="Pineta QR" className="w-16 h-16" />
        </div>
        <div className="flex-1 relative">
          <div className="absolute top-0 left-0 w-full h-full flex flex-col overflow-hidden">
            <div className="marquee">
              {pineta.dishList.map((dish, index) => {
                return (
                  <Fragment key={`${index} ${dish.name}`}>
                    <div className="flex items-center bg-gray-50 p-2 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                      {dish.imageURL ? (
                        <img
                          src={dish.imageURL}
                          alt={dish.name}
                          className="w-14 h-14 rounded-md object-cover mr-4"
                        />
                      ) : (
                        <div className="w-14 h-14 flex items-center justify-center bg-gray-200 text-gray-400 rounded-md mr-4">
                          No Image
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="text-md font-medium text-gray-700">
                          {index + 1}. {dish.name}
                        </h3>
                        <p className="text-gray-500">{dish.price}</p>
                      </div>
                    </div>
                    <div className="h-2" />
                  </Fragment>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
