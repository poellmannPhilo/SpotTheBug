import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/cjs/styles/prism";
interface CodeHighligtherProps {
  code: string;
}
export default function CodeHighlighter({ code }: CodeHighligtherProps) {
  return (
    <SyntaxHighlighter
      language="javascript"
      style={{ ...darcula }}
      customStyle={{ borderRadius: "2em", fontSize: "12px" }}
      showLineNumbers
    >
      {code.replaceAll(";  ", ";\n\n").replaceAll("; ", ";\n")}
    </SyntaxHighlighter>
  );
}
