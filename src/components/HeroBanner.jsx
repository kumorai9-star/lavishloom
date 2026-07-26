import { Link } from "react-router-dom";

export default function HeroBanner({
  eyebrow = "Season of Grace",
  title = "Crafted for the unhurried childhood.",
  subtitle = "Discover a collection where timeless craftsmanship meets the whimsical spirit of play.",
  image = "/images/pic22.jpeg",
  imageAlt = "Child in linen shirt beneath dappled light",
  ctaLabel = "Explore Collection",
  ctaTo = "/shop",
}) {
  return (
    <section className="relative h-[380px] md:h-[480px] flex items-end">
      <img
        src={image}
        alt={imageAlt}
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/50 via-ink/10 to-transparent" />
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pb-16 w-full text-cream">
        <p className="eyebrow text-terracotta mb-3">{eyebrow}</p>
        <h1 className="max-w-xl leading-tight">{title}</h1>
        <p className="mt-4 max-w-md text-cream/90">{subtitle}</p>
        <Link to={ctaTo} className="inline-block mt-8 btn-primary">
          {ctaLabel}
        </Link>
      </div>
    </section>
  );
}