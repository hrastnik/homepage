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
      // Cache request for 2 minutes
      cache: "force-cache",
      next: { revalidate: 120 },
    });
    const html = await response.text();

    const imageRegex = /{"uri":[^}]*jpg[^}]*}/gm;
    const imageListRaw = html.match(imageRegex) ?? [];

    console.log(
      "Labineca imageListRaw (regex matches):",
      imageListRaw.length,
      "images"
    );

    const imageListParsed = imageListRaw.map((image) => {
      try {
        return JSON.parse(image);
      } catch (error) {
        console.log("Parsing error:", error);
        return { width: 0, height: 0, uri: "" };
      }
    });

    console.log("Labineca imageListParsed:", imageListParsed.length, "images");

    const imageListWithWidthAndHeight: {
      uri: string;
      width: number;
      height: number;
    }[] = imageListParsed.filter((image) => {
      return "width" in image && "height" in image && "uri" in image;
    });

    console.log(
      "Labineca imageListWithWidthAndHeight:",
      imageListWithWidthAndHeight.length,
      "images"
    );

    const postImageList = imageListWithWidthAndHeight.filter((image) => {
      return 540 < image.width;
    });

    console.log("Labineca postImageList:", postImageList.length, "images");
    console.log("Images: ", postImageList);

    const latestPost = _.maxBy(postImageList, (image) => {
      const uri = image.uri;
      // https://scontent.fzag1-2.fna.fbcdn.net/v/t39.30808-6/469703921_1310865936535795_8844515100120680089_n.jpg?_nc_cat=110&ccb=1-7&_
      // We want to match `469703921_1310865936535795_8844515100120680089_n.jpg`
      // then extract the middle number `1310865936535795`
      const regex = /\d*_(\d*)_\d*_n.jpg/;
      const match = uri.match(regex);
      const id = Number(match ? match[1] : "0");
      return id;
    });

    const labinecaURI = latestPost?.uri;

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
        <img
          src={labineca.menuURI}
          alt="Labineca Menu"
          className="absolute top-0 left-0 w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
