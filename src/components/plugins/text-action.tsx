import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { FORMAT_TEXT_COMMAND, TextFormatType } from "lexical";

export default function TextActions() {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = (formatType: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
  };

  return (
    <div className="mt-2 flex gap-2">
      {[
        "Bold",
        "Italic",
        "Underline",
        "Code",
        "Highlight",
        "Strikethrough",
        "Subscript",
        "Superscript",
      ].map((v) => {
        return (
          <button
            key={v}
            className="p-2 bg-slate-100"
            onClick={() => handleOnClick(v.toLowerCase() as TextFormatType)}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
}
