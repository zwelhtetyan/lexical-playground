import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { $setBlocksType } from "@lexical/selection";
import { HeadingTagType, $createHeadingNode } from "@lexical/rich-text";

export const HeadingActions = () => {
  const [editor] = useLexicalComposerContext();

  const handleClick = (tag: HeadingTagType) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $setBlocksType(selection, () => $createHeadingNode(tag));
      }
    });
  };

  return (
    <div className="mt-2 flex gap-2">
      {["h1", "h2"].map((tag) => (
        <button
          className="bg-slate-100 p-2"
          key={tag}
          onClick={() => handleClick(tag as HeadingTagType)}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};
