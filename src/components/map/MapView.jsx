import { MapContainer, TileLayer } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { DEFAULT_MAP_CENTER, DEFAULT_MAP_ZOOM } from '../../constants/policy';
import CurrentLocationMarker from './CurrentLocationMarker';
import FootprintMarker from './FootprintMarker';

/**
 * 지도 + 현재 위치 + 발자국 마커.
 * TODO(9주): 현재 위치로 지도 이동(useMap), 반경 2km 원(Circle) 표시 등
 * TODO(13주): 타일 로딩 실패 시 MAP_FAILED 처리
 */
export default function MapView({ position, footprints, selectedId, onSelectFootprint }) {
  const center = position ? [position.lat, position.lng] : DEFAULT_MAP_CENTER;

  return (
    <MapContainer center={center} zoom={DEFAULT_MAP_ZOOM} className="map-view">
      {/* OpenStreetMap 이용 조건상 출처 표기 필수 */}
      <TileLayer
        url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {position && <CurrentLocationMarker position={position} />}
      {footprints.map((fp) => (
        <FootprintMarker
          key={fp.id}
          footprint={fp}
          selected={fp.id === selectedId}
          onSelect={onSelectFootprint}
        />
      ))}
    </MapContainer>
  );
}
