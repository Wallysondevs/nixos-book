import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

interface Props {
  path: string;
}

export function MarkdownPage({ path }: Props) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${import.meta.env.BASE_URL}docs/${path}`)
      .then(r => r.ok ? r.text() : "# Página não encontrada")
      .then(text => { setContent(text); setLoading(false); })
      .catch(() => { setContent("# Erro ao carregar"); setLoading(false); });
  }, [path]);

  if (loading) return <div className="animate-pulse text-[hsl(var(--nix-dim))]">Carregando...</div>;

  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
