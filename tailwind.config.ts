import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Palet utama: hijau KBM (dari logo Yayasan Khazanah Berkah Mulia).
        // Seluruh komponen memakai token `brand-*`, jadi mengganti skala di sini
        // otomatis merecolor seluruh situs.
        brand: {
          50: "#eefaf1",
          100: "#d5f2dd",
          200: "#ade3bd",
          300: "#79ce94",
          400: "#44b06a",
          500: "#1e9a4c", // warna utama (mendekati hijau logo)
          600: "#157c3d", // tombol / aksi
          700: "#146333",
          800: "#134e2b",
          900: "#0c3a20", // hijau tua — elemen "trust"
          950: "#062012",
        },
        // Aksen merah dari sapuan pada logo KBM. Dipakai hemat untuk sorotan.
        accent: {
          50: "#fef2f1",
          100: "#fde0dd",
          500: "#e12e26",
          600: "#c31f18",
          700: "#a11913",
        },
        sand: {
          50: "#f9f8f4",
          100: "#f2f0e9",
          200: "#e6e2d6",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "xl": "0.9rem",
        "2xl": "1.25rem",
      },
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.4s ease-out both",
        shimmer: "shimmer 1.5s infinite",
      },
    },
  },
  plugins: [],
};

export default config;
