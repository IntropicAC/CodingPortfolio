import './globals.css';
import './interactions.css';

export const metadata = {
  title: 'Alex Charnock: software built around real operations',
  description:
    'Portfolio of Alex Charnock — software built around real operations, from healthcare workflows to full-stack products.',
  icons: {
    icon: 'images/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
