import { useState, useEffect } from 'react';

export const useCopyToClipboard = () => {
  const [copiedText, setCopiedText] = useState('');

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
  };

  useEffect(() => {
    if (!copiedText) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setCopiedText('');
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [copiedText]);

  return { copiedText, handleCopyToClipboard };
};
