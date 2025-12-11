// src/app/invite/[slug]/page.js
"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import {
  Card,
  Button,
  Input,
  InputNumber,
  Form,
  message,
  Divider,
  Tag,
  Space,
  Alert,
  Statistic,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  EnvironmentOutlined,
  CloudOutlined,
  DownloadOutlined,
  WhatsAppOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import dynamic from "next/dynamic";

// Importar mapa dinamicamente (só no client-side)
const MapWithNoSSR = dynamic(() => import("../../components/EventMap"), {
  ssr: false,
});

export default function ConvitePage() {
  const params = useParams();
  const slug = params.slug;

  const [event, setEvent] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    loadEvent();
  }, [slug]);

  useEffect(() => {
    if (event && event.address_full) {
      fetchWeather();
    }
  }, [event]);

  // Carregar evento
  const loadEvent = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/events/${slug}`
      );
      setEvent(response.data.event);
    } catch (err) {
      console.error("Erro ao carregar evento:", err);
      message.error("Evento não encontrado");
    } finally {
      setLoading(false);
    }
  };

  // Buscar clima
  const fetchWeather = async () => {
    try {
      // Extrair cidade do endereço
      const cityMatch = event.address_full.match(/,\s*([^,]+)\s*-\s*[A-Z]{2}/);
      const city = cityMatch ? cityMatch[1] : null;

      if (!city) {
        console.log("Não foi possível extrair a cidade do endereço");
        return;
      }

      // OpenWeatherMap API (gratuita - você precisa criar uma conta e obter API key)
      // Para desenvolvimento, vou usar dados mock
      // Substitua 'YOUR_API_KEY' pela sua chave real da OpenWeatherMap

      const OPENWEATHER_API_KEY = "YOUR_API_KEY"; // ⚠️ VOCÊ PRECISA OBTER UMA CHAVE

      // Se não tiver API key, usar dados simulados
      if (OPENWEATHER_API_KEY === "YOUR_API_KEY") {
        setWeather({
          temp: 28,
          description: "Céu limpo",
          icon: "01d",
          humidity: 65,
          feelsLike: 30,
        });
        return;
      }

      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},BR&appid=${OPENWEATHER_API_KEY}&units=metric&lang=pt_br`
      );

      setWeather({
        temp: Math.round(response.data.main.temp),
        description: response.data.weather[0].description,
        icon: response.data.weather[0].icon,
        humidity: response.data.main.humidity,
        feelsLike: Math.round(response.data.main.feels_like),
      });
    } catch (err) {
      console.error("Erro ao buscar clima:", err);
    }
  };

  // Submeter RSVP
  const handleSubmit = async (values) => {
    setSubmitting(true);

    try {
      await axios.post("http://localhost:5000/api/attendees/rsvp", {
        event_slug: slug,
        whatsapp_number: values.whatsapp_number,
        name: values.name,
        family_member_names: values.family_members
          ? values.family_members.split(",").map((n) => n.trim())
          : [],
        num_adults: values.num_adults || 1,
        num_children: values.num_children || 0,
        comments: values.comments || "",
      });

      message.success("Presença confirmada com sucesso!");
      setRsvpSuccess(true);
      form.resetFields();
    } catch (err) {
      const errorMsg =
        err.response?.data?.error || "Erro ao confirmar presença";
      message.error(errorMsg);
      console.error("Erro:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Gerar arquivo .ics (iCalendar)
  const downloadCalendar = () => {
    if (!event) return;

    const formatDateForICS = (dateStr, timeStr) => {
      const [year, month, day] = dateStr.split("-");
      const [hour, minute] = timeStr.split(":");
      return `${year}${month}${day}T${hour}${minute}00`;
    };

    const startDateTime = formatDateForICS(event.event_date, event.start_time);
    const endDateTime = event.end_time
      ? formatDateForICS(event.event_date, event.end_time)
      : formatDateForICS(event.event_date, "23:59");

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Venha//Event//PT-BR
CALSCALE:GREGORIAN
METHOD:PUBLISH
BEGIN:VEVENT
DTSTART:${startDateTime}
DTEND:${endDateTime}
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z
UID:${event.slug}@venha.app
SUMMARY:${event.title}
DESCRIPTION:${event.description || "Evento criado com Venha"}
LOCATION:${event.address_full}
STATUS:CONFIRMED
SEQUENCE:0
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = `${event.title.replace(/\s+/g, "_")}.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    message.success(
      "Evento baixado! Abra o arquivo para adicionar ao seu calendário."
    );
  };

  // Formatar data
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando convite...</p>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <Alert
            title="Convite não encontrado"
            description="Este link de convite não é válido ou o evento foi removido."
            type="error"
            showIcon
          />
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-600 mb-2">Venha</h1>
          <p className="text-gray-600">Você foi convidado!</p>
        </div>

        {/* Informações do evento */}
        <Card className="mb-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {event.title}
          </h2>

          {event.description && (
            <p className="text-gray-600 mb-6 text-lg">{event.description}</p>
          )}

          <Divider />

          {/* Data e Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start">
              <CalendarOutlined className="text-indigo-600 text-xl mr-3 mt-1" />
              <div>
                <p className="text-gray-500 text-sm">Data</p>
                <p className="text-gray-900 font-medium capitalize">
                  {formatDate(event.event_date)}
                </p>
              </div>
            </div>

            <div className="flex items-start">
              <ClockCircleOutlined className="text-indigo-600 text-xl mr-3 mt-1" />
              <div>
                <p className="text-gray-500 text-sm">Horário</p>
                <p className="text-gray-900 font-medium">
                  {event.start_time}
                  {event.end_time && ` - ${event.end_time}`}
                </p>
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="flex items-start mb-6">
            <EnvironmentOutlined className="text-indigo-600 text-xl mr-3 mt-1" />
            <div>
              <p className="text-gray-500 text-sm">Local</p>
              <p className="text-gray-900 font-medium">{event.address_full}</p>
            </div>
          </div>

          {/* Botão de adicionar ao calendário */}
          <Button
            icon={<DownloadOutlined />}
            onClick={downloadCalendar}
            size="large"
            block
          >
            Adicionar ao Calendário
          </Button>
        </Card>

        {/* Mapa */}
        <Card title="Localização" className="mb-6">
          <div style={{ height: "300px" }}>
            <MapWithNoSSR address={event.address_full} />
          </div>
        </Card>

        {/* Clima */}
        {weather && (
          <Card className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <CloudOutlined className="text-4xl text-blue-500 mr-4" />
                <div>
                  <p className="text-gray-500 text-sm">Previsão do Tempo</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {weather.temp}°C
                  </p>
                  <p className="text-gray-600 capitalize">
                    {weather.description}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">Sensação térmica</p>
                <p className="text-lg font-medium">{weather.feelsLike}°C</p>
                <p className="text-sm text-gray-500 mt-2">Umidade</p>
                <p className="text-lg font-medium">{weather.humidity}%</p>
              </div>
            </div>
          </Card>
        )}

        {/* Formulário de RSVP */}
        {rsvpSuccess ? (
          <Card>
            <Alert
              title="Presença confirmada!"
              description={
                <div>
                  <p className="mb-4">
                    Obrigado por confirmar sua presença! O anfitrião foi
                    notificado.
                  </p>
                  <Space>
                    <Button
                      icon={<DownloadOutlined />}
                      onClick={downloadCalendar}
                    >
                      Adicionar ao Calendário
                    </Button>
                    <Button
                      type="primary"
                      onClick={() => setRsvpSuccess(false)}
                    >
                      Confirmar Outra Pessoa
                    </Button>
                  </Space>
                </div>
              }
              type="success"
              showIcon
            />
          </Card>
        ) : (
          <Card title="Confirme sua Presença">
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                num_adults: 1,
                num_children: 0,
              }}
            >
              {/* Nome */}
              <Form.Item
                label="Seu Nome"
                name="name"
                rules={[
                  { required: true, message: "Por favor, informe seu nome" },
                ]}
              >
                <Input
                  size="large"
                  placeholder="Nome completo"
                  prefix={<UserOutlined />}
                />
              </Form.Item>

              {/* WhatsApp */}
              <Form.Item
                label="WhatsApp"
                name="whatsapp_number"
                rules={[
                  {
                    required: true,
                    message: "Por favor, informe seu WhatsApp",
                  },
                  {
                    pattern: /^\d{10,15}$/,
                    message:
                      "WhatsApp deve conter apenas números (10-15 dígitos)",
                  },
                ]}
              >
                <Input
                  size="large"
                  placeholder="5521999999999"
                  prefix={<WhatsAppOutlined />}
                  maxLength={15}
                />
              </Form.Item>

              {/* Número de pessoas */}
              <div className="grid grid-cols-2 gap-4">
                <Form.Item
                  label="Adultos"
                  name="num_adults"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    size="large"
                    min={0}
                    max={20}
                    className="w-full"
                  />
                </Form.Item>

                <Form.Item label="Crianças (até 12 anos)" name="num_children">
                  <InputNumber
                    size="large"
                    min={0}
                    max={20}
                    className="w-full"
                  />
                </Form.Item>
              </div>

              {/* Nomes dos familiares */}
              <Form.Item
                label="Nomes dos Acompanhantes (opcional)"
                name="family_members"
                extra="Separe os nomes por vírgula. Ex: João Silva, Maria Silva"
              >
                <Input.TextArea
                  rows={2}
                  placeholder="João Silva, Maria Silva"
                />
              </Form.Item>

              {/* Comentários */}
              <Form.Item
                label="Observações (opcional)"
                name="comments"
                extra="Restrições alimentares, necessidades especiais, etc."
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Ex: Sou vegetariano, preciso de cadeira de rodas, etc."
                />
              </Form.Item>

              {/* Botão de enviar */}
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  size="large"
                  block
                  loading={submitting}
                >
                  Confirmar Presença
                </Button>
              </Form.Item>
            </Form>

            {/* Info sobre modificação/cancelamento */}
            {(event.allow_modifications || event.allow_cancellations) && (
              <Alert
                title={
                  <div className="text-sm">
                    {event.allow_modifications && (
                      <p>✓ Você poderá modificar sua confirmação depois</p>
                    )}
                    {event.allow_cancellations && (
                      <p>✓ Você poderá cancelar sua confirmação depois</p>
                    )}
                  </div>
                }
                type="info"
                showIcon={false}
              />
            )}
          </Card>
        )}
      </div>
    </div>
  );
}
