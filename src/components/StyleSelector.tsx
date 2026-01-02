'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface StyleOption {
  id: string;
  name: string;
  platform: string;
  description: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    accent: string;
  };
}

interface StyleSelectorProps {
  selectedStyles: string[];
  onStylesChange: (styles: string[]) => void;
  maxSelection?: number;
}

// 默认选中的风格
const DEFAULT_STYLES = ['appstore', 'material', 'fluent', 'neon'];

export default function StyleSelector({ 
  selectedStyles, 
  onStylesChange, 
  maxSelection = 4 
}: StyleSelectorProps) {
  const [allStyles, setAllStyles] = useState<StyleOption[]>([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // 从 API 获取所有可用风格
    fetch('/api/styles')
      .then(res => res.json())
      .then(data => setAllStyles(data.styles || []))
      .catch(console.error);
  }, []);

  const toggleStyle = (styleId: string) => {
    if (selectedStyles.includes(styleId)) {
      // 至少保留一个风格
      if (selectedStyles.length > 1) {
        onStylesChange(selectedStyles.filter(s => s !== styleId));
      }
    } else if (selectedStyles.length < maxSelection) {
      onStylesChange([...selectedStyles, styleId]);
    }
  };

  const resetToDefault = () => {
    onStylesChange(DEFAULT_STYLES);
  };

  return (
    <div style={{ position: 'relative' }}>
      {/* 触发按钮 */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '8px 14px',
          background: isExpanded ? '#eef2ff' : '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '13px',
          color: '#374151',
          transition: 'all 0.2s',
        }}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
            d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
        <span>风格 ({selectedStyles.length}/{maxSelection})</span>
        <svg 
          width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.2s' }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 展开的选择面板 */}
      {isExpanded && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            marginTop: '8px',
            width: '360px',
            background: '#fff',
            borderRadius: '12px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
            border: '1px solid #e5e7eb',
            zIndex: 100,
            overflow: 'hidden',
          }}
        >
          {/* 头部 */}
          <div style={{
            padding: '12px 16px',
            borderBottom: '1px solid #f3f4f6',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <span style={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>
              选择图标风格
            </span>
            <button
              onClick={resetToDefault}
              style={{
                fontSize: '12px',
                color: '#6366f1',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              重置默认
            </button>
          </div>

          {/* 风格列表 */}
          <div style={{ padding: '12px', maxHeight: '320px', overflowY: 'auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {allStyles.map(style => {
                const isSelected = selectedStyles.includes(style.id);
                const isDisabled = !isSelected && selectedStyles.length >= maxSelection;
                
                return (
                  <motion.button
                    key={style.id}
                    onClick={() => !isDisabled && toggleStyle(style.id)}
                    whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                    whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                    style={{
                      padding: '12px',
                      background: isSelected ? '#eef2ff' : '#f9fafb',
                      border: `2px solid ${isSelected ? '#6366f1' : 'transparent'}`,
                      borderRadius: '10px',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      textAlign: 'left',
                      opacity: isDisabled ? 0.5 : 1,
                      transition: 'all 0.2s',
                    }}
                  >
                    {/* 颜色预览 */}
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
                      {[style.colors.primary, style.colors.secondary, style.colors.accent].map((color, i) => (
                        <div
                          key={i}
                          style={{
                            width: '16px',
                            height: '16px',
                            borderRadius: '4px',
                            background: color,
                            border: '1px solid rgba(0,0,0,0.1)',
                          }}
                        />
                      ))}
                      {isSelected && (
                        <div style={{ marginLeft: 'auto' }}>
                          <svg width="16" height="16" fill="#6366f1" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                    {/* 风格信息 */}
                    <div style={{ fontSize: '13px', fontWeight: 600, color: '#1f2937', marginBottom: '2px' }}>
                      {style.name}
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>
                      {style.platform}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* 底部提示 */}
          <div style={{
            padding: '10px 16px',
            borderTop: '1px solid #f3f4f6',
            background: '#f9fafb',
            fontSize: '11px',
            color: '#9ca3af',
          }}>
            最多选择 {maxSelection} 种风格，每次生成将产出所选风格的图标
          </div>
        </motion.div>
      )}

      {/* 点击外部关闭 */}
      {isExpanded && (
        <div
          onClick={() => setIsExpanded(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 99,
          }}
        />
      )}
    </div>
  );
}

export { DEFAULT_STYLES };
