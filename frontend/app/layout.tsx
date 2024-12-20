import "./globals.css";
import NavBar from '../components/NavBar';
import { links } from '../components/NavLinkConfig';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={"antialiased"}>
        <NavBar links={links} />
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
