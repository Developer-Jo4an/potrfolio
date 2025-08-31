import MainLayout from "../components/layouts/MainLayout";
import "../styles/zeroing.scss";
import cl from "classnames";
import {montserrat} from "../fonts/fonts";

export const metadata = {title: "portfolio | main page", description: "portfolio"};

export default function RootLayout({children}) {
  return (
    <html lang={"en"} className={cl(montserrat.variable)}>
    <body>
    <MainLayout>
      {children}
    </MainLayout>
    </body>
    </html>
  );
}
