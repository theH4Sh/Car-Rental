const SkeletonCard = () => {
    return (
      <div className="w-72 h-64 bg-white rounded-xl shadow p-4 animate-pulse">
        <div className="bg-gray-300 h-32 w-full rounded-md mb-4"></div>
        <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/3"></div>
      </div>
    )
  }
  
export default SkeletonCard;
  