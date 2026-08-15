import React from 'react';

/**
 * Official ProEduvate Logo Component
 * Renders the uploaded official brand assets: /proeduvate-logo.png & /icon only Transparent.png
 */
export default function ProEduvateLogo({
  variant = 'full',
  theme = 'light',
  height = 36,
  className = ''
}) {
  if (variant === 'mark') {
    return (
      <div className={`proeduvate-logo-mark ${className}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
        <img
          src="/icon only Transparent.png"
          alt="ProEduvate Mark"
          style={{ height: `${height}px`, width: 'auto', objectFit: 'contain', display: 'block' }}
        />
      </div>
    );
  }

  return (
    <div className={`proeduvate-logo ${className}`} style={{ display: 'inline-flex', alignItems: 'center' }}>
      <img
        src="/proeduvate-logo-black.png"
        alt="ProEduvate"
        style={{
          height: `${height}px`,
          width: 'auto',
          objectFit: 'contain',
          display: 'block',
          // Optional subtle contrast filter if placed on dark background
          filter: theme === 'dark' ? 'drop-shadow(0 0 1px rgba(255,255,255,0.4))' : 'none'
        }}
      />
    </div>
  );
}
