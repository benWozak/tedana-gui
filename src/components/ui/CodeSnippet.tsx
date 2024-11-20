import { useState, useRef } from "react";
import { useCopyToClipboard } from "usehooks-ts";
import { Copy, Check } from "lucide-react";

type CodeSnippetProps = {
  code: React.ReactElement | string;
  language: string;
};

export const CodeSnippet: React.FC<CodeSnippetProps> = ({ code, language }) => {
  const [copied, setCopied] = useState(false);
  const [_, copy] = useCopyToClipboard();
  const codeRef = useRef<HTMLElement>(null);

  const handleCopy = () => {
    if (codeRef.current) {
      const text = codeRef.current.innerText;
      copy(text)
        .then(() => {
          console.log("Copied!", { text });
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
        })
        .catch((error) => {
          console.error("Failed to copy!", error);
        });
    }
  };

  return (
    <div className="mockup-code my-4 relative">
      <div className="badge badge-ghost absolute top-8 left-3 btn btn-ghost btn-xs">
        {language}
      </div>
      <div className="flex">
        <pre data-prefix={language === "Python" ? "~" : "$"}> </pre>
        <code ref={codeRef} className=" pr-8">
          {code}
        </code>
      </div>
      <button
        onClick={handleCopy}
        className={`absolute top-2 right-2 btn btn-ghost btn-xs ${
          copied ? "text-success" : ""
        }`}
        aria-label="Copy to clipboard"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>
    </div>
  );
};
