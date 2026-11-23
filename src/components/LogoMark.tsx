import Link from "next/link";

/**
 * Corner brand mark: the Simone Cucchi monogram, linking home and spinning once
 * on hover. Inherits the surrounding text colour, so it reads on both the light
 * pages and the dark case studies. Replaces the old corner dot.
 */
export default function LogoMark({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`logomark${className ? ` ${className}` : ""}`}
      aria-label="Simone Cucchi — home"
    >
      <svg className="logomark_svg" viewBox="0 0 300 300" fill="none" aria-hidden="true">
        <path
          d="M150 0C67.2912 0 0 67.2912 0 150C0 232.709 67.2912 300 150 300C232.709 300 300 232.709 300 150C300 67.2912 232.709 0 150 0ZM150 280.113C78.26 280.113 19.8869 221.747 19.8869 150C19.8869 78.2532 78.26 19.8869 150 19.8869C221.74 19.8869 280.113 78.2532 280.113 150C280.113 221.747 221.747 280.113 150 280.113Z"
          fill="currentColor"
        />
        <path
          transform="translate(100.08 46.57)"
          d="M63.9188 73.8656L44.4407 66.5622C38.0229 64.164 33.0154 61.4798 29.3637 58.3049H98.1401L97.6019 46.4709C96.3278 15.0293 75.4871 0 49.9182 0C24.3494 0 2.43222 16.0308 2.43222 42.6148C2.43222 62.5017 13.7962 75.8891 36.7284 84.8208L56.411 92.533C70.4115 98.0106 80.3515 105.723 80.3515 117.693C80.3515 131.292 68.1769 142.043 51.3353 142.043C29.6226 142.043 21.0996 130.277 19.4781 113.428H0C2.43221 144.27 22.3191 159.088 50.327 159.088C79.9564 159.088 99.8365 141.027 99.8365 116.072C99.8365 97.4043 88.4725 82.995 63.9188 73.8656ZM49.7139 17.0459C64.5933 17.0459 74.6491 23.8997 78.3758 39.1879H22.0534C23.0549 29.0639 29.6907 17.0459 49.7139 17.0459Z"
          fill="currentColor"
        />
        <path
          transform="translate(100.08 224.12)"
          d="M99.8365 0H0V19.4781H99.8365V0Z"
          fill="currentColor"
        />
      </svg>
    </Link>
  );
}
