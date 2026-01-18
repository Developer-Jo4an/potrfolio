import "../../../../application/styles/main.scss";
import {MainLayout} from "../../../../application/layouts/main-layout";

export const metadata = {
  title: "portfolio | main page",
  description: "portfolio",
  viewport: "width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no, viewport-fit=cover, target-densitydpi=medium-dpi",
};

export default function RootLayout({children}) {
  return (
    <html lang={"ru"}>
    <body>
    <MainLayout>
      {children}
    </MainLayout>
    </body>
    </html>
  );
}
