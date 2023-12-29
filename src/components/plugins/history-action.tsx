import { UNDO_COMMAND, REDO_COMMAND } from "lexical";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

export const HistoryActions = () => {
  const [editor] = useLexicalComposerContext();

  return (
    <div className="space-x-2 mt-2">
      <button
        className="p-2 bg-slate-100"
        onClick={() => editor.dispatchCommand(UNDO_COMMAND, undefined)}
      >
        Undo
      </button>
      <button
        className="p-2 bg-slate-100"
        onClick={() => editor.dispatchCommand(REDO_COMMAND, undefined)}
      >
        Redo
      </button>
    </div>
  );
};
