import { useState } from 'react'
import Navigation from '@/components/layout/Navigation'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/hero/Hero'
import ChurchSection from '@/components/sections/church/ChurchSection'
import VenueSection from '@/components/sections/venue/VenueSection'
import TransportationSection from '@/components/sections/transportation/TransportationSection'
import AccommodationSection from '@/components/sections/accommodation/AccommodationSection'
import GiftSection from '@/components/sections/gifts/GiftSection'
import OutroSection from '@/components/sections/OutroSection'
import RSVPModal from '@/components/rsvp/RSVPModal'
import FloatingRSVP from '@/components/common/FloatingRSVP'

export default function Home() {
  const [isRSVPOpen, setIsRSVPOpen] = useState(false)

  const openRSVP = () => setIsRSVPOpen(true)
  const closeRSVP = () => setIsRSVPOpen(false)

  return (
    <div className="min-h-screen">
      <Navigation />
      <Hero onRSVPClick={openRSVP} />
      <ChurchSection />
      <VenueSection />
      <TransportationSection />
      <AccommodationSection />
      <GiftSection />
      <OutroSection />
      <Footer />

      <FloatingRSVP onClick={openRSVP} />
      <RSVPModal isOpen={isRSVPOpen} onClose={closeRSVP} />
    </div>
  )
}
