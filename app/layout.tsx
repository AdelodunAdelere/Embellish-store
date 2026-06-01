import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: {
    default: "EMBELLISH — Where Style Meets Sophistication",
    template: "%s | EMBELLISH",
  },
  description:
    "Discover timeless handbags, tote bags, jewellery and beanies. EMBELLISH brings you luxury accessories designed to elevate every moment.",
  keywords: ["handbags", "jewellery", "beanies", "luxury accessories", "Nigerian fashion", "female accessories"],
  openGraph: {
    title: "EMBELLISH",
    description: "Where Style Meets Sophistication",
    type: "website",
    locale: "en_NG",
    siteName: "EMBELLISH",
  },
  twitter: {
    card: "summary_large_image",
    title: "EMBELLISH",
    description: "Where Style Meets Sophistication",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#260C1A",
              color: "#EDBFC6",
              border: "1px solid #432E36",
              fontFamily: "Jost, system-ui, sans-serif",
              fontSize: "13px",
              letterSpacing: "0.02em",
            },
            classNames: {
              error: "!bg-red-900 !text-red-100",
              success: "!bg-[#260C1A] !text-[#EDBFC6]",
            },
          }}
        />
      </body>
    </html>
  );
}
