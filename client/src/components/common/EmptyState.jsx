// Shown when a list has no data

const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    {Icon && (
      <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-dark-600 flex items-center justify-center mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
    )}
    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-1">{title}</h3>
    {description && <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">{description}</p>}
    {action}
  </div>
);

export default EmptyState;
