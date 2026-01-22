import {RootLayout} from "./ui/layout/RootLayout";
import {Adjustable} from "./ui/main/Adjustable";
import {Template} from "./ui/template/Template";

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

export {layoutMetadata, Template, adjustableMetadata, viewport, RootLayout, Adjustable};
