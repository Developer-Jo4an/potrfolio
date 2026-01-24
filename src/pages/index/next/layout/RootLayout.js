import {MainLayout} from "@application/layouts/main-layout";
import "@application/styles/main.scss";

function RootLayout({children}) {
  return (
    <html lang={"ru"}>
    <body>
    <MainLayout>{children}</MainLayout>
    </body>
    </html>
  );
}

export {RootLayout};
