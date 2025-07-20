import { ThemeProvider } from "next-themes";
import "@xyflow/react/dist/style.css";
import "@/app/global.css";

export const metadata = {
  title: "EnTree",
  description: "Your entry into AI-guided learning. Generate a visual learning plan about any topic.",
  author: "Geomty",
  keywords: ["tree", "learn", "learning", "ai"]
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
