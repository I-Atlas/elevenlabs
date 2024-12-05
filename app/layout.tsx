import "@mantine/core/styles.css";

import { ColorSchemeScript, createTheme, MantineProvider } from "@mantine/core";
import ReactQueryProvider from "@/app/context/react-query";

const theme = createTheme({
  primaryColor: "violet",
});

export const metadata = {
  title: "TTS from 11Labs",
  description: "Use TTS API from 11Labs without restrictions",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <ReactQueryProvider>
          <MantineProvider theme={theme}>{children}</MantineProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
