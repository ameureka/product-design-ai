import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'default' | 'light' | 'dark';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 40, variant = 'default' }) => {
  // 根据不同的variant选择不同的颜色
  let primaryColor = '#2563EB'; // 默认为蓝色
  let secondaryColor = '#1E40AF';
  let accentColor = '#60A5FA';
  
  if (variant === 'light') {
    primaryColor = '#60A5FA';
    secondaryColor = '#3B82F6';
    accentColor = '#EFF6FF';
  } else if (variant === 'dark') {
    primaryColor = '#1E40AF';
    secondaryColor = '#1E3A8A';
    accentColor = '#3B82F6';
  }

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 80 80" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* 背景圆形 */}
      <circle cx="40" cy="40" r="36" fill={primaryColor} />
      
      {/* 大脑/神经网络图案 - 代表AI和深度研究 */}
      <path 
        d="M40 15C30 15 22 23 22 33C22 39 26 44.5 32 47L32 55C32 58.3137 34.6863 61 38 61L42 61C45.3137 61 48 58.3137 48 55L48 47C54 44.5 58 39 58 33C58 23 50 15 40 15Z" 
        fill={secondaryColor} 
      />
      
      {/* 连接线和节点 - 代表网络和深度学习 */}
      <circle cx="40" cy="28" r="4" fill={accentColor} />
      <circle cx="30" cy="33" r="3" fill={accentColor} />
      <circle cx="50" cy="33" r="3" fill={accentColor} />
      <circle cx="35" cy="42" r="3" fill={accentColor} />
      <circle cx="45" cy="42" r="3" fill={accentColor} />
      <circle cx="40" cy="52" r="3.5" fill={accentColor} />
      
      {/* 连接线 */}
      <path d="M40 32L30 33" stroke={accentColor} strokeWidth="1.5" />
      <path d="M40 32L50 33" stroke={accentColor} strokeWidth="1.5" />
      <path d="M40 32L35 42" stroke={accentColor} strokeWidth="1.5" />
      <path d="M40 32L45 42" stroke={accentColor} strokeWidth="1.5" />
      <path d="M35 42L45 42" stroke={accentColor} strokeWidth="1.5" />
      <path d="M35 42L40 52" stroke={accentColor} strokeWidth="1.5" />
      <path d="M45 42L40 52" stroke={accentColor} strokeWidth="1.5" />
    </svg>
  );
};

export default Logo; 
 