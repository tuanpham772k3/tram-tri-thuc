import HomeHero from "../../components/Home/HomeHero";
import HomeOverview from "../../components/Home/HomeOverview";

export default function HomePage() {
  return (
    <div className="w-full min-h-screen">
      <HomeHero />

      <HomeOverview />
    </div>
  );
}
