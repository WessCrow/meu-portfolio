import "./globals.css";
import type { Metadata } from "next";
import AnalyticsTracker from "../components/AnalyticsTracker";

export const metadata: Metadata = {
  title: "Wess // Estrategista de Design & Inovação",
  description: "Portfolio estratégico de Wesley Alves (Wess). 14+ anos orquestrando a convergência entre inteligência agêntica e interfaces de alta fidelidade.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body suppressHydrationWarning>
        {/* WCAG 2.4.1 — Skip Navigation Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-black focus:text-white focus:font-mono focus:text-xs focus:uppercase focus:tracking-widest focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white"
        >
          Ir para conteúdo principal
        </a>
        <AnalyticsTracker />
        {children}
        {/* GLOBAL CHROMATIC ABERRATION FILTER */}
        <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none', opacity: 0 }} suppressHydrationWarning>
          <defs>
            <filter id="chromatic-aberration" x="-10%" y="-10%" width="120%" height="120%">
              <feColorMatrix in="SourceGraphic" type="matrix" values="1 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0" result="red" />
              <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 1 0 0 0 0 0 0 0 0 0 0 0 1 0" result="green" />
              <feColorMatrix in="SourceGraphic" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 1 0 0 0 0 0 1 0" result="blue" />
              <feOffset in="red" dx="4" dy="0" result="red-offset" />
              <feOffset in="blue" dx="-4" dy="0" result="blue-offset" />
              <feBlend in="red-offset" in2="green" mode="screen" result="rg" />
              <feBlend in="rg" in2="blue-offset" mode="screen" />
            </filter>
          </defs>
        </svg>
      </body>
    </html>
  );
}
