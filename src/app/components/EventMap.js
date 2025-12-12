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

export default function EventMap({ address, latitude, longitude }) {
  const [coordinates, setCoordinates] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Se temos coordenadas, usar diretamente
    if (latitude && longitude) {
      console.log("✅ Usando coordenadas do backend:", { latitude, longitude });
      setCoordinates({ lat: latitude, lng: longitude });
      setLoading(false);
    } else {
      // Sem coordenadas = não mostra mapa
      console.log("⚠️ Coordenadas não disponíveis - mapa não será exibido");
      setLoading(false);
    }
  }, [address, latitude, longitude]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-100 rounded-lg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-2"></div>
          <p className="text-gray-500 text-sm">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  // Se não tiver coordenadas, não mostra o mapa
  if (!coordinates) {
    return null;
  }

  return (
    <MapContainer
      center={[coordinates.lat, coordinates.lng]}
      zoom={15}
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
