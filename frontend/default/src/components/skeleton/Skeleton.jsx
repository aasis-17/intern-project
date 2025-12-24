// src/components/common/Skeleton.jsx
const Skeleton = ({ className = "" }) => {
  return (
    <div
      className={`animate-pulse rounded-md bg-red-200 ${className}`}
    />
  );
};

export default Skeleton;
