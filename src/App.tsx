import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { ListItemNode, ListNode } from "@lexical/list";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeNode } from "@lexical/code";
import { TRANSFORMERS } from "@lexical/markdown";

import { HistoryActions } from "./components/plugins/history-action";
import AutoFocusPlugin from "./components/plugins/auto-focus";
import OnChangePlugin from "./components/plugins/onchange";
import TextActions from "./components/plugins/text-action";
import AlignActions from "./components/plugins/align-action";
import { HeadingActions } from "./components/plugins/heading-action";
import { FloatingMenuPlugin } from "./components/plugins/floating-menu";
import { ListAction } from "./components/plugins/list-action";

const EDITOR_NODES = [
  AutoLinkNode,
  CodeNode,
  HeadingNode,
  LinkNode,
  ListNode,
  ListItemNode,
  QuoteNode,
];

function App() {
  const initialConfig = {
    namespace: "Lexical",
    nodes: EDITOR_NODES,
    theme: {
      root: "h-64 bg-slate-100 p-5 prose",
      text: {
        bold: "font-bold",
        italic: "italic",
        underline: "underline decoration-solid",
        code: "font-mono",
        highlight: "mx-1",
        strikethrough: "line-through",
        underlineStrikethrough: "underlined-line-through",
        subscript: "align-sub",
        superscript: "align-super",
      },
    },
    onError: () => {},
  };

  return (
    <>
      <h1 className="font-bold text-2xl text-center mt-20 mb-5">
        Lexical Playground
      </h1>
      <div className="max-w-xl mx-auto relative">
        <LexicalComposer initialConfig={initialConfig}>
          <RichTextPlugin
            placeholder={
              <h1 className="absolute top-5 left-5 opacity-45 pointer-events-none">
                Enter some text...
              </h1>
            }
            contentEditable={<ContentEditable spellCheck={false} />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
          <ListPlugin />

          {/* custom plugins */}
          <AutoFocusPlugin />
          <OnChangePlugin onChange={() => void {}} />
          <HistoryActions />
          <TextActions />
          <AlignActions />
          <HeadingActions />
          <ListAction />
          <FloatingMenuPlugin />
        </LexicalComposer>
      </div>
    </>
  );
}

export default App;
