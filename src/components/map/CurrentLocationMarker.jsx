import { CircleMarker } from 'react-leaflet';

export default function CurrentLocationMarker({ position }) {
  return (
    <CircleMarker
      center={[position.lat, position.lng]}
      radius={8}
      pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.9 }}
    />
  );
}
