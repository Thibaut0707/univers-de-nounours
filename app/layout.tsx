import Script from "next/script";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Univers de Nounours",
  description: "Un univers secret rempli de souvenirs.",
  manifest: "/manifest.json",


  icons: {
    icon: "/doudou.jpg",
    apple: "/doudou.jpg",
  },


};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
 return (
  <html lang="fr" suppressHydrationWarning>
    <body className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>

      <Script id="register-sw" strategy="afterInteractive">
  {`
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(function () {});
    }
  `}
</Script>
      {children}
    </body>
  </html>
);
}
