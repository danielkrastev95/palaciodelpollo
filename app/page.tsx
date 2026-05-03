import HeroSection        from "@/components/sections/HeroSection"
import Ritual              from "@/components/sections/Ritual"
import MenuEditorialClient from "@/components/sections/MenuEditorialClient"
import ReservationSection  from "@/components/sections/ReservationSection"
import Voices              from "@/components/sections/Voices"
import Gallery             from "@/components/sections/Gallery"

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <Ritual />
      <MenuEditorialClient />
      <ReservationSection />
      <Voices />
      <Gallery />
    </>
  )
}
