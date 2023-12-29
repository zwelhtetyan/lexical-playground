import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ElementFormatType, FORMAT_ELEMENT_COMMAND } from "lexical";

export default function AlignActions() {
  const [editor] = useLexicalComposerContext();

  const handleOnClick = (formatType: ElementFormatType) => {
    editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, formatType);
  };

  return (
    <div className="mt-2 flex gap-2">
      {["Left", "Center", "Right"].map((v) => (
        <button
          key={v}
          className="bg-slate-100 p-2"
          onClick={() => handleOnClick(v.toLowerCase() as ElementFormatType)}
        >
          {v}
        </button>
      ))}
    </div>
  );
}
