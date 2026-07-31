export default function LogoMark({ className = "h-14 md:h-16" }) {
  return (
    <div className={`flex flex-col items-center leading-none select-none ${className}`}>
      <div className="flex items-end gap-3">
        <span
          style={{ fontFamily: "'Alex Brush', cursive" }}
          className="text-4xl md:text-5xl bg-gradient-to-b from-[#C9A15A] to-[#8C6A3A] bg-clip-text text-transparent"
        >
          Lavishloom
        </span>

        <DressIcon className="w-7 h-9 md:w-8 md:h-10 mb-1 text-[#B4894A]" />

        <span
          style={{ fontFamily: "'Alex Brush', cursive" }}
          className="text-3xl md:text-4xl text-stone-500"
        >
          Kidz
        </span>
      </div>

      <svg viewBox="0 0 300 20" className="w-56 md:w-64 -mt-1 text-[#B4894A]">
        <path
          d="M0 5 C 80 20, 220 20, 300 2"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        />
      </svg>

      <span
        style={{ fontFamily: "'Tangerine', cursive" }}
        className="text-2xl md:text-3xl text-[#B4894A] -mt-1"
      >
        by Hazel &amp; Jo
      </span>
    </div>
  );
}

function DressIcon({ className }) {
  return (
    <svg viewBox="0 0 40 50" className={className} fill="none" stroke="currentColor" strokeWidth="1.4">
      {/* Left shoulder strap */}
      <line x1="14" y1="4" x2="15" y2="11" strokeLinecap="round" />
      {/* Right shoulder strap */}
      <line x1="26" y1="4" x2="25" y2="11" strokeLinecap="round" />

      {/* Bodice (fitted top, waist narrows in) */}
      <path
        d="M15 11 L25 11 L27 20 L13 20 Z"
        strokeLinejoin="round"
      />

      {/* Bow at waist */}
      <path d="M13 20 L9 18 L11 20 L9 22 L13 20 Z" fill="currentColor" stroke="none" />
      <path d="M27 20 L31 18 L29 20 L31 22 L27 20 Z" fill="currentColor" stroke="none" />
      <circle cx="20" cy="20" r="1.3" fill="currentColor" stroke="none" />

      {/* Flared skirt */}
      <path
        d="M13 20 L4 42 L36 42 L27 20 Z"
        strokeLinejoin="round"
      />

      {/* Pleat lines */}
      <line x1="18" y1="21" x2="12" y2="42" strokeLinecap="round" />
      <line x1="20" y1="21" x2="20" y2="42" strokeLinecap="round" />
      <line x1="22" y1="21" x2="28" y2="42" strokeLinecap="round" />
    </svg>
  );
}