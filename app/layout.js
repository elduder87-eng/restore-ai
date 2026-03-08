export const metadata = {
  title: "Restore",
  description: "Where Understanding Grows",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily: "system-ui",
          background: "#f5f7fa",
        }}
      >
        {children}
      </body>
    </html>
  );
}
