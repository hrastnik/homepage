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

    const imageRegex = /{"uri":[^}]*jpg[^}]*}/gm;
    const imageListRaw = html.match(imageRegex) ?? [];

    console.log(
      "Labineca imageListRaw (regex matches):",
      imageListRaw.length,
      "images",
    );

    type ParsedImage = { uri: string; width: number; id: string };

    const imageListParsed = imageListRaw
      .map((image) => {
        try {
          return JSON.parse(image) as { uri?: string; width?: number };
        } catch (error) {
          console.log("Parsing error:", error);
          return { uri: "", width: 0 };
        }
      })
      .map((img): ParsedImage => {
        // Native Facebook photos are served under /t39.<...>/ and embed the
        // photo id as the middle number of <surface>_<photoId>_<hash>_n.<ext>,
        // e.g. .../t39.30808-6/469703921_1310865936535795_8844515..._n.jpg
        // The photo id grows over time, so the highest id is the most recently
        // posted photo (the daily "PONUDA DANA" menu).
        //
        // Notes that matter for picking the right image:
        // - The menu is sometimes a .png served as t39.99422-6, so we accept
        //   jpg AND png across any t39.* subtype (not only t39.30808-6 jpgs).
        // - We deliberately ignore /t51.*/ images (Instagram cross-posts); their
        //   ids use a different numbering scheme and are NOT comparable here.
        // - The page cover photo is also a t39 photo, but it has a lower id than
        //   the latest post, so "highest id" naturally skips it.
        const match = (img.uri ?? "").match(
          /\/t39\.[\d-]+\/\d+_(\d+)_\d+_n\.(?:jpg|png)/,
        );
        return {
          uri: img.uri ?? "",
          // Facebook serves the same photo at several resolutions; keep the
          // numeric width so we can later pick the largest variant per photo.
          width: Number(img.width) || 0,
          id: match ? match[1] : "",
        };
      })
      // Keep only real page photos (those with an extractable photo id).
      .filter((image) => image.id !== "");

    // The same photo appears multiple times at different sizes. Group by photo
    // id and keep the largest variant of each, so we always show a high-res
    // image regardless of which resolutions Facebook happened to include.
    const bestVariantPerPhoto = _.values(
      _.groupBy(imageListParsed, (image) => image.id),
    ).map((variants) => _.maxBy(variants, (image) => image.width)!);

    // Drop thumbnails / logos (the page avatar comes through at ~80px wide).
    const candidates = bestVariantPerPhoto.filter(
      (image) => image.width >= 500,
    );

    // Sort by photo id, newest first. Ids can exceed Number.MAX_SAFE_INTEGER,
    // so compare them as integers via BigInt rather than as Number/string.
    const sortedById = [...candidates].sort((a, b) =>
      a.id === b.id ? 0 : BigInt(a.id) > BigInt(b.id) ? -1 : 1,
    );

    console.log("Labineca | Found", sortedById.length, "candidate photos");
    console.log("Images: ", sortedById);

    const labinecaURI = sortedById[0]?.uri;

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
