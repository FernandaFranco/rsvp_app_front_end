// src/app/providers.js
"use client";

import { ConfigProvider, App } from "antd";
import locale from "antd/locale/pt_BR";

export default function Providers({ children }) {
  return (
    <ConfigProvider
      locale={locale}
      theme={{
        token: {
          colorPrimary: "#4f46e5", // indigo-600 para manter consistência
          borderRadius: 8,
        },
      }}
    >
      <App>{children}</App>
    </ConfigProvider>
  );
}
