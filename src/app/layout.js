import './globals.css';

export const metadata = {
  title: 'ERP Prohaba Jaya Mandiri',
  description: 'Sistem Manajemen Terintegrasi PT. Prohaba Jaya Mandiri — Konstruksi Pertambangan',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>{children}</body>
    </html>
  );
}
