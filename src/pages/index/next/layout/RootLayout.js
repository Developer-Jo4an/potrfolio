import {MainLayout} from "@application/layouts/main-layout";
import "@application/styles/main.scss";

export async function RootLayout({children}) {
  return (
    <html lang={"ru"}>
    <body>
    <MainLayout>{children}</MainLayout>
    </body>
    </html>
  );
}
