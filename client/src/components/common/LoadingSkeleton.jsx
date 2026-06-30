// Loading skeleton placeholders - shown while data is fetching

export const CardSkeleton = () => (
  <div className="glass-card p-6 space-y-3">
    <div className="skeleton h-6 w-1/3" />
    <div className="skeleton h-4 w-full" />
    <div className="skeleton h-4 w-2/3" />
  </div>
);

export const MapSkeleton = () => (
  <div className="map-container skeleton flex items-center justify-center">
    <span className="text-gray-400">Loading map...</span>
  </div>
);

export const ListSkeleton = ({ count = 3 }) => (
  <div className="space-y-3">
    {Array.from({ length: count }).map((_, i) => (
      <CardSkeleton key={i} />
    ))}
  </div>
);
