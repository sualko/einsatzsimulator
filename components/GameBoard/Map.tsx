import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { icon, Map as LeafletMap } from 'leaflet'
import { useEffect, useState } from "react";

const LocationMarkerIcon = icon({
  iconUrl: "/marker.min.svg",
  iconSize: [12, 20],
});

const LocationMarker: React.FC<{
  longitude: number,
  latitude: number,
  label?: string,
}> = ({ latitude, longitude, label }) => (
  <Marker position={[latitude, longitude]} icon={LocationMarkerIcon}>
    {label && <Popup>{label}</Popup>}
  </Marker>
);

type Props = {
  longitude: number,
  latitude: number,
  size?: string | number | 'fullsize' | { width: string | number, height: string | number },
  withMarker?: boolean,
  dragging?: boolean,
  marker?: {
    longitude: number,
    latitude: number,
    label?: string,
  }[]
}

const Map: React.FC<Props> = ({ longitude, latitude, size, withMarker, marker, dragging }) => {
  const [map, setMap] = useState<LeafletMap>();

  useEffect(() => {
    if (map) {
      map.flyTo([latitude, longitude]);
    }
  }, [longitude, latitude, map]);

  const style = size === 'fullsize' ? {
    height: '100vh',
    width: '100vw',
  } : (typeof size === 'object' && size !== null ? size : {
    height: size || 400,
    width: size || 400,
  });

  return (
    <MapContainer
      center={[latitude, longitude]}
      whenCreated={setMap}
      zoom={25}
      zoomControl={false}
      attributionControl={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      dragging={typeof dragging === 'boolean' ? dragging : false}
      style={{ ...style }}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {withMarker && <LocationMarker latitude={latitude} longitude={longitude} />}
      {marker?.map((m, i) => <LocationMarker key={i} {...m} />)}
    </MapContainer>
  )
}

export default Map