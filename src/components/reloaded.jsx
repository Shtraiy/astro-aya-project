import { useEffect } from 'react';

export default function Reload() {
  useEffect(() => {
    if (!sessionStorage.getItem('reloaded')) {
      sessionStorage.setItem('reloaded', 'true');
      window.location.reload();
    } else {
      sessionStorage.removeItem('reloaded');
    }
  }, []);

  return null; // 不渲染任何内容
}

