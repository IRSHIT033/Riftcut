export function Logo({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Riftcut logo"
    >
      {/* Back rectangle */}
      <rect
        x="8"
        y="4"
        width="18"
        height="22"
        rx="3"
        fill="#52525b"
        transform="rotate(3 17 15)"
      />
      {/* Front rectangle */}
      <rect
        x="6"
        y="6"
        width="18"
        height="22"
        rx="3"
        fill="#6366f1"
        transform="rotate(-2 15 17)"
      />
      {/* Rift line — the gap/cut */}
      <path
        d="M16 8 L14 16 L18 16 L15 26"
        stroke="#09090b"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function LogoFavicon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="8"
        y="4"
        width="18"
        height="22"
        rx="3"
        fill="#52525b"
        transform="rotate(3 17 15)"
      />
      <rect
        x="6"
        y="6"
        width="18"
        height="22"
        rx="3"
        fill="#6366f1"
        transform="rotate(-2 15 17)"
      />
      <path
        d="M16 8 L14 16 L18 16 L15 26"
        stroke="#09090b"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
