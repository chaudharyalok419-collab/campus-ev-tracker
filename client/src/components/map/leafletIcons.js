// Leaflet's default marker icons reference image paths that break under Vite's bundler.
// This file patches the default icon URLs to use a CDN instead, and exports
// a factory for creating custom colored EV/student markers using divIcon (pure CSS/HTML,
// no image files needed - keeps bundle small and avoids the broken-icon problem entirely).

import L from 'leaflet';

// Fix the default marker icon (used as a fallback anywhere we don't pass a custom icon)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Create a custom EV marker - a colored circle with a small EV glyph,
// color depends on status (green = available, amber = occupied, gray = offline)
export const createEVIcon = (status = 'available', heading = 0) => {
  const colors = {
    available: '#22c55e',
    occupied:  '#eab308',
    offline:   '#9ca3af',
    on_ride:   '#eab308',
  };
  const color = colors[status] || colors.offline;

  return L.divIcon({
    className: 'custom-ev-marker',
    html: `
      <div style="position: relative; width: 36px; height: 36px;">
        <div style="
          position: absolute; inset: 0;
          background: ${color};
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          display: flex; align-items: center; justify-content: center;
          transform: rotate(${heading}deg);
        ">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
            <path d="M5 17h14v-5l-2-5H7L5 12v5zm2-9h10l1.5 4h-13L7 8z"/>
            <circle cx="7.5" cy="17" r="1.5" fill="${color}"/>
            <circle cx="16.5" cy="17" r="1.5" fill="${color}"/>
          </svg>
        </div>
        ${status !== 'offline' ? `<div class="ev-marker-ping" style="
          position: absolute; inset: 0;
          background: ${color};
          border-radius: 50%;
          opacity: 0.4;
        "></div>` : ''}
      </div>
    `,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
  });
};

// Create the student's own "you are here" marker - a simple blue dot
export const createUserIcon = () => {
  return L.divIcon({
    className: 'custom-user-marker',
    html: `
      <div style="
        width: 18px; height: 18px;
        background: #3b82f6;
        border-radius: 50%;
        border: 3px solid white;
        box-shadow: 0 2px 6px rgba(0,0,0,0.4);
      "></div>
    `,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });
};

export default L;
