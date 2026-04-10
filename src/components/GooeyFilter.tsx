import React from 'react';

interface GooeyFilterProps {
  zoom?: number;
}

export const GooeyFilter: React.FC<GooeyFilterProps> = ({ zoom = 1 }) => (
  <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true">
    <defs>
      <filter id="gooey">
        <feGaussianBlur in="SourceGraphic" stdDeviation={8 * zoom} result="blur" />
        <feColorMatrix 
          in="blur" 
          mode="matrix" 
          values="
            1 0 0 0 0  
            0 1 0 0 0  
            0 0 1 0 0  
            0 0 0 20 -8
          " 
          result="gooey" 
        />
        <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
      </filter>
    </defs>
  </svg>
);
