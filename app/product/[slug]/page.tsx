import { notFound } from "next/navigation";
import Link from "next/link";
import { Check, Star, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import ProductActions from "@/components/shop/ProductActions";
import ReviewsSection from "@/components/shop/ReviewsSection";
import ProductImageGallery from "@/components/shop/ProductImageGallery";
import { products, formatPrice } from "@/lib/data";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description,
    openGraph: {
      title: `${product.name} | EMBELLISH`,
      description: product.description,
      type: "website",
      images: product.images[0] ? [{ url: product.images[0] }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
    },
  };
}

export async function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);
  if (!product) notFound();

  const related = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : null;

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-cream">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-xs text-taupe hover:text-plum tracking-widest uppercase mb-8 transition-colors"
          >
            <ArrowLeft size={14} /> Back to shop
          </Link>

          <div className="grid md:grid-cols-2 gap-10 mb-16">
            <ProductImageGallery
              images={product.images}
              name={product.name}
              category={product.category}
              badge={product.badge}
              discount={discount}
            />

            {/* Details */}
            <div className="flex flex-col">
              <p className="text-xs tracking-widest text-taupe uppercase mb-2">
                {product.category}
              </p>
              <h1 className="font-serif text-4xl md:text-5xl text-plum leading-tight mb-3">
                {product.name}
              </h1>

              <div className="flex items-center gap-2 mb-5">
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      className={
                        i < Math.floor(product.rating)
                          ? "fill-taupe text-taupe"
                          : "text-blush fill-blush"
                      }
                    />
                  ))}
                </div>
                <span className="text-xs text-taupe">({product.reviews} reviews)</span>
              </div>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="font-serif text-3xl text-plum">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-taupe line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-sm text-brown leading-relaxed mb-7">{product.description}</p>

              {/* Interactive: color picker, qty, add-to-cart, wishlist */}
              <ProductActions product={product} />

              <div className="mt-8 pt-8 border-t border-blush/20 grid grid-cols-2 gap-4">
                {["Free delivery over ₦30k", "30-day returns", "Secure checkout", "Authentic quality"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-xs text-taupe">
                    <Check size={12} className="text-taupe flex-shrink-0" /> {f}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Reviews */}
          <ReviewsSection productId={product.id} productName={product.name} />

          {/* Related products */}
          {related.length > 0 && (
            <div className="mt-16">
              <h2 className="font-serif text-3xl text-plum mb-7">You may also like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
