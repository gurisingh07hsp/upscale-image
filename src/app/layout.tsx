import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'PixelLift — AI Image Upscaler',
  description:
    'Upscale and enhance images with AI. PixelLift turns low-resolution photos into crisp, high-resolution masterpieces.',
  openGraph: {
    title: 'PixelLift — AI Image Upscaler',
    description:
      'Upscale and enhance images with AI. PixelLift turns low-resolution photos into crisp, high-resolution masterpieces.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans">
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
