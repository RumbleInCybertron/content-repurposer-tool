'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavBarProps {
  links: NavLink[];
}

export default function NavBar({ links }: NavBarProps) {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-primary text-netural-white p-4  px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <div className="text-lg font-bold text-netural-white">Content Repurposer</div>

      {/* Desktop Links */}
      <div className="hidden md:flex space-x-6">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`hover:text-warning ${pathname === link.href ? 'text-semantic-success' : 'text-neutral-white'
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
          className="text-secondary"
          aria-label="Toggle menu"
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

      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-95 transition-opacity duration-300 ${isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
        onClick={() => setIsMenuOpen(false)} // Close menu on backdrop click
      ></div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`absolute top-16 left-0 w-full bg-accent-lightblue text-secondary flex flex-col space-y-2 shadow-lg p-4 rounded-lg z-50 transition-all duration-300 ease-in-out transform ${isMenuOpen
            ? 'opacity-100 scale-100 translate-y-0'
            : 'opacity-0 scale-95 -translate-y-4'
          }`}
      >
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center space-x-2 py-2 px-4 rounded-md hover:bg-gray-600 hover:bg-opacity-40 bg-opacity-10 hover:text-blue-400 ${pathname === link.href ? 'bg-gray-600 text-blue-400' : ''
              }`}
            onClick={() => setIsMenuOpen(false)} // Close menu on click
          >
            {link.icon && <span>{link.icon}</span>}
            <span>{link.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
