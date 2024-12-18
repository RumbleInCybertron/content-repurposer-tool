'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavLink {
  label: string;
  href: string;
}

interface NavBarProps {
  links: NavLink[];
}

export default function NavBar({ links }: NavBarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-lg font-bold">Content Repurposer</div>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:underline ${
              pathname === link.href ? 'text-blue-400 underline' : ''
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="text-white"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 5.25h16.5m-16.5 7.5h16.5m-16.5 7.5h16.5"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-gray-800 text-white flex flex-col space-y-4 p-4 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`hover:underline ${
                pathname === link.href ? 'text-blue-400 underline' : ''
              }`}
              onClick={() => setIsMenuOpen(false)} // Close menu on click
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}      
    </nav>
  );
}
