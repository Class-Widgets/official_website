import { useState, useEffect } from 'react';

const LanguageSwitcher = () => {
  const [currentLang, setCurrentLang] = useState('');

  useEffect(() => {
    // 从 URL 路径中获取当前语言
    const pathParts = window.location.pathname.split('/');
    const langFromPath = pathParts[1];
    if (langFromPath === 'zh' || langFromPath === 'en' || langFromPath === 'ja') {
      setCurrentLang(langFromPath);
    }
  }, []);

  const switchLanguage = (language: string) => {
    // 设置语言 Cookie
    document.cookie = `lang=${language}; path=/; max-age=31536000; samesite=lax`;
    console.log('[LanguageSwitcher] 设置语言 Cookie:', language);
    
    const urlParts = window.location.pathname.split('/');
    urlParts[1] = language;
    window.location.href = urlParts.join('/');
  };

  return (
    <div className="flex bg-white/10 backdrop-blur-md rounded-lg p-1 shadow-lg border border-white/20">
      <button
        onClick={() => switchLanguage('en')}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-out ${
          currentLang === 'en'
            ? 'bg-white/20 text-white shadow-md backdrop-blur-sm border border-white/30 transform scale-105'
            : 'text-gray-200 hover:bg-white/10 hover:text-white hover:shadow-sm'
        }`}
      >
        English
      </button>
      <button
        onClick={() => switchLanguage('zh')}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-out ${
          currentLang === 'zh'
            ? 'bg-white/20 text-white shadow-md backdrop-blur-sm border border-white/30 transform scale-105'
            : 'text-gray-200 hover:bg-white/10 hover:text-white hover:shadow-sm'
        }`}
      >
        简体中文
      </button>
      <button
        onClick={() => switchLanguage('ja')}
        className={`px-3 py-2 text-sm font-medium rounded-md transition-all duration-300 ease-out ${
          currentLang === 'ja'
            ? 'bg-white/20 text-white shadow-md backdrop-blur-sm border border-white/30 transform scale-105'
            : 'text-gray-200 hover:bg-white/10 hover:text-white hover:shadow-sm'
        }`}
      >
        日本語
      </button>
    </div>
  );
};

export default LanguageSwitcher;