import "../application/styles/zeroing.scss";
import cl from "classnames";
import {MONTSERRAT} from "../shared/constants/fonts/fonts";

export const metadata = {title: "portfolio | main page", description: "portfolio"};

export default function RootLayout({children}) {
  return (
    <html lang={"en"} className={cl(MONTSERRAT.variable)}>
    <body>
    {children}
    </body>
    </html>
  );
}
