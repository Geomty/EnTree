import "@/app/global.css";

export const metadata = {
  title: "EnTree",
  description: "wip",
  author: "Geomty",
  keywords: ["tree", "learn", "learning"]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
