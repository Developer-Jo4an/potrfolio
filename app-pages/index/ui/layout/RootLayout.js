import "../../../../application/styles/main.scss";
import {MainLayout} from "../../../../application/layouts/main-layout";

export const metadata = {title: "portfolio | main page", description: "portfolio"};

export default function RootLayout({children}) {
  return (
    <html lang={"en"}>
    <body>
    <MainLayout>
      {children}
    </MainLayout>
    </body>
    </html>
  );
}
