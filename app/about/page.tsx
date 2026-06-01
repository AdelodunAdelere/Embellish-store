import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <section className="bg-plum py-24 px-4 text-center">
          <p className="text-xs tracking-[0.3em] text-taupe uppercase mb-4">Our story</p>
          <h1 className="font-serif text-5xl md:text-6xl text-blush italic leading-tight max-w-2xl mx-auto">
            A new destination for timeless elegance
          </h1>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-16 text-center">
          <p className="font-serif text-2xl text-plum italic mb-6 leading-relaxed">
            &quot;We bring you handbags, tote bags, and luxury pieces designed to elevate every moment.&quot;
          </p>
          <p className="text-sm text-brown leading-relaxed mb-6">
            EMBELLISH was born from a simple but powerful belief — that every woman deserves to carry something beautiful. We source, curate, and craft accessories that blend timeless design with modern sensibility.
          </p>
          <p className="text-sm text-brown leading-relaxed">
            Every piece in our collection is chosen with care — from the stitching on our tote bags to the clasp on our jewellery. We believe in quality over quantity, and in accessories that tell a story.
          </p>
        </section>

        <section className="bg-cream py-14 px-4">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { num: "500+", label: "Happy customers" },
              { num: "3", label: "Product categories" },
              { num: "100%", label: "Premium quality" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-serif text-5xl text-plum mb-2">{s.num}</p>
                <p className="text-xs tracking-widest text-taupe uppercase">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-mauve py-16 px-4 text-center">
          <h2 className="font-serif text-3xl text-blush mb-4">Ready to elevate your style?</h2>
          <p className="text-sm text-taupe mb-8">
            Discover our latest collection of bags, jewellery and beanies.
          </p>
          <Link
            href="/shop"
            className="bg-blush text-plum text-xs tracking-widest uppercase px-8 py-4 rounded-full hover:bg-blush/90 transition-colors inline-flex items-center gap-2 font-medium"
          >
            Shop the Collection <ArrowRight size={14} />
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
