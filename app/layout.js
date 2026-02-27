export const metadata = {
  title: "Restore AI",
  description: "Teacher Mode"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "serif", padding: "20px" }}>
        {children}
      </body>
    </html>
  );
}
