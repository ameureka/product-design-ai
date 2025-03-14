import React from 'react';

interface SocialIconProps {
  href: string;
  label: string;
  children: React.ReactNode;
  className?: string;
}

export const SocialIcon: React.FC<SocialIconProps> = ({ 
  href, 
  label, 
  children, 
  className = "" 
}) => {
  return (
    <a 
      href={href} 
      aria-label={label}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-gray-500 hover:text-blue-600 transition-colors duration-200 ${className}`}
    >
      {children}
    </a>
  );
};

export const TwitterIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`w-5 h-5 ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
);

export const YouTubeIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`w-5 h-5 ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
  </svg>
);

export const XiaohongshuIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`w-5 h-5 ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h2v-6h-2v6zm0-8h2V7h-2v2z" />
    <path fillRule="evenodd" clipRule="evenodd" d="M12 6.5a1 1 0 100-2 1 1 0 000 2z" />
  </svg>
);

export const EmailIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={`w-5 h-5 ${className}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
    <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
  </svg>
);

const SocialIcons = () => {
  return (
    <div className="flex space-x-4">
      <SocialIcon href="https://twitter.com/productdesignai" label="Twitter">
        <TwitterIcon />
      </SocialIcon>
      <SocialIcon href="https://youtube.com/c/productdesignai" label="YouTube">
        <YouTubeIcon />
      </SocialIcon>
      <SocialIcon href="https://xiaohongshu.com/user/productdesignai" label="小红书">
        <XiaohongshuIcon />
      </SocialIcon>
      <SocialIcon href="mailto:contact@productdesignai.com" label="Email">
        <EmailIcon />
      </SocialIcon>
    </div>
  );
};

export default SocialIcons; 