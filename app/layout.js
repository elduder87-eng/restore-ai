export const metadata = {
  title: "Restore",
  description: "Where Understanding Grows",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
