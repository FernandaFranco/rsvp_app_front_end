// src/app/layout.js
import "./globals.css";
import Providers from "./providers";

export const metadata = {
  title: "Venha - Sistema de Convites",
  description: "Crie e gerencie convites para seus eventos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
