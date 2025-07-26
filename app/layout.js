import ProviderComposer from "../providers/ProviderComposer";

export const metadata = {
  title: "portfolio | main page",
  description: "portfolio"
};

export default function RootLayout({children}) {
  return (
    <html lang={"en"}>
    <body>
    <ProviderComposer>
      {children}
    </ProviderComposer>
    </body>
    </html>
  );
}
