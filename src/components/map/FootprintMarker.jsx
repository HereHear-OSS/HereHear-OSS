import { CircleMarker } from 'react-leaflet';

/**
 * 발자국 마커. 활성(반경 안) = 진하게, 비활성(반경 밖) = 흐리게.
 * TODO(9주): 발자국 아이콘(divIcon)으로 교체, 선택 상태 스타일 다듬기
 */
export default function FootprintMarker({ footprint, selected, onSelect }) {
  const { isActive } = footprint;
  return (
    <CircleMarker
      center={[footprint.lat, footprint.lng]}
      radius={selected ? 12 : 9}
      pathOptions={{
        color: isActive ? '#db2777' : '#9ca3af',
        fillColor: isActive ? '#ec4899' : '#d1d5db',
        fillOpacity: isActive ? 0.9 : 0.4,
      }}
      eventHandlers={{ click: () => onSelect(footprint) }}
    />
  );
}
