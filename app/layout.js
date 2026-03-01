export const metadata = {
  title: "Restore AI",
  description: "A Renewed Understanding Experience"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "serif", padding: "40px" }}>
        {children}
      </body>
    </html>
  );
}
