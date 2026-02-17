"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImageProps = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  width?: number;
  height?: number;
  unoptimized?: boolean;
};

export default function ProductImage({
  src,
  alt,
  fill = false,
  className = "",
  width,
  height,
  unoptimized = false,
}: ProductImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const placeholder = "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=80";

  const handleError = () => {
    if (!imgSrc.includes("photo-1505740420928")) {
      setImgSrc(placeholder);
    }
  };

  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        fill
        className={className}
        onError={handleError}
        unoptimized={unoptimized || imgSrc.includes("unsplash.com")}
      />
    );
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width || 500}
      height={height || 500}
      className={className}
      onError={handleError}
      unoptimized={unoptimized || imgSrc.includes("unsplash.com")}
    />
  );
}
