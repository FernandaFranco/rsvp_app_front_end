// src/app/layout.js
import "./globals.css";
import Providers from "./providers";
import { App as AntApp } from "antd";

export const metadata = {
  title: "Venha - Sistema de Convites",
  description: "Crie e gerencie convites para seus eventos",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <AntApp>{children}</AntApp>
        </Providers>
      </body>
    </html>
  );
}
