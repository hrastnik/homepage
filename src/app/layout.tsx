import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
};

export const metadata: Metadata = {
  title: "Lloyds digital | Marenda dashboard",
  description:
    "Lloyds digital dashboard | Otkrijte najbolja jela i menije u Pineti i Labineci. Pratite uživo streamove i vremensku prognozu.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="h-screen max-h-screen min-w-[1200px]">{children}</body>
    </html>
  );
}
