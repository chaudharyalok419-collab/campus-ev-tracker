// Distance and ETA calculation utilities
// Uses the Haversine formula to calculate distance between two GPS coordinates

export const calculateDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;

  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return distance;
};

const toRadians = (degrees) => degrees * (Math.PI / 180);

export const formatDistance = (distanceInKm) => {
  if (distanceInKm < 1) {
    return `${Math.round(distanceInKm * 1000)} m`;
  }
  return `${distanceInKm.toFixed(1)} km`;
};

export const calculateETA = (distanceInKm, averageSpeedKmh = 15) => {
  const timeInHours   = distanceInKm / averageSpeedKmh;
  const timeInMinutes = Math.ceil(timeInHours * 60);

  if (timeInMinutes < 1) return 'Less than 1 min';
  if (timeInMinutes === 1) return '1 min';
  if (timeInMinutes > 60) {
    const hours = Math.floor(timeInMinutes / 60);
    const mins  = timeInMinutes % 60;
    return `${hours}h ${mins}m`;
  }
  return `${timeInMinutes} mins`;
};

export const findNearestEV = (userLat, userLng, vehicles) => {
  if (!vehicles || vehicles.length === 0) return null;

  let nearest = null;
  let minDistance = Infinity;

  vehicles.forEach(vehicle => {
    if (!vehicle.location) return;

    const distance = calculateDistance(
      userLat, userLng,
      vehicle.location.lat, vehicle.location.lng
    );

    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...vehicle, distance };
    }
  });

  return nearest;
};

export const isWithinGeofence = (lat, lng, campusCenter, radiusKm = 2) => {
  const distance = calculateDistance(lat, lng, campusCenter.lat, campusCenter.lng);
  return distance <= radiusKm;
};
