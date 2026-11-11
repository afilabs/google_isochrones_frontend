import React, { memo, useCallback, useRef } from 'react';
import { Map, Marker } from '@vis.gl/react-google-maps';
import MapPlaceholderIcon from '../assets/map-placeholder.svg?react';
import Isochrone from './Isochrone';
import './MapView.scss';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

function MapView({ markerPosition, onMapClick, polygonData }) {
  const onMapClickRef = useRef(onMapClick);
  onMapClickRef.current = onMapClick;

  const handleClick = useCallback((e) => {
    if (e.detail?.latLng) {
      onMapClickRef.current({
        lat: e.detail.latLng.lat,
        lng: e.detail.latLng.lng,
      });
    }
  }, []);

  if (!API_KEY) {
    return (
      <div className="MapView__placeholder">
        <div className="MapView__placeholder-content">
          <MapPlaceholderIcon className="MapView__placeholder-icon" />
          <p className="MapView__placeholder-text">Set VITE_GOOGLE_MAPS_API_KEY in frontend/.env</p>
        </div>
      </div>
    );
  }

  return (
    <Map
      className="MapView"
      defaultCenter={{ lat: 49.25363726536889, lng: -123.1114298669681 }}
      defaultZoom={12}
      mapTypeControl={false}
      streetViewControl={false}
      fullscreenControl
      fullscreenControlOptions={{ position: 5 }}
      zoomControl
      zoomControlOptions={{ position: 5 }}
      onClick={handleClick}
      styles={[
        { featureType: 'poi', stylers: [{ visibility: 'off' }] },
        { featureType: 'transit', stylers: [{ visibility: 'off' }] },
      ]}
    >
      {markerPosition && <Marker position={markerPosition} />}
      <Isochrone data={polygonData} />
    </Map>
  );
}

export default memo(MapView);
