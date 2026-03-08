import "./globals.css";
import NavBar from "../components/NavBar";

export const metadata = {
  title: "Restore",
  description: "Where Understanding Grows",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>

        <NavBar />

        {children}

      </body>
    </html>
  );
}
