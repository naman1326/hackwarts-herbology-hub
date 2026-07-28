import React from 'react'
import { MainLayout } from '../components/layout/MainLayout'
import { HeroSection } from '../components/sections/HeroSection'
import { FeatureCards } from '../components/sections/FeatureCards'
import { HowItWorks } from '../components/sections/HowItWorks'
import { Testimonials } from '../components/sections/Testimonials'
import { CallToAction } from '../components/sections/CallToAction'

export function Landing() {
  return (
    <MainLayout>
      <HeroSection />
      <FeatureCards />
      <HowItWorks />
      <Testimonials />
      <CallToAction />
    </MainLayout>
  )
}
