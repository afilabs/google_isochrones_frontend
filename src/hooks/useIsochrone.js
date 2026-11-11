import { useState, useCallback } from 'react';
import axios from 'axios';
import { generateIsochrone } from '../api/isochrones';

export function useIsochrone() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sends the request and returns the response, or null if it failed.
  // The caller (HomePage) decides what to do with the data.
  const fetchIsochrone = useCallback(async (params) => {
    setLoading(true);
    setError(null);

    try {
      const request = {
        latitude: params.position.lat,
        longitude: params.position.lng,
        travelMode: params.travelMode,
        travelDuration: params.travelDuration,
        routingPreference: params.routingPreference,
        enableSmoothing: params.enableSmoothing,
        ...(params.polygonFidelity ? { polygonFidelity: params.polygonFidelity } : {}),
      };

      const data = await generateIsochrone(request);

      // A 204 "no content" response doesn't throw in axios, it arrives as an empty body
      if (!data?.polygons?.length) {
        setError('No reachable area found for these parameters.');
        return null;
      }

      return data;
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data?.message || `Server error (HTTP ${err.response.status})`);
      } else {
        setError(err.message || 'An unexpected error occurred.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { loading, error, fetchIsochrone, clearError };
}