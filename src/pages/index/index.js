import {RootLayout} from "./next/layout/RootLayout";
import {Adjustable} from "./next/page/Adjustable";
import {Template} from "./next/template/Template";
import {NotFound} from "./next/not-found/NotFound";
import {Error} from "./next/error/Error";
import {Loading} from "./next/loading/Loading";

const layoutMetadata = {
  title: "portfolio | main page",
  description: "portfolio",
};

const viewport = {
  themeColor: "black",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  target: "densitydpi=medium-dpi",
};

const adjustableMetadata = {};

export {layoutMetadata, Template, adjustableMetadata, viewport, NotFound, Error, Loading, RootLayout, Adjustable};
