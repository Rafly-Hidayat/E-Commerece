import React, { useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
}

const LazyImage: React.FC<LazyImageProps> = ({ src, alt, className }) => {
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
  };

  return (
    <LazyLoadImage
      alt={alt}
      effect="blur"
      src={imageError ? "/path/to/default-image.jpg" : src}
      onError={handleError}
      className={className}
    />
  );
};

export default LazyImage;
