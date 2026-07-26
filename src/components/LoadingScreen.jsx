export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-cream flex flex-col items-center justify-center">
      <p className="font-display text-2xl md:text-3xl tracking-wide text-ink mb-6">
        Lavishloom Kidz
      </p>
      <div className="relative h-10 w-10">
        <div className="absolute inset-0 rounded-full border-2 border-stone" />
        <div className="absolute inset-0 rounded-full border-2 border-terracotta border-t-transparent animate-spin" />
      </div>
      <p className="eyebrow mt-6">Crafted for the unhurried childhood</p>
    </div>
  );
}