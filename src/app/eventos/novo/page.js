// src/app/eventos/novo/page.js
"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { TimePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

// Configurar dayjs para aceitar formato HH:mm
dayjs.extend(customParseFormat);

export default function NovoEvento() {
  const router = useRouter();

  // ... (resto do código permanece igual até a parte do formulário)

  // State do formulário
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    start_time: "",
    end_time: "",
    address_cep: "",
    address_number: "",
    address_complement: "",
    address_full: "",
    allow_modifications: true,
    allow_cancellations: true,
  });

  // State para os campos do endereço (preenchidos automaticamente)
  const [addressFields, setAddressFields] = useState({
    street: "",
    neighborhood: "",
    city: "",
    state: "",
  });

  // States de feedback
  const [loading, setLoading] = useState(false);
  const [loadingAddress, setLoadingAddress] = useState(false);
  const [cepValidation, setCepValidation] = useState({ type: "", message: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ... (mantenha todas as funções fetchAddress, handleChange, etc)

  // Buscar endereço pelo CEP
  const fetchAddress = async (cep) => {
    const cleanCep = cep.replace(/\D/g, "");

    if (cleanCep.length !== 8) {
      return;
    }

    setLoadingAddress(true);
    setCepValidation({ type: "", message: "" });
    setError("");

    try {
      const response = await axios.get(
        `https://viacep.com.br/ws/${cleanCep}/json/`
      );

      if (response.data.erro) {
        setCepValidation({ type: "error", message: "CEP não encontrado" });
        setAddressFields({ street: "", neighborhood: "", city: "", state: "" });
        setFormData((prev) => ({ ...prev, address_full: "" }));
      } else {
        const fields = {
          street: response.data.logradouro,
          neighborhood: response.data.bairro,
          city: response.data.localidade,
          state: response.data.uf,
        };

        setAddressFields(fields);
        setCepValidation({ type: "success", message: "CEP encontrado!" });

        if (formData.address_number) {
          updateAddressFullWithFields(fields, formData);
        }
      }
    } catch (err) {
      setCepValidation({ type: "error", message: "Erro ao buscar CEP" });
      setAddressFields({ street: "", neighborhood: "", city: "", state: "" });
      setFormData((prev) => ({ ...prev, address_full: "" }));
      console.error("Erro:", err);
    } finally {
      setLoadingAddress(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const newFormData = {
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    };

    setFormData(newFormData);

    if (name === "address_cep") {
      const cleanCep = value.replace(/\D/g, "");

      if (cleanCep.length === 0) {
        setCepValidation({ type: "", message: "" });
        setAddressFields({ street: "", neighborhood: "", city: "", state: "" });
        setFormData((prev) => ({ ...prev, address_full: "" }));
      } else if (cleanCep.length < 8) {
        setCepValidation({
          type: "warning",
          message: `CEP incompleto (${cleanCep.length}/8 dígitos)`,
        });
        setAddressFields({ street: "", neighborhood: "", city: "", state: "" });
        setFormData((prev) => ({ ...prev, address_full: "" }));
      } else if (cleanCep.length === 8) {
        fetchAddress(value);
      }
    }

    if (
      (name === "address_number" || name === "address_complement") &&
      addressFields.street
    ) {
      updateAddressFull(newFormData);
    }
  };

  const handleCepBlur = () => {
    const cleanCep = formData.address_cep.replace(/\D/g, "");

    if (cleanCep.length > 0 && cleanCep.length < 8) {
      setCepValidation({ type: "error", message: "CEP deve ter 8 dígitos" });
    }
  };

  const updateAddressFull = (data) => {
    if (!addressFields.street || !data.address_number) {
      setFormData({ ...data, address_full: "" });
      return;
    }

    let fullAddress = `${addressFields.street}, ${data.address_number}`;

    if (data.address_complement) {
      fullAddress += `, ${data.address_complement}`;
    }

    fullAddress += `, ${addressFields.neighborhood}, ${addressFields.city} - ${addressFields.state}, CEP ${data.address_cep}`;

    setFormData({
      ...data,
      address_full: fullAddress,
    });
  };

  const updateAddressFullWithFields = (fields, data) => {
    if (!fields.street || !data.address_number) {
      return;
    }

    let fullAddress = `${fields.street}, ${data.address_number}`;

    if (data.address_complement) {
      fullAddress += `, ${data.address_complement}`;
    }

    fullAddress += `, ${fields.neighborhood}, ${fields.city} - ${fields.state}, CEP ${data.address_cep}`;

    setFormData((prev) => ({
      ...prev,
      address_full: fullAddress,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/events/create",
        formData,
        { withCredentials: true }
      );

      setSuccess("Evento criado com sucesso!");
      console.log("Evento criado:", response.data);

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Erro ao criar evento");
      console.error("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar simples */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <button
              onClick={() => router.push("/dashboard")}
              className="text-gray-600 hover:text-gray-900 flex items-center"
            >
              ← Voltar
            </button>
            <h1 className="text-xl font-bold text-indigo-600">Venha</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </nav>

      {/* Formulário */}
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Título */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Criar Novo Evento
            </h2>
            <p className="text-gray-600 mt-2">
              Preencha os detalhes do seu evento para gerar o convite
            </p>
          </div>

          {/* Mensagens de feedback */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg">
              {success}
            </div>
          )}

          {/* Formulário */}
          <form onSubmit={handleSubmit}>
            {/* Título do Evento */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Título do Evento *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Ex: Festa de Aniversário"
              />
            </div>

            {/* Descrição */}
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Descrição
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                placeholder="Descreva seu evento (opcional)"
              />
            </div>

            {/* Data e Horários - NOVA VERSÃO COM ANT DESIGN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {/* Data */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Data *
                </label>
                <input
                  type="date"
                  name="event_date"
                  value={formData.event_date}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Hora de Início com TimePicker */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Hora Início *
                </label>
                <TimePicker
                  format="HH:mm"
                  minuteStep={15}
                  value={
                    formData.start_time
                      ? dayjs(formData.start_time, "HH:mm")
                      : null
                  }
                  onChange={(time) => {
                    setFormData({
                      ...formData,
                      start_time: time ? time.format("HH:mm") : "",
                    });
                  }}
                  placeholder="Selecione"
                  size="large"
                  className="w-full"
                  showNow={false}
                  needConfirm={false}
                  required
                />
              </div>

              {/* Hora de Término com TimePicker */}
              <div>
                <label className="block text-gray-700 font-medium mb-2">
                  Hora Fim
                </label>
                <TimePicker
                  format="HH:mm"
                  minuteStep={15}
                  value={
                    formData.end_time ? dayjs(formData.end_time, "HH:mm") : null
                  }
                  onChange={(time) => {
                    setFormData({
                      ...formData,
                      end_time: time ? time.format("HH:mm") : "",
                    });
                  }}
                  placeholder="Selecione"
                  size="large"
                  className="w-full"
                  showNow={false}
                  needConfirm={false}
                  allowClear
                />
              </div>
            </div>

            {/* Seção de Endereço */}
            <div className="mb-6 p-6 bg-gray-50 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Endereço do Evento
              </h3>

              {/* CEP */}
              <div className="mb-4">
                <label className="block text-gray-700 font-medium mb-2">
                  CEP *
                </label>
                <input
                  type="text"
                  name="address_cep"
                  value={formData.address_cep}
                  onChange={handleChange}
                  onBlur={handleCepBlur}
                  required
                  maxLength="9"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
                    cepValidation.type === "error"
                      ? "border-red-300 bg-red-50"
                      : cepValidation.type === "success"
                      ? "border-green-300 bg-green-50"
                      : cepValidation.type === "warning"
                      ? "border-yellow-300 bg-yellow-50"
                      : "border-gray-300"
                  }`}
                  placeholder="00000-000"
                />

                {loadingAddress && (
                  <p className="mt-2 text-sm text-indigo-600 flex items-center">
                    <svg
                      className="animate-spin h-4 w-4 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Buscando endereço...
                  </p>
                )}

                {!loadingAddress && cepValidation.message && (
                  <p
                    className={`mt-2 text-sm flex items-center ${
                      cepValidation.type === "error"
                        ? "text-red-600"
                        : cepValidation.type === "success"
                        ? "text-green-600"
                        : "text-yellow-600"
                    }`}
                  >
                    {cepValidation.type === "error" && "❌ "}
                    {cepValidation.type === "success" && "✅ "}
                    {cepValidation.type === "warning" && "⚠️ "}
                    {cepValidation.message}
                  </p>
                )}
              </div>

              {/* Campos preenchidos automaticamente */}
              {addressFields.street && (
                <>
                  {/* Rua */}
                  <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                      Rua
                    </label>
                    <input
                      type="text"
                      value={addressFields.street}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                    />
                  </div>

                  {/* Número e Complemento lado a lado */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Número *
                      </label>
                      <input
                        type="text"
                        name="address_number"
                        value={formData.address_number}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Ex: 123"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Complemento
                      </label>
                      <input
                        type="text"
                        name="address_complement"
                        value={formData.address_complement}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Apto, Bloco, etc"
                      />
                    </div>
                  </div>

                  {/* Grid: Bairro / Cidade / Estado */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Bairro
                      </label>
                      <input
                        type="text"
                        value={addressFields.neighborhood}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Cidade
                      </label>
                      <input
                        type="text"
                        value={addressFields.city}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Estado
                      </label>
                      <input
                        type="text"
                        value={addressFields.state}
                        readOnly
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                      />
                    </div>
                  </div>

                  {/* Endereço completo (preview) */}
                  {formData.address_full && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg border border-green-200">
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Endereço completo:</strong>
                      </p>
                      <p className="text-sm text-green-700">
                        {formData.address_full}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Checkboxes de Permissões */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="allow_modifications"
                  checked={formData.allow_modifications}
                  onChange={handleChange}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-3 text-gray-700">
                  Permitir que convidados modifiquem suas confirmações
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="allow_cancellations"
                  checked={formData.allow_cancellations}
                  onChange={handleChange}
                  className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label className="ml-3 text-gray-700">
                  Permitir que convidados cancelem suas confirmações
                </label>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => router.push("/dashboard")}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition duration-200"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={
                  loading || !formData.address_full || !formData.start_time
                }
                className="flex-1 px-6 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Criando..." : "Criar Evento"}
              </button>
            </div>

            {/* Nota */}
            {!formData.address_full && addressFields.street && (
              <p className="mt-4 text-sm text-orange-600 text-center">
                ⚠️ Preencha o número do endereço para continuar
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  );
}
