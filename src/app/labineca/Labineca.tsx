import _ from "lodash";

export async function Labineca() {
  async function getLabineca() {
    console.log("Fetching Labineca");

    const response = await fetch("https://www.facebook.com/labineca/", {
      headers: {
        accept: "text/html",
        "cache-control": "max-age=0",
        "sec-fetch-site": "same-origin",
        "user-agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
      },
      cache: "no-store",
    });
    const html = await response.text();

    // Regex to pull the photo id (the middle number) out of a Facebook photo
    // URL, e.g. .../t39.99422-6/734756496_1035827199201917_4616..._n.png
    const PHOTO_URL = /\/t39\.[\d-]+\/\d+_(\d+)_\d+_n\.(?:jpg|png)/;

    // Find the id of the most recently posted photo.
    //
    // Facebook embeds a "PHOTOS" profile tile whose photo grid is ordered
    // newest-first; its first entry is the latest post — for Labineca that's the
    // daily "PONUDA DANA" menu (it's exactly what the browser renders right
    // under the cover photo). We anchor on that section and read the id of its
    // first photo.
    //
    // We rely on Facebook's own ordering rather than on photo ids or content
    // types, because neither is stable: ids are not monotonic across Facebook's
    // image types (e.g. t39.99422-6 vs t39.30808-6) and the menu's type changes
    // over time. Sorting by "highest id" or filtering by a fixed type both end
    // up showing stale closed-for-holiday announcements.
    function getLatestPhotoId() {
      const anchor = html.indexOf('"profile_tile_section_type":"PHOTOS"');
      if (anchor === -1) return null;
      // In these JSON blocks slashes are escaped (\/), so unescape a window
      // after the anchor before matching the first photo URL.
      const section = html
        .slice(anchor, anchor + 8000)
        .replace(/\\\//g, "/")
        .replace(/\\u0026/g, "&");
      return section.match(PHOTO_URL)?.[1] ?? null;
    }

    const latestPhotoId = getLatestPhotoId();

    // Facebook lists the same photo at several resolutions as {"uri":...} blobs.
    // Collect every variant of the latest photo and show the largest one.
    const imageRegex = /{"uri":[^}]*jpg[^}]*}/gm;
    const variants = (html.match(imageRegex) ?? [])
      .map((blob) => {
        try {
          return JSON.parse(blob) as { uri?: string; width?: number };
        } catch (error) {
          console.log("Parsing error:", error);
          return { uri: "", width: 0 };
        }
      })
      .map((img) => ({
        uri: img.uri ?? "",
        width: Number(img.width) || 0,
        id: (img.uri ?? "").match(PHOTO_URL)?.[1] ?? "",
      }))
      .filter((img) => img.uri && img.id === latestPhotoId);

    console.log(
      "Labineca | latest photo id:",
      latestPhotoId,
      "| variants:",
      variants.length,
    );

    const labinecaURI = _.maxBy(variants, (image) => image.width)?.uri;

    return {
      menuURI: labinecaURI,
    };
  }

  const labineca = await getLabineca();

  console.log("Labineca menuURI:", labineca.menuURI);

  return (
    <div className="flex flex-col flex-1 bg-white shadow-lg rounded-lg p-2">
      <div className="flex justify-between">
        <div>
          <a href="https://www.facebook.com/labineca/">
            <h2 className="text-2xl font-semibold text-gray-800">Labineca</h2>
          </a>
          <a href="tel:+38552856280">
            <h3 className="text-l font-semibold text-gray-800 mb-2">
              052 856 280
            </h3>
          </a>
        </div>
        <img src={"/labineca-qr.svg"} alt="Labineca QR" className="w-16 h-16" />
      </div>

      <div className="flex-1 overflow-hidden relative">
        {labineca.menuURI ? (
          <img
            src={labineca.menuURI}
            alt="Labineca Menu"
            className="absolute top-0 left-0 w-full h-full object-contain"
          />
        ) : (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center text-gray-400 text-md">
            Trenutno nije dostupno
          </div>
        )}
      </div>
    </div>
  );
}
