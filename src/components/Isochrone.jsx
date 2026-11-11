import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

function computeBounds(geojson) {
  const bounds = new google.maps.LatLngBounds();
  const walk = (coords) => {
    if (typeof coords[0] === 'number') {
      bounds.extend({ lat: coords[1], lng: coords[0] });
    } else {
      coords.forEach(walk);
    }
  };
  walk(geojson.coordinates);
  return bounds;
}

function Isochrone({ data }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !data?.polygons?.length) return;

    const { geojson } = data.polygons[0];
    const layer = new google.maps.Data({ map });

    layer.addGeoJson({
      type: 'Feature',
      geometry: geojson,
      properties: {},
    });

    layer.setStyle({
      fillColor: '#3B82F6',
      fillOpacity: 0.15,
      strokeColor: '#2563EB',
      strokeWeight: 2,
    });

    const bounds = computeBounds(geojson);
    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, 20);
    }

    return () => layer.setMap(null);
  }, [map, data]);

  return null;
}

export default Isochrone;
