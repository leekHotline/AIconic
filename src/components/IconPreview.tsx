'use client';

interface IconPreviewProps {
  svg: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  showBackground?: boolean;
}

export default function IconPreview({ 
  svg, 
  size = 120, 
  className = '',
  style = {},
  showBackground = false 
}: IconPreviewProps) {
  return (
    <div 
      className={className}
      style={{
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: showBackground ? '#f8fafc' : 'transparent',
        borderRadius: showBackground ? 8 : 0,
        ...style
      }}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

// 用于网格展示的小图标
export function IconThumbnail({ 
  svg, 
  selected = false,
  onClick,
  label
}: { 
  svg: string; 
  selected?: boolean;
  onClick?: () => void;
  label?: string;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        background: '#fff',
        borderRadius: 12,
        padding: 8,
        cursor: 'pointer',
        border: selected ? '2px solid #6366f1' : '2px solid #f3f4f6',
        boxShadow: selected ? '0 4px 12px rgba(99, 102, 241, 0.15)' : 'none',
        transition: 'all 0.2s ease',
      }}
    >
      <div 
        style={{ 
          width: '100%', 
          aspectRatio: '1',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        dangerouslySetInnerHTML={{ __html: svg }}
      />
      
      {selected && (
        <div style={{
          position: 'absolute',
          top: 6,
          right: 6,
          width: 18,
          height: 18,
          background: '#6366f1',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="#fff">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
      
      {label && (
        <span style={{
          position: 'absolute',
          bottom: 4,
          left: 8,
          fontSize: 9,
          color: '#6b7280',
          background: 'rgba(255,255,255,0.9)',
          padding: '2px 6px',
          borderRadius: 4,
          fontWeight: 500,
        }}>
          {label}
        </span>
      )}
    </div>
  );
}
