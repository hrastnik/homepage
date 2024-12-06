export async function Labineca() {
  async function getLabineca() {
    const response = await fetch("https://www.facebook.com/labineca/", {
      headers: {
        accept: "text/html",
        "cache-control": "max-age=0",
        "sec-fetch-site": "same-origin",
      },
      // Cache request for 2 hours
      next: { revalidate: 7200 },
    });
    const html = await response.text();
    const imageRegex = /{"uri":[^}]*jpg[^}]*}/gm;
    const imageListRaw = html.match(imageRegex) ?? [];
    const imageListParsed = imageListRaw.map((image) => JSON.parse(image));

    const postImageList = imageListParsed
      .filter((image) => {
        return "width" in image && "height" in image && "uri" in image;
      })
      .filter((image) => {
        return 1600 < image.width && image.width < 1650;
      }) as { uri: string; width: number; height: number }[];

    const labinecaURI = postImageList[0]?.uri;

    return {
      menuURI: labinecaURI,
    };
  }

  const labineca = await getLabineca();

  return (
    <div className="flex flex-col flex-1 bg-white shadow-lg rounded-lg p-2">
      <div className="flex justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Labineca</h2>
          <a href="tel:+38552856280">
            <h3 className="text-l font-semibold text-gray-800 mb-2">
              052 856 280
            </h3>
          </a>
        </div>
        <img src={"/labineca-qr.svg"} alt="Labineca QR" className="w-16 h-16" />
      </div>

      <div className="flex-1 overflow-hidden relative">
        <img
          src={labineca.menuURI}
          alt="Labineca Menu"
          className="absolute top-0 left-0 w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
