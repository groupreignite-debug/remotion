import { loadFont } from "@remotion/fonts";
import { staticFile } from "remotion";

// Alexandria (SIL OFL), Arabic + Latin subsets, weights 300–900, from the reference build's assets.
// loadFont() holds the render until every face is loaded.
const ARABIC =
  "U+0600-06FF, U+0750-077F, U+08A0-08FF, U+200C-200E, U+FB50-FDFF, U+FE70-FEFC";
const LATIN = "U+0000-00FF, U+2000-206F, U+20AC, U+2122, U+2212, U+2215";

for (const weight of ["300", "400", "500", "700", "800", "900"]) {
  loadFont({
    family: "Alexandria",
    url: staticFile(`fonts/alexandria-arabic-${weight}-normal.woff2`),
    weight,
    unicodeRange: ARABIC,
  });
  loadFont({
    family: "Alexandria",
    url: staticFile(`fonts/alexandria-latin-${weight}-normal.woff2`),
    weight,
    unicodeRange: LATIN,
  });
}
