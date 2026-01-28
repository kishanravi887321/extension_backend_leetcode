import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-typescript';
import './CodeViewer.css';

const CodeViewer = ({ code, language = 'cpp' }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  // Auto-detect language from code if not specified
  const detectLanguage = (code) => {
    if (code.includes('def ') || code.includes('import ') || code.includes('print(')) return 'python';
    if (code.includes('function ') || code.includes('const ') || code.includes('let ')) return 'javascript';
    if (code.includes('public class') || code.includes('public static void')) return 'java';
    if (code.includes('fn ') || code.includes('let mut')) return 'rust';
    if (code.includes('func ') || code.includes('package main')) return 'go';
    if (code.includes('using System') || code.includes('namespace ')) return 'csharp';
    if (code.includes('#include') || code.includes('cout') || code.includes('vector<')) return 'cpp';
    return language;
  };

  const detectedLang = detectLanguage(code);

  return (
    <div className="code-viewer-wrapper">
      <div className="code-viewer-header">
        <div className="code-lang-badge">{detectedLang.toUpperCase()}</div>
        <button 
          className="copy-code-btn"
          onClick={() => {
            navigator.clipboard.writeText(code);
          }}
          title="Copy code"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
          </svg>
        </button>
      </div>
      <pre className="code-viewer-pre">
        <code ref={codeRef} className={`language-${detectedLang}`}>
          {code}
        </code>
      </pre>
    </div>
  );
};

export default CodeViewer;
