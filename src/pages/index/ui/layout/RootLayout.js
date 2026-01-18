import "../../../../application/styles/main.scss";
import {MainLayout} from "../../../../application/layouts/main-layout";

function RootLayout({children}) {
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

export {RootLayout}
