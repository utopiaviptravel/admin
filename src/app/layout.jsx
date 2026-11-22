import { Montserrat, Noto_Sans_Georgian } from 'next/font/google';
import './globals.css';

const montserrat = Montserrat({ subsets: ['latin'], weight: ['400', '500', '600'], variable: '--font-mont', display: 'swap' });
const georgian = Noto_Sans_Georgian({ subsets: ['georgian'], weight: ['400', '500', '600', '700'], variable: '--font-geo', display: 'swap' });

export const metadata = {
  title: 'Utopia Admin',
  robots: { index: false, follow: false },
};

export const viewport = {
  themeColor: '#140F2C',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ka" className={`${montserrat.variable} ${georgian.variable}`}>
      <body>{children}</body>
    </html>
  );
}
