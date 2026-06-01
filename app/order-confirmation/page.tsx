import { Suspense } from "react";
import OrderConfirmationContent from "./OrderConfirmationContent";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Order Confirmed",
};

export default function OrderConfirmationPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        <Suspense fallback={
          <div className="flex items-center justify-center py-32">
            <div className="w-8 h-8 rounded-full border-2 border-taupe border-t-plum animate-spin" />
          </div>
        }>
          <OrderConfirmationContent />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
