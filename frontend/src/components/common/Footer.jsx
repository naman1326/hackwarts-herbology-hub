import React from 'react'
import { Link } from 'react-router-dom'
import { FaEnvelope as Mail, FaMapPin as MapPin, FaPhone as Phone } from 'react-icons/fa'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-dark/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🌿</span>
              <div>
                <p className="font-cinzel font-bold text-cream">Herbology</p>
                <p className="text-accent text-sm">Hub</p>
              </div>
            </div>
            <p className="text-cream/60 text-sm">
              A magical skill-sharing platform where knowledge is power.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel font-bold text-cream mb-4">
              Platform
            </h4>
            <ul className="space-y-2 text-cream/70 text-sm">
              <li>
                <Link to="/" className="hover:text-accent transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/discover" className="hover:text-accent transition-colors">
                  Discover
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="hover:text-accent transition-colors">
                  Leaderboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-cinzel font-bold text-cream mb-4">
              Company
            </h4>
            <ul className="space-y-2 text-cream/70 text-sm">
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Contact
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-accent transition-colors">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-cinzel font-bold text-cream mb-4">
              Contact
            </h4>
            <ul className="space-y-2 text-cream/70 text-sm">
              <li className="flex items-center gap-2">
                <Mail size={16} className="text-accent" />
                hello@herbology.com
              </li>
              <li className="flex items-center gap-2">
                <Phone size={16} className="text-accent" />
                +1 (555) 000-0000
              </li>
              <li className="flex items-center gap-2">
                <MapPin size={16} className="text-accent" />
                Hogwarts, Magic World
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-cream/60 text-sm">
            <p>
              © {currentYear} The Herbology Hub. All rights reserved. ✨
            </p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="hover:text-accent transition-colors">
                Twitter
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                Discord
              </a>
              <a href="#" className="hover:text-accent transition-colors">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
