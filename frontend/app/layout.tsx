"use client";

import "./globals.css";
import NavBar from '../components/NavBar';
import { links } from '../components/NavLinkConfig';
import { SessionProvider } from 'next-auth/react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <body className={"antialiased"}>
          <SessionProvider>
            <NavBar links={links} />
            {children}
          </SessionProvider>
        </body>
      </html>
  );
}
