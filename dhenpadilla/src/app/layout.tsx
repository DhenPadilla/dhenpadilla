import { HOME_OG_IMAGE_URL } from "@/lib/constants";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: `Dhen Padilla`,
  description: `A multidisciplinary based in New York and Tokyo.`,
  openGraph: {
    images: [HOME_OG_IMAGE_URL],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon/dhpad.png" sizes="any" />

      </head>
      <body
        className={`antialiased`}
        style={{ fontFamily: 'Times New Roman' }}
      >
        {children}
      </body>
    </html>
  );
}