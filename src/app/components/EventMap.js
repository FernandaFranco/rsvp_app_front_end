// src/app/components/EventMap.js
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix para ícones do Leaflet no Next.js
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function EventMap({ address }) {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    geocodeAddress(address);
  }, [address]);

  const geocodeAddress = async (addr) => {
    try {
      console.log("🗺️ Endereço recebido:", addr);

      let coords = null;

      // Estratégia 1: Tentar com rua + número + cidade
      // Formato: "Rua X, 123, Apto Y, Bairro, Cidade - Estado, CEP..."
      const streetMatch = addr.match(/^([^,]+),\s*(\d+)[^,]*/);
      const cityMatch = addr.match(/,\s*([^,]+)\s*-\s*([A-Z]{2})/);

      console.log("🔍 Debug matches:", {
        streetMatch: streetMatch ? [streetMatch[1], streetMatch[2]] : null,
        cityMatch: cityMatch ? [cityMatch[1], cityMatch[2]] : null,
      });

      if (streetMatch && cityMatch) {
        const street = streetMatch[1];
        const number = streetMatch[2];
        const city = cityMatch[1];
        const state = cityMatch[2];
        const query = `${street}, ${number}, ${city}, ${state}, Brasil`;
        console.log("🗺️ Estratégia 1 - Endereço completo:", query);
        coords = await tryGeocode(query);
      } else {
        console.log("⚠️ Estratégia 1 pulada - regex não encontrou padrão esperado");
      }

      if (!coords) {
        // Estratégia 2: Tentar apenas com CEP
        const cepMatch = addr.match(/CEP\s*(\d{5}-?\d{3})/i);
        if (cepMatch) {
          const cep = cepMatch[1];
          console.log("🗺️ Estratégia 2 - CEP:", cep);
          coords = await tryGeocode(`${cep}, Brasil`);
        }
      }

      if (!coords && cityMatch) {
        // Estratégia 3: Tentar apenas cidade + estado
        const city = cityMatch[1];
        const state = cityMatch[2];
        console.log("🗺️ Estratégia 3 - Cidade:", `${city}, ${state}, Brasil`);
        coords = await tryGeocode(`${city}, ${state}, Brasil`);
      }

      if (coords) {
        console.log("✅ Coordenadas encontradas:", coords);
        setCoordinates(coords);
      } else {
        console.log("❌ Nenhuma coordenada encontrada, usando fallback");
        // Fallback: centro do Rio de Janeiro
        setCoordinates({ lat: -22.9068, lng: -43.1729 });
      }
    } catch (err) {
      console.error("❌ Erro ao geocodificar:", err);
      setCoordinates({ lat: -22.9068, lng: -43.1729 });
    } finally {
      setLoading(false);
    }
  };

  const tryGeocode = async (query) => {
    try {
      // OPÇÃO 1: Nominatim (OpenStreetMap) - Gratuito, sem API key
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
          `q=${encodeURIComponent(query)}&` +
          `format=json&` +
          `limit=1&` +
          `countrycodes=br`,
        {
          headers: {
            "User-Agent": "EventApp/1.0", // Nominatim requer User-Agent
          },
        }
      );

      const data = await response.json();

      console.log("📍 Nominatim API response:", {
        resultsCount: data?.length || 0,
        query: query,
      });

      if (data && data.length > 0) {
        return {
          lat: parseFloat(data[0].lat),
          lng: parseFloat(data[0].lon),
        };
      }

      return null;
    } catch (err) {
      console.error("Erro no tryGeocode:", err);
      return null;
    }
  };

  if (loading || !coordinates) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[coordinates.lat, coordinates.lng]}
      zoom={16} // Aumentei o zoom para ver melhor
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[coordinates.lat, coordinates.lng]}>
        <Popup>
          <div className="text-sm">
            <strong>Local do Evento</strong>
            <br />
            {address}
          </div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
