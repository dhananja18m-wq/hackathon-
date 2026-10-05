'use client';

import React, { useState } from 'react';
import { Cpu } from 'lucide-react';

type ResilientImageProps = {
  src?: string | null;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  priority?: boolean;
};

/** A native image with an intentional, design-system-compatible no-media state. */
export function ResilientImage({ src, alt, className = '', fallbackClassName = '', priority = false }: ResilientImageProps) {
  const [failed, setFailed] = useState(!src);
  if (failed) {
    return <div role="img" aria-label={`${alt} — image unavailable`} className={`bg-[#123F30] text-[#D4F55C] flex items-center justify-center ${fallbackClassName || className}`}><div className="text-center"><Cpu className="w-7 h-7 mx-auto opacity-80" /><span className="block mt-2 text-[10px] font-mono uppercase tracking-wider text-[#B4CDC1]">Build image unavailable</span></div></div>;
  }
  return <img src={src!} alt={alt} className={className} loading={priority ? 'eager' : 'lazy'} decoding="async" onError={() => setFailed(true)} />;
}
