import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  LexicalEditor,
  TextFormatType,
} from "lexical";
import { computePosition } from "@floating-ui/dom";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { $isRangeSelected } from "../../utils/isRangeSelected";
import { useUserInteractions } from "../../hooks/use-intersection";
import IconButton from "../button";

import {
  Bold,
  Italic,
  Underline,
  Code,
  PaintBucket,
  Strikethrough,
  Heading1,
  Heading2,
  List,
  ListOrdered,
} from "lucide-react";
import { $setBlocksType } from "@lexical/selection";
import { $createHeadingNode, HeadingTagType } from "@lexical/rich-text";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from "@lexical/list";

type FloatingMenuPosition = { x: number; y: number } | undefined;

type FloatingMenuProps = {
  editor: LexicalEditor;
  show: boolean;
  isBold: boolean;
  isCode: boolean;
  isItalic: boolean;
  isHIghlight: boolean;
  isStrikethrough: boolean;
  isUnderline: boolean;
};
type ListTagType = "ul" | "ol";

function FloatingMenu({ show, editor, ...props }: FloatingMenuProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<FloatingMenuPosition>(undefined);

  const nativeSel = window.getSelection();

  const handleSelect = useCallback(
    (value: TextFormatType) => {
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, value);
    },
    [editor]
  );

  const handleSelectList = useCallback(
    (tag: ListTagType) => {
      if (tag === "ol") {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        return;
      }
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    },
    [editor]
  );

  const handleSelectHeading = useCallback(
    (tag: HeadingTagType) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $setBlocksType(selection, () => $createHeadingNode(tag));
        }
      });
    },
    [editor]
  );

  useEffect(() => {
    const isCollapsed = nativeSel?.rangeCount === 0 || nativeSel?.isCollapsed;

    if (!show || !ref.current || !nativeSel || isCollapsed) {
      setPos(undefined);
      return;
    }
    const domRange = nativeSel.getRangeAt(0);

    computePosition(domRange, ref.current, { placement: "top" })
      .then((pos) => {
        setPos({ x: pos.x, y: pos.y - 10 });
      })
      .catch(() => {
        setPos(undefined);
      });
    // anchorOffset, so that we sync the menu position with
    // native selection (if user selects two ranges consecutively)
  }, [show, nativeSel, nativeSel?.anchorOffset]);

  return (
    <div
      ref={ref}
      style={{ top: pos?.y, left: pos?.x }}
      aria-hidden={!pos?.x || !pos?.y}
      className={`absolute flex bg-slate-200 border-[1px] border-slate-300 ${
        pos?.x && pos.y ? "opacity-1 visible" : "opacity-0 invisible"
      }`}
    >
      <IconButton onClick={() => handleSelectHeading("h1")}>
        <Heading1 size={20} />
      </IconButton>

      <IconButton onClick={() => handleSelectHeading("h2")}>
        <Heading2 size={20} />
      </IconButton>

      <IconButton onClick={() => handleSelectList("ul")}>
        <List size={20} />
      </IconButton>

      <IconButton onClick={() => handleSelectList("ol")}>
        <ListOrdered size={20} />
      </IconButton>

      <IconButton active={props.isBold} onClick={() => handleSelect("bold")}>
        <Bold size={20} />
      </IconButton>
      <IconButton
        active={props.isItalic}
        onClick={() => handleSelect("italic")}
      >
        <Italic size={20} />
      </IconButton>
      <IconButton
        active={props.isUnderline}
        onClick={() => handleSelect("underline")}
      >
        <Underline size={20} />
      </IconButton>
      <IconButton active={props.isCode} onClick={() => handleSelect("code")}>
        <Code size={20} />
      </IconButton>
      <IconButton
        active={props.isHIghlight}
        onClick={() => handleSelect("highlight")}
      >
        <PaintBucket size={20} />
      </IconButton>
      <IconButton
        active={props.isStrikethrough}
        onClick={() => handleSelect("strikethrough")}
      >
        <Strikethrough size={20} />
      </IconButton>
    </div>
  );
}

export function FloatingMenuPlugin() {
  const [show, setShow] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isHIghlight, setIsHighlight] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const { isPointerDown, isKeyDown } = useUserInteractions();
  const [editor] = useLexicalComposerContext();

  const updateFloatingMenu = useCallback(() => {
    editor.getEditorState().read(() => {
      if (editor.isComposing() || isPointerDown || isKeyDown) return;

      if (editor.getRootElement() !== document.activeElement) {
        setShow(false);
        return;
      }

      const selection = $getSelection();

      if ($isRangeSelected(selection)) {
        setIsBold(selection.hasFormat("bold"));
        setIsItalic(selection.hasFormat("italic"));
        setIsUnderline(selection.hasFormat("underline"));
        setIsCode(selection.hasFormat("code"));
        setIsHighlight(selection.hasFormat("highlight"));
        setIsStrikethrough(selection.hasFormat("strikethrough"));
        setShow(true);
      } else {
        setShow(false);
      }
    });
  }, [editor, isPointerDown, isKeyDown]);

  // Rerender the floating menu automatically on every state update.
  // Needed to show correct state for active formatting state.
  useEffect(() => {
    return editor.registerUpdateListener(() => {
      updateFloatingMenu();
    });
  }, [editor, updateFloatingMenu]);

  // Rerender the floating menu on relevant user interactions.
  // Needed to show/hide floating menu on pointer up / key up.
  useEffect(() => {
    updateFloatingMenu();
  }, [isPointerDown, isKeyDown, updateFloatingMenu]);

  return createPortal(
    <FloatingMenu
      editor={editor}
      show={show}
      isBold={isBold}
      isCode={isCode}
      isHIghlight={isHIghlight}
      isItalic={isItalic}
      isStrikethrough={isStrikethrough}
      isUnderline={isUnderline}
    />,
    document.body
  );
}
