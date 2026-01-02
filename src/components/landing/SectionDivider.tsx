'use client';

interface SectionDividerProps {
  color?: string;
}

export default function SectionDivider({ color = 'rgba(147,197,253,0.3)' }: SectionDividerProps) {
  return (
    <div style={{
      position: 'relative',
      height: '200px',
      marginTop: '-100px',
      marginBottom: '-100px',
      pointerEvents: 'none',
      zIndex: 0
    }}>
      {/* 高斯模糊过渡层 */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '100%',
        maxWidth: '1000px',
        height: '150px',
        background: `radial-gradient(ellipse at center, ${color} 0%, transparent 70%)`,
        filter: 'blur(60px)',
        opacity: 0.6
      }} />
    </div>
  );
}
