import * as cheerio from "cheerio";

export async function Weather() {
  async function getWeather() {
    const response = await fetch(
      "https://prognoza.hr/3dslika2_print_tp.php?Code=Labin",
      {
        // Cache request for 30 minutes
        next: { revalidate: 1800 },
      }
    );
    const html = await response.text();
    const $ = cheerio.load(html);
    const weatherHTML = $("table").first().parent().html();

    if (typeof weatherHTML !== "string") {
      throw new Error("Weather data is not available");
    }

    return { weatherHTML };
  }

  const weather = await getWeather();

  return (
    <div className="flex-[5] flex">
      <div
        className="weather-table flex-1 bg-white shadow-lg rounded-lg p-2"
        dangerouslySetInnerHTML={{ __html: weather.weatherHTML }}
      />
    </div>
  );
}