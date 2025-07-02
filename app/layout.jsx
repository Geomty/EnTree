import { ThemeProvider } from "next-themes";
import "@xyflow/react/dist/style.css";
import "@/app/global.css";

export const metadata = {
  title: "EnTree",
  description: "wip",
  author: "Geomty",
  keywords: ["tree", "learn", "learning"]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
