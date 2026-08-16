export interface CodeBlockProps {
  code: string;
  language?: string;
  className?: string;
  showLineNumbers?: boolean;
}

export interface JsonViewerProps {
  data: Record<string, unknown>;
  className?: string;
  maxHeight?: string;
}
