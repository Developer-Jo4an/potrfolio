import {MainLayout} from "@application/layouts/main-layout";
import "@application/styles/main.scss";

export const metadata = {
  title: "portfolio | main page",
  description: "portfolio",
};

export const viewport = {
  themeColor: "black",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  target: "densitydpi=medium-dpi",
};

export async function RootLayout({children}) {
  return (
    <html lang={"ru"}>
      <body>
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  );
}
