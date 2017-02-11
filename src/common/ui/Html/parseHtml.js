//noinspection SpellCheckingInspection
import htmlparser from './htmlparser2';

const BLOCK_TAGS = [
  'address', 'blockquote', 'dir', 'div', 'dl', 'form', 'h1', 'h2', 'h3', 'h4',
  'h5', 'h6', 'hr', 'iframe', 'img', 'li', 'menu', 'ol', 'p', 'pre', 'table',
  'tbody', 'td', 'th', 'tr', 'ul',
];

export default function parseHtml(html): Promise<Array<Node>> {
  const tagStack  = [{
    name: 'div',
    type: 'block',
  }];

  const opts = {
    recognizeSelfClosing:    true,
    lowerCaseAttributeNames: true,
    lowerCaseTags:           true,
    decodeEntities:          true,
  };

  //noinspection SpellCheckingInspection
  const parserHandler = {
    onopentag(name, attr) {
      push({
        attr,
        name,
        type: BLOCK_TAGS.indexOf(name) !== -1 ? 'block' : 'inline',
      });
    },

    ontext(text) {
      text = text.trim();
      if (!text) return;
      push({ text, name: 'text', type: 'inline' }, true);
    },

    onclosetag() {
      tagStack.pop();
    },
  };

  return new Promise(resolve => {
    //noinspection SpellCheckingInspection
    parserHandler.onend = () => resolve(tagStack[0].children);
    //noinspection JSUnresolvedFunction
    const parser = new htmlparser.Parser(parserHandler, opts);
    parser.write(html);
    parser.end();
  });

  function push(node, text = false) {
    const parent = tagStack[tagStack.length - 1];
    parent.children = parent.children || [];
    node.parent = parent;
    parent.children.push(node);
    if (!text) {
      tagStack.push(parent.children[parent.children.length - 1]);
    }
  }
}

export type Node = {
  attr: Object;
  children: Array<Node>;
  name: string;
  parent: Node;
  text?: string;
  type: 'inline' | 'block';
};