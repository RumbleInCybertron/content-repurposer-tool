import "./globals.css";
import NavBar from '../components/NavBar';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const links = [
    { label: 'Home', href: '/' },
    { label: 'Analytics', href: '/analytics' },
  ]

  return (
    <html lang="en">
      <body
        className={"antialiased"}
      >
        <NavBar links={links} />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
