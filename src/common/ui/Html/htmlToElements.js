import { Image, View } from 'react-native';
import Text from '../Text';
import parseHtml, { Node } from './parseHtml';

const BULLET     = '  \u2022  ';
const LINE_BREAK = '\n';

export default async function htmlToElements(
  rawHtml: string,
  opts: Options = {}
) {
  const nodes = await parseHtml(rawHtml);
  return nodesToElements(nodes, null, 'block', opts);
}

export function nodesToElements(
  nodes: Array<Node>,
  parent: ?Node,
  type: 'inline' | 'block',
  opts: Options
) {
  if (!nodes) return null;

  const styles = opts.styles || {};

  return nodes
    .map((node: Node, index) => {
      const name = node.name;

      if (name === 'text' && type === 'inline') {
        // ignore carriage return
        if (node.text.charCodeAt(0) === 13) return null;
        return (
          <Text style={parent && styles[parent.name]} key={index}>
            {node.text}
          </Text>
        );
      }

      if (node.type === 'inline') {
        if (name === 'a') {
          return (
            <Text
              style={styles[name]}
              onPress={() => opts.linkHandler(node.attr.href)}
              key={index}
            >
              {nodesToElements(node.children, node, 'inline', opts)}
            </Text>
          );
        }

        let elements = nodesToElements(node.children, node, 'inline', opts);
        if (!elements && name === 'text') {
          elements = (
            <Text style={parent && styles[parent.name]} key={index}>
              {node.text}
            </Text>
          );
        }

        if (node.name === 'br') {
          if (elements) {
            elements.push(LINE_BREAK);
          } else {
            elements = LINE_BREAK;
          }
        }

        return (
          <Text key={index} style={styles[name]}>{elements}</Text>
        );
      }

      if (node.type === 'block' && type === 'block') {
        if (name === 'img') {
          const uri = node.attr.src;
          return (
            <View key={index}>
              <Image source={{ uri }} style={styles.img} />
            </View>
          );
        }

        const inlineElements = nodesToElements(
          node.children, node, 'inline', opts
        );
        if (node.name === 'li') {
          inlineElements.unshift(BULLET);
        }

        const elements = [<Text key="inline">{inlineElements}</Text>];
        if (hasBlockChildren(node)) {
          elements.push(
            <View key="block" style={styles[name + 'InnerWrapper']}>
              {nodesToElements(node.children, node, 'block', opts) }
            </View>
          );
        }

        return (
          <View key={index} style={styles[name + '_wrapper']}>
            {elements}
          </View>
        );
      }

      return null;
    });
}

function hasBlockChildren(node) {
  if (!node.children) return false;
  return node.children.filter(c => c.type === 'block').length > 0;
}

type Options = {
  linkHandler?: (url: string) => any;
  styles: Object;
};