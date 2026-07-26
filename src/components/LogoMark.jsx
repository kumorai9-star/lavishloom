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
          Kids
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
    <svg viewBox="0 0 40 52" className={className} fill="none" stroke="currentColor" strokeWidth="1.2">
      {/* Shoulder straps */}
      <path d="M13 4 L14 12" strokeLinecap="round" />
      <path d="M27 4 L26 12" strokeLinecap="round" />

      {/* Fitted bodice (fuller neckline, narrower waist) */}
      <path
        d="M11 4 Q13 2 15 4 L15 10 Q10 12 9 18 L15 16 Q20 18 25 16 L31 18 Q30 12 25 10 L25 4 Q27 2 29 4 L30 10 Q37 15 35 24 L20 20 L5 24 Q3 15 10 10 Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Bow at waist */}
      <path
        d="M15 19 Q13 17 11 18 Q13 20 15 19 Q17 21 15 22 Q13 21 15 19"
        strokeLinecap="round"
      />
      <path
        d="M25 19 Q27 17 29 18 Q27 20 25 19 Q23 21 25 22 Q27 21 25 19"
        strokeLinecap="round"
      />
      <circle cx="20" cy="19.5" r="1.3" fill="currentColor" stroke="none" />

      {/* Flared pleated skirt */}
      <path
        d="M5 24 L2 44 Q11 47 20 47 Q29 47 38 44 L35 24 Q28 22 20 22 Q12 22 5 24 Z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M11 24 L8 45" strokeLinecap="round" />
      <path d="M20 22.5 L19 47" strokeLinecap="round" />
      <path d="M29 24 L32 45" strokeLinecap="round" />

      {/* Scalloped hem */}
      <path
        d="M2 44 Q5.5 47 9 44 Q12.5 47 16 44 Q19.5 47 23 44 Q26.5 47 30 44 Q33.5 47 38 44"
        strokeLinecap="round"
      />
    </svg>
  );
}