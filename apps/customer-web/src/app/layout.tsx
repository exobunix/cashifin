import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Cashifin Customer Web Portal',
  description: 'Sell your used devices online instantly for cash.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}