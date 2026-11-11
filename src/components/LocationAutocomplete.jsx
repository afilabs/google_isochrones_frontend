import React, { memo, useRef, useEffect, useCallback } from 'react';
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import SearchOutlineIcon from '../assets/search-outline.svg?react';
import './LocationAutocomplete.scss';

function LocationAutocomplete({ onSelect, currentName, hasMarker }) {
  const inputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const onSelectRef = useRef(onSelect);
  const suppressFillRef = useRef(false);
  const placesLib = useMapsLibrary('places');

  onSelectRef.current = onSelect;

  useEffect(() => {
    if (!placesLib || !inputRef.current || autocompleteRef.current) return;

    autocompleteRef.current = new placesLib.Autocomplete(inputRef.current);

    const listener = autocompleteRef.current.addListener('place_changed', () => {
      const place = autocompleteRef.current?.getPlace();
      if (!place?.geometry?.location) return;

      const name = place.name || place.formatted_address || '';
      const position = {
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
      };

      suppressFillRef.current = true;
      onSelectRef.current(position, name);
    });

    return () => {
      google.maps.event.removeListener(listener);
      autocompleteRef.current = null;
    };
  }, [placesLib]);

  const handleFocus = useCallback(() => {
    if (inputRef.current && hasMarker && !inputRef.current.value) {
      inputRef.current.value = currentName;
      inputRef.current.select();
    }
  }, [currentName, hasMarker]);

  useEffect(() => {
    if (suppressFillRef.current && inputRef.current && hasMarker) {
      inputRef.current.value = currentName;
      suppressFillRef.current = false;
    }
  }, [currentName, hasMarker]);

  return (
    <div className="LocationAutocomplete">
      <div className="LocationAutocomplete__input-wrap">
        <SearchOutlineIcon className="LocationAutocomplete__search-icon" />
        <input
          ref={inputRef}
          type="text"
          defaultValue={hasMarker ? currentName : ''}
          onFocus={handleFocus}
          placeholder="Search for a location..."
          className="LocationAutocomplete__input"
        />
      </div>
    </div>
  );
}

export default memo(LocationAutocomplete);
