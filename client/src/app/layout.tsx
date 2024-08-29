import TopHeader from "@/app/components/Header";
import "./globals.css";
import { ProductProvider } from "@/context/ProductContext";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>E-Commerce app</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#ffffff" />
        {/* Add other meta tags or links as required */}
      </head>
      <body>
        <ProductProvider>
          <TopHeader />
          {children}
        </ProductProvider>
      </body>
    </html>
  );
}