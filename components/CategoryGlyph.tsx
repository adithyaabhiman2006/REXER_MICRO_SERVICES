import type { ToolCategory } from "@/types/tools";

const paths: Record<ToolCategory, React.ReactNode> = {
  media: <><rect x="3" y="4" width="18" height="16" rx="4" /><path d="m6 16 4-4 3 3 2-2 3 3M8 9h.01" /></>,
  dev: <><path d="m9 6-6 6 6 6M15 6l6 6-6 6M14 3l-4 18" /></>,
  seo: <><path d="M4 19V9M10 19V5M16 19v-7M3 19h18" /><path d="m15 7 3-3 3 3M18 4v8" /></>,
  docs: <><path d="M7 3h7l4 4v14H7zM14 3v5h5M10 12h5M10 16h5" /></>,
  text: <><path d="M4 6V4h16v2M9 20h6M12 4v16" /><path d="M6 10h12" opacity=".45" /></>,
  finance: <><circle cx="12" cy="12" r="9" /><path d="M15.5 8.5c-.7-.7-1.8-1-3.1-1-1.7 0-3 .8-3 2s1.1 1.8 3 2.1 3 .9 3 2.2-1.3 2.2-3 2.2c-1.4 0-2.6-.4-3.4-1.2M12 5.5v13" /></>,
  generators: <><path d="m12 3 1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5zM18.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8zM5 14l.7 1.8 1.8.7-1.8.7L5 19l-.7-1.8-1.8-.7 1.8-.7z" /></>,
  ai: <><path d="M9 4a3 3 0 0 0-3 3v1a3 3 0 0 0-1 5.2V15a3 3 0 0 0 4 2.8M15 4a3 3 0 0 1 3 3v1a3 3 0 0 1 1 5.2V15a3 3 0 0 1-4 2.8M9 4v16M15 4v16M9 8h2M13 12h2M9 16h2" /></>,
};

export function CategoryGlyph({ category, className }: { category: ToolCategory; className?: string }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">{paths[category]}</svg>;
}
