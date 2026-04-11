"use client";
import dynamic from 'next/dynamic';

const WessPortfolio = dynamic(() => import("./PortfolioView"), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <WessPortfolio />
    </main>
  );
}
