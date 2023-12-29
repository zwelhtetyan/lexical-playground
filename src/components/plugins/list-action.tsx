import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";

type ListTagType = "ul" | "ol";
export const ListAction = () => {
  const [editor] = useLexicalComposerContext();

  const handleClick = (tag: ListTagType) => {
    if (tag === "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      return;
    }
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  };

  return (
    <div className="mt-2 flex gap-2">
      {["ul", "ol"].map((tag) => (
        <button
          className="bg-slate-100 p-2"
          key={tag}
          onClick={() => handleClick(tag as ListTagType)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};
