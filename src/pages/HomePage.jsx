import React, { useState, useCallback, useMemo, useEffect, useRef, memo } from 'react';
import MapView from '../components/MapView';
import LocationAutocomplete from '../components/LocationAutocomplete';
import ErrorAlert from '../components/ErrorAlert';
import { useIsochrone } from '../hooks/useIsochrone';
import carIcon from '../assets/car.svg';
import bikeIcon from '../assets/bike.svg';
import walkIcon from '../assets/walk.svg';
import copyIcon from '../assets/copy.svg';
import SpinnerIcon from '../assets/spinner.svg?react';
import './HomePage.scss';

const TRAVEL_MODES = [
  { value: 'DRIVE', icon: carIcon },
  { value: 'BICYCLE', icon: bikeIcon },
  { value: 'WALK', icon: walkIcon },
];

const DURATIONS = [
  { label: '15m', seconds: 900 },
  { label: '30m', seconds: 1800 },
  { label: '45m', seconds: 2700 },
  { label: '60m', seconds: 3600 },
];

const FIDELITY_OPTIONS = [
  { value: null, label: 'Auto' },
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Med' },
  { value: 'HIGH', label: 'High' },
];

function HomePage() {
  const [travelMode, setTravelMode] = useState('BICYCLE');
  const [travelDuration, setTravelDuration] = useState(1800);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [locationName, setLocationName] = useState('San Francisco State University');
  const [routingPreference, setRoutingPreference] = useState('TRAFFIC_UNAWARE');
  const [enableSmoothing, setEnableSmoothing] = useState(true);
  const [activeTab, setActiveTab] = useState('request');
  const [copied, setCopied] = useState(false);
  
  const [polygonData, setPolygonData] = useState(null);
  const { loading, error, fetchIsochrone, clearError } = useIsochrone();

  // Fetch a new isochrone whenever the origin or any setting changes
  useEffect(() => {
    if (!markerPosition) return;

    let cancelled = false;

    fetchIsochrone({
        position: markerPosition,
        travelMode,
        travelDuration,
        routingPreference,
        enableSmoothing
      }).then((data) => {
        if (!cancelled && data) setPolygonData(data);
      });

      // If settings change before this request finishes, ignore its response
      return () => {
        cancelled = true;
      };
  }, [ markerPosition, travelMode, travelDuration, routingPreference, enableSmoothing, fetchIsochrone ]);

  const handleMapClick = useCallback((position) => {
    setMarkerPosition(position);
    setLocationName(`${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`);
  }, []);

  const handleLocationSelect = useCallback((position, name) => {
    setMarkerPosition(position);
    setLocationName(name);
  }, []);

  const curlCommand = useMemo(() => {
    const lat = markerPosition?.lat ?? 37.7241492;
    const lng = markerPosition?.lng ?? -122.4799405;
    const body = {
      location: { latitude: lat, longitude: lng },
      travelDuration: `${travelDuration}s`,
      travelMode: travelMode,
      routingPreference: routingPreference,
      enableSmoothing: enableSmoothing,
      travelDirection: 'FROM',
    };

    return `curl -X POST "https://isochrones.googleapis.com/v1/isochrones:generate?key=YOUR_API_KEY" \\\n  -H "Content-Type: application/json" \\\n  -d '${JSON.stringify(body, null, 2)}'`;
  }, [markerPosition, travelMode, travelDuration, routingPreference, enableSmoothing]);

  const handleCopyRequest = async () => {
    await navigator.clipboard.writeText(curlCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyResponse = async () => {
    if (!rawResponse) return;
    await navigator.clipboard.writeText(JSON.stringify(rawResponse, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const liveDisabled = travelMode !== 'DRIVE';

  return (
    <div className="HomePage">
      {/* Map */}
      <div className="HomePage__map">
        <MapView
          markerPosition={markerPosition}
          onMapClick={handleMapClick}
          polygonData={polygonData}
        />

        {error && (
          <div className="HomePage__error-wrap">
            <ErrorAlert message={error} onDismiss={clearError} />
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      <div className="HomePage__sidebar">
        <div className="HomePage__controls">
          {/* Origin Point */}
          <section>
            <label className="HomePage__section-label">ORIGIN POINT</label>
            <LocationAutocomplete
              onSelect={handleLocationSelect}
              currentName={locationName}
              hasMarker={!!markerPosition}
            />
          </section>

          {/* Travel Mode + Travel Time */}
          <section>
            <div className="HomePage__mode-row">
              {/* Travel Mode */}
              <div className="HomePage__mode-col">
                <label className="HomePage__section-label">TRAVEL MODE</label>
                <div className="HomePage__mode-buttons">
                  {TRAVEL_MODES.map((m) => (
                    <button
                      key={m.value}
                      onClick={() => setTravelMode(m.value)}
                      className={`HomePage__mode-btn${travelMode === m.value ? ' HomePage__mode-btn--active' : ''}`}
                    >
                      <img
                        src={m.icon}
                        alt=""
                        className={`HomePage__mode-icon${travelMode === m.value ? ' HomePage__mode-icon--active' : ''}`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Time */}
              <div className="HomePage__mode-col">
                <label className="HomePage__section-label">TRAVEL TIME</label>
                <div className="HomePage__time-buttons">
                  {DURATIONS.map((d) => (
                    <button
                      key={d.seconds}
                      onClick={() => setTravelDuration(d.seconds)}
                      className={`HomePage__time-btn${travelDuration === d.seconds ? ' HomePage__time-btn--active' : ''}`}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Toggles */}
          <section>
            <label className="HomePage__section-label">OPTIONS</label>
            <div className="HomePage__toggles">
              {/* Live traffic toggle */}
              <div className={`HomePage__toggle${liveDisabled ? ' HomePage__toggle--disabled' : ''}`}>
                <div
                  role="switch"
                  aria-checked={!liveDisabled && routingPreference === 'TRAFFIC_AWARE'}
                  onClick={() => {
                    if (liveDisabled) return;
                    setRoutingPreference(
                      routingPreference === 'TRAFFIC_AWARE' ? 'TRAFFIC_UNAWARE' : 'TRAFFIC_AWARE',
                    );
                  }}
                  className={`HomePage__toggle-switch HomePage__toggle-switch--${!liveDisabled && routingPreference === 'TRAFFIC_AWARE' ? 'on' : 'off'}${liveDisabled ? ' HomePage__toggle-switch--disabled' : ''}`}
                  title={liveDisabled ? 'Live traffic only available for Driving mode' : undefined}
                >
                  <div
                    className={`HomePage__toggle-knob HomePage__toggle-knob--${!liveDisabled && routingPreference === 'TRAFFIC_AWARE' ? 'on' : 'off'}`}
                  />
                </div>
                <span className="HomePage__toggle-label">Live traffic</span>
              </div>

              {/* Smooth edges toggle */}
              <div className="HomePage__toggle">
                <div
                  role="switch"
                  aria-checked={enableSmoothing}
                  onClick={() => setEnableSmoothing(!enableSmoothing)}
                  className={`HomePage__toggle-switch HomePage__toggle-switch--${enableSmoothing ? 'on' : 'off'}`}
                >
                  <div
                    className={`HomePage__toggle-knob HomePage__toggle-knob--${enableSmoothing ? 'on' : 'off'}`}
                  />
                </div>
                <span className="HomePage__toggle-label">Smooth edges</span>
              </div>
            </div>
          </section>

          {/* Loading indicator */}
          {loading && (
            <div className="HomePage__loading">
              <SpinnerIcon className="HomePage__spinner" />
              Generating...
            </div>
          )}
        </div>

        {/* API Request/Response */}
        <div className="HomePage__api-panel">
          <div className="HomePage__api-tabs">
            <button
              onClick={() => setActiveTab('request')}
              className={`HomePage__api-tab${activeTab === 'request' ? ' HomePage__api-tab--active' : ' HomePage__api-tab--inactive'}`}
            >
              API Request
            </button>
            <button
              onClick={() => setActiveTab('response')}
              className={`HomePage__api-tab${activeTab === 'response' ? ' HomePage__api-tab--active' : ' HomePage__api-tab--inactive'}`}
            >
              API Response
            </button>
          </div>
          <div className="HomePage__api-content">
            {activeTab === 'request' ? (
              <>
                <span className="HomePage__code-label">curl Request</span>
                <div className="HomePage__code-block">
                  <div className="HomePage__copy-row">
                    <button
                      onClick={handleCopyRequest}
                      className="HomePage__copy-btn"
                      title="Copy"
                    >
                      <img src={copyIcon} alt="Copy" className="HomePage__copy-icon" />
                    </button>
                    {copied && <span className="HomePage__copy-tooltip">Copied!</span>}
                  </div>
                  <pre className="HomePage__code-pre HomePage__code-pre--with-copy">
                    {curlCommand}
                  </pre>
                </div>
              </>
            ) : (
              <>
                <span className="HomePage__code-label">JSON Response</span>
                <div className="HomePage__code-block">
                  {rawResponse ? (
                    <div className="HomePage__copy-row">
                      <button
                        onClick={handleCopyResponse}
                        className="HomePage__copy-btn"
                        title="Copy"
                      >
                        <img src={copyIcon} alt="Copy" className="HomePage__copy-icon" />
                      </button>
                      {copied && <span className="HomePage__copy-tooltip">Copied!</span>}
                    </div>
                  ) : null}
                  <pre
                    className={`HomePage__code-pre${rawResponse ? ' HomePage__code-pre--response-copy' : ''}`}
                  >
                    {rawResponse
                      ? JSON.stringify(rawResponse, null, 2)
                      : 'Generate an isochrone to see the API response...'}
                  </pre>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(HomePage);
