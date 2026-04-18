import Navigation from "@/components/Navigation";
import Hero from "@/components/Hero";
import SpaceGrid from "@/components/SpaceGrid";
import { getSpaces } from "@/lib/products";

export default async function Home() {
  const spaces = await getSpaces();

  return (
    <main>
      <Navigation />
      <Hero />
      <SpaceGrid spaces={spaces as any} />
    </main>
  );
}
