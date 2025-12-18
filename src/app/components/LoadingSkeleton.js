// src/app/components/LoadingSkeleton.js
"use client";

import { Card, Skeleton, Space } from "antd";

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skeleton da navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Skeleton do logo */}
            <div className="flex items-center gap-2">
              <Skeleton.Avatar active size={32} />
              <Skeleton.Input active size="large" style={{ width: 100 }} />
            </div>
            {/* Skeleton do usuário/logout */}
            <Skeleton.Button active size="large" style={{ width: 100 }} />
          </div>
        </div>
      </nav>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Skeleton do header */}
          <div className="flex justify-between items-center">
            <Skeleton.Button active size="large" style={{ width: 200 }} />
            <Skeleton.Button active size="large" style={{ width: 150 }} />
          </div>

          {/* Skeleton dos cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="fade-in-up">
                <Skeleton active />
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export function EventDetailsSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skeleton da navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Skeleton do botão voltar */}
            <Skeleton.Button active size="default" style={{ width: 150 }} />
            {/* Skeleton do logo */}
            <div className="flex items-center gap-2">
              <Skeleton.Avatar active size={32} />
              <Skeleton.Input active size="large" style={{ width: 100 }} />
            </div>
            {/* Espaçador */}
            <div style={{ width: 150 }}></div>
          </div>
        </div>
      </nav>

      {/* Conteúdo principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <Skeleton.Input active size="large" style={{ width: 300 }} block />
            <Skeleton.Input active size="small" style={{ width: 200 }} block />
          </div>

          {/* Cards de estatísticas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Card key={i}>
                <Space orientation="vertical" style={{ width: "100%" }}>
                  <Skeleton.Input active size="small" style={{ width: 100 }} />
                  <Skeleton.Input active size="large" style={{ width: 60 }} />
                </Space>
              </Card>
            ))}
          </div>

          {/* Ações */}
          <Card>
            <Space wrap>
              <Skeleton.Button active size="large" />
              <Skeleton.Button active size="large" />
              <Skeleton.Button active size="large" />
              <Skeleton.Button active size="large" />
              <Skeleton.Button active size="large" />
            </Space>
          </Card>

          {/* Tabela */}
          <Card>
            <Skeleton active paragraph={{ rows: 8 }} />
          </Card>
        </div>
      </main>
    </div>
  );
}

export function InviteSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      {/* Skeleton do logo/header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Skeleton.Avatar active size={40} />
          <Skeleton.Input active size="large" style={{ width: 100 }} />
        </div>
        <Skeleton.Input active size="small" style={{ width: 150 }} block className="mx-auto" />
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Card do header */}
        <Card>
          <Space orientation="vertical" style={{ width: "100%" }} size="large">
            <Skeleton.Input active size="large" style={{ width: "100%" }} block />
            <Skeleton active paragraph={{ rows: 3 }} />
          </Space>
        </Card>

        {/* Card do mapa */}
        <Card
          title={<Skeleton.Input active size="small" style={{ width: 100 }} />}
        >
          <div style={{ height: 300, background: "#f0f0f0", borderRadius: 8 }}>
            <Skeleton active paragraph={{ rows: 6 }} />
          </div>
        </Card>

        {/* Card do clima */}
        <Card>
          <Space style={{ width: "100%" }} size="large">
            <Skeleton.Avatar active size={64} />
            <div style={{ flex: 1 }}>
              <Skeleton active paragraph={{ rows: 2 }} />
            </div>
          </Space>
        </Card>

        {/* Card do formulário */}
        <Card
          title={<Skeleton.Input active size="small" style={{ width: 150 }} />}
        >
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Skeleton da navbar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Skeleton do botão voltar */}
            <Skeleton.Button active size="default" style={{ width: 100 }} />
            {/* Skeleton do logo */}
            <div className="flex items-center gap-2">
              <Skeleton.Avatar active size={32} />
              <Skeleton.Input active size="large" style={{ width: 100 }} />
            </div>
            {/* Espaçador */}
            <div style={{ width: 100 }}></div>
          </div>
        </div>
      </nav>

      {/* Conteúdo do formulário */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <Space orientation="vertical" style={{ width: "100%" }} size="large">
            {/* Seção do título */}
            <div>
              <Skeleton.Input active size="large" style={{ width: 200 }} block />
              <Skeleton.Input
                active
                size="small"
                style={{ width: 300, marginTop: 8 }}
                block
              />
            </div>

            {/* Campos do formulário */}
            <Skeleton.Input active size="large" block />
            <Skeleton active paragraph={{ rows: 2 }} />
            <div className="grid grid-cols-3 gap-4">
              <Skeleton.Input active size="large" block />
              <Skeleton.Input active size="large" block />
              <Skeleton.Input active size="large" block />
            </div>
            <Skeleton active paragraph={{ rows: 4 }} />

            {/* Botões */}
            <div className="grid grid-cols-2 gap-4">
              <Skeleton.Button active size="large" block />
              <Skeleton.Button active size="large" block />
            </div>
          </Space>
        </Card>
      </main>
    </div>
  );
}
