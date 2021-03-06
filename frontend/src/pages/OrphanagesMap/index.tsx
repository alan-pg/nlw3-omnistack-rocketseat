import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FiPlus, FiArrowRight } from "react-icons/fi";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";

import api from "../../services/api";

import { Container } from "./styles";

import mapIcon from "../../assets/mapIcon";

import mapMarkerImg from "../../assets/images/map-marker.svg";

export interface IOrphanage {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  about: string;
  instructions: string;
  opening_hours: string;
  open_on_weekends: boolean;
  images: Array<{
    id: number;
    path: string;
    url: string;
  }>;
}

export default function OrphanagesMap() {
  const [getOrphanages, setOrphanages] = useState<IOrphanage[]>([]);
  const [userPosition, setUserPosition] = useState({
    latitude: -22.922071843723177,
    longitude: -43.22373524483933,
    zoom: 7,
  });

  function success(pos: GeolocationPosition) {
    setUserPosition({
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
      zoom: 15,
    });
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(success, undefined, {
      enableHighAccuracy: true,
      timeout: 5000,
    });
  }, []);

  useEffect(() => {
    fetchOrphanages();
  }, []);

  async function fetchOrphanages() {
    try {
      const response = await api.get("/orphanages");

      setOrphanages(response.data);
    } catch (error) {
      console.log(error);
      alert("Erro ao buscar orfanatos");
    }
  }

  return (
    <Container>
      <aside>
        <header>
          <img src={mapMarkerImg} alt="happy logo" />

          <h2>Escolha um orfanato no mapa</h2>
          <p>Muitas crianças estão esperando a sua visita :)</p>
        </header>
        <footer>
          <strong>Rio de Janeiro</strong>
          <span>Rio de Janeiro</span>
        </footer>
      </aside>

      <Map
        center={[userPosition.latitude, userPosition.longitude]}
        zoom={userPosition.zoom}
        style={{
          width: "100%",
          height: "100%",
        }}
        useFlyTo={true}
      >
        <TileLayer url="https://a.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {getOrphanages.map((orphanage) => (
          <Marker
            key={orphanage.id}
            position={[orphanage.latitude, orphanage.longitude]}
            icon={mapIcon}
          >
            <Popup closeButton={false} minWidth={240} maxWidth={240}>
              {orphanage.name}
              <Link to={`/orphanages/${orphanage.id}`}>
                <FiArrowRight color="#eee" />
              </Link>
            </Popup>
          </Marker>
        ))}
      </Map>

      <Link to="/orphanages/create" className="create-orphanage">
        <FiPlus size={32} color="#eee" />
      </Link>
    </Container>
  );
}
