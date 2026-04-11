import Hero from "@/components/home/Hero";
import FeaturedCars from "@/components/home/FeaturedCars";
import Features from "@/components/home/Features";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-full text-slate-900">
      <Hero />
      <FeaturedCars />
      <Features />
      <Testimonials />
    </div>
  );
}
