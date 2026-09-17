import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Construir | Podcast Inmobiliario',
  description:
    'Conversaciones sobre inversión, inmobiliaria, arquitectura, ciudad y construcción.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}