import * as cheerio from "cheerio";
import { Fragment } from "react";
import { Animate } from "../Animate";

export async function Pineta() {
  async function getPineta() {
    const response = await fetch(
      "https://www.pizzeria-pineta-labin.com.hr/restauracja/pizzeria-pineta-labin",
      { cache: "no-store" }
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

  // const isMonday = new Date().getDay() === 1;
  const isClosed = false;

  return (
    <div className="flex flex-1 gap-4">
      <div className="flex flex-1 flex-col bg-white shadow-lg rounded-lg p-2">
        <div className="flex justify-between">
          <div>
            <a href="https://www.pizzeria-pineta-labin.com.hr/restauracja/pizzeria-pineta-labin">
              <h2 className="text-2xl font-semibold text-gray-800">Pineta</h2>
            </a>
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
              {isClosed ? (
                <div className="text-center text-gray-500 text-md py-16">
                  Pineta ne radi ponedjeljkom
                </div>
              ) : (
                pineta.dishList.map((dish, index) => {
                  return (
                    <Fragment key={`${index} ${dish.name}`}>
                      <div className="flex bg-gray-50 p-1 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                        {dish.imageURL ? (
                          <img
                            src={dish.imageURL}
                            alt={dish.name}
                            className="w-10 h-10 rounded-md object-cover mr-4"
                          />
                        ) : (
                          <div className="w-10 h-10 flex items-center justify-center bg-gray-200 text-gray-400 rounded-md mr-4">
                            No Image
                          </div>
                        )}
                        <div className="flex-1 flex">
                          <h3 className="flex-1 text-md font-medium text-gray-700">
                            {index + 1}. {dish.name}
                          </h3>

                          <p className="ml-1 text-gray-500">{dish.price}</p>
                        </div>
                      </div>
                      <div className="h-1" />
                    </Fragment>
                  );
                })
              )}
            </div>
            <Animate></Animate>
          </div>
        </div>
      </div>
    </div>
  );
}
