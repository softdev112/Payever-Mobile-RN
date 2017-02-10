/* eslint-disable react/no-unused-prop-types */
// Original https://github.com/soliury/react-native-html-render

import { Component } from 'react';
import { Dimensions, Image, Text, View } from 'react-native';
import { log } from 'utils';

import StyleSheet from '../StyleSheet';
import parseHtml, { Node } from './parseHtml';

const BULLET     = '  \u2022  ';
const LINE_BREAK = '\n';
const { width }  = Dimensions.get('window');

export default class HtmlView extends Component {
  props: {
    onLinkPress: (string) => any;
    renderNode: () => any;
    stylesheet: Object;
    source: string;
  };

  renderingHtml: boolean;

  constructor(props) {
    super(props);
    this.state = {
      element: null,
    };
  }

  componentDidMount() {
    this.startHtmlRender().catch(log.warn);
  }

  componentWillReceiveProps() {
    this.startHtmlRender().catch(log.warn);
  }

  async startHtmlRender() {
    const { onLinkPress, renderNode, stylesheet, source } = this.props;

    if (!source) return;
    if (this.renderingHtml) return;

    const opts = {
      linkHandler:    onLinkPress,
      styles:         Object.assign({}, baseStyles, stylesheet),
      customRenderer: renderNode,
    };

    try {
      this.renderingHtml = true;
      const element = await htmlToElement(this.props.source, opts);
      log.info('ELEMENT', element);
      this.setState({ element });
    } finally {
      this.renderingHtml = false;
    }
  }

  render() {
    if (this.state.element) {
      log.info('RENDERING EL');
      return (<View cstyle={{ flex: 1 }}>{this.state.element}</View>);
    }
    return (<View />);
  }
}

function nodesToElement(nodes: Array<Node>, parent, type, opts) {
  if (!nodes) return null;

  const styles = opts.styles;

  return nodes.map((node: Node, index) => {
    if (opts.customRenderer) {
      const rendered = opts.customRenderer(node, index, parent, type);
      if (rendered || rendered === null) return rendered;
    }

    const name = node.name;

    if (name === 'text' && type === 'inline') {
      // ignore carriage return
      // if (node.text.charCodeAt(0) === 13) return null;
      log.info('RENDER TEXT', node.text);
      return (
        <Text key={index} style={parent && styles[parent.name]}>
          {node.text}
        </Text>
      );
    }

    if (node.type === 'inline' && type === 'block') return null;

    if (node.type === 'inline') {
      const uri = node.attr.href;
      if (name === 'a') {
        return (
          <Text
            onPress={opts.linkHandler.bind(this, uri)}
            key={index} style={styles[name]}
          >
            {nodesToElement(node.children, node, 'inline', opts)}
          </Text>
        );
      }

      return (
        <Text key={index} style={styles[name]}>
          {nodesToElement(node.children, node, 'inline', opts) }
          {node.name === 'br' ? LINE_BREAK : null}
        </Text>
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

      return (
        <View key={index} style={styles[name + '_wrapper']}>
          <Text>
            {node.name === 'li' ? BULLET : null}
            {nodesToElement(node.children, node, 'inline', opts) }
          </Text>
          <View style={styles[name + 'InnerWrapper']}>
            {nodesToElement(node.children, node, 'block', opts) }
          </View>
        </View>
      );
    }

    return null;
  });
}


async function htmlToElement(rawHtml, opts) {
  const nodes = await parseHtml(rawHtml);
  const isInline = nodes.length === 1 && nodes[0].type === 'inline';
  return nodesToElement(nodes, null, isInline ? 'inline' : 'block', opts);
}

const fontSize    = 13;
const titleMargin = 8;
const baseStyles = StyleSheet.create({
  a: {
    fontSize,
    color:        '#3498DB',
    paddingLeft:  4,
    paddingRight: 4,
    marginRight:  10,
    marginLeft:   10,
  },

  blockquote_wrapper: {
    paddingLeft:     20,
    borderLeftColor: '#3498DB',
    borderLeftWidth: 3,
  },

  em: {
    fontStyle: 'italic',
  },

  h1: {
    fontSize:   20,
    fontWeight: '400',
    color:      '$pe_color_dark_gray',
  },

  h1_wrapper: {
    marginBottom:    titleMargin,
  },

  h2: {
    fontSize:   fontSize * 1.5,
    fontWeight: 'bold',
    color:      'rgba(0,0,0,0.85)',
  },

  h2_wrapper: {
    marginBottom: titleMargin,
  },

  h3: {
    fontWeight: 'bold',
    fontSize:   fontSize * 1.4,
    color:      'rgba(0,0,0,0.8)',
  },

  h3_wrapper: {
    marginBottom: titleMargin - 2,
  },

  h4: {
    fontSize:   fontSize * 1.3,
    color:      'rgba(0,0,0,0.7)',
    fontWeight: 'bold',
  },

  h4_wrapper: {
    marginBottom: titleMargin - 2,
  },

  h5: {
    fontSize:   fontSize * 1.2,
    color:      'rgba(0,0,0,0.7)',
    fontWeight: 'bold',
  },

  h5_wrapper:  {
    marginBottom: titleMargin - 3,
  },

  h6: {
    fontSize:   fontSize * 1.1,
    color:      'rgba(0,0,0,0.7)',
    fontWeight: 'bold',
  },

  h6_wrapper: {
    marginBottom: titleMargin - 3,
  },

  img: {
    width:      width - 30,
    height:     width - 30,
    resizeMode: Image.resizeMode.contain,
  },

  li: {
    fontSize: fontSize * 0.9,
    color:    'rgba(0,0,0,0.7)',
  },

  li_wrapper: {
    paddingLeft:  20,
    marginBottom: 10,
  },

  p: {
    fontSize,
    lineHeight:    Math.round(fontSize * 1.5),
    color:         '$pe_color_dark_gray',
  },

  p_wrapper: {
    marginBottom: 5,
  },

  strong: {
    fontWeight: 'bold',
  },
});