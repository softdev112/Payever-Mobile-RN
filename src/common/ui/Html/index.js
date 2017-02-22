// Original https://github.com/soliury/react-native-html-render

import { Component } from 'react';
import { Image, Linking, View } from 'react-native';
import { log } from 'utils';

import StyleSheet from '../StyleSheet';
import autoLinker from './vendors/autoLinker';
import htmlToElements from './htmlToElements';

export default class HtmlView extends Component {
  props: {
    source: string;
  };

  renderingHtml: boolean;

  constructor(props) {
    super(props);
    this.state = {
      elements: null,
    };
  }

  componentDidMount() {
    this.startHtmlRender().catch(log.warn);
  }

  componentWillReceiveProps() {
    this.startHtmlRender().catch(log.warn);
  }

  onLinkPress(url) {
    Linking.openURL(url).catch(log.warn);
  }

  async startHtmlRender() {
    const { source } = this.props;

    if (!source) return;
    if (this.renderingHtml) return;

    const opts = {
      linkHandler: this.onLinkPress,
      styles:      baseStyles,
    };

    const html = autoLinker.link(source);

    try {
      this.renderingHtml = true;
      const elements = await htmlToElements(html, opts);
      this.setState({ elements });
    } finally {
      this.renderingHtml = false;
    }
  }

  render() {
    if (this.state.elements) {
      return (<View cstyle={{ flex: 1 }}>{this.state.elements}</View>);
    }
    return (<View />);
  }
}

const fontSize    = 13;
const titleMargin = 13;
const baseStyles = StyleSheet.create({
  a: {
    color:        '$pe_color_blue',
  },

  address_wrapper: {
    marginBottom: 20,
  },

  blockquote_wrapper: {
    borderLeftColor: '$pe_color_blue',
    borderLeftWidth: 3,
    paddingLeft:     20,
  },

  em: {
    fontStyle: 'italic',
  },

  h1: {
    fontSize:   fontSize * 1.5,
    fontWeight: '400',
  },

  h1_wrapper: {
    marginBottom: titleMargin,
  },

  h2: {
    fontSize:   fontSize * 1.4,
    fontWeight: '400',
  },

  h2_wrapper: {
    marginBottom: titleMargin,
  },

  h3: {
    fontWeight: '400',
    fontSize:   fontSize * 1.3,
  },

  h3_wrapper: {
    marginBottom: titleMargin - 2,
  },

  h4: {
    fontSize:   fontSize * 1.2,
    fontWeight: '200',
  },

  h4_wrapper: {
    marginBottom: titleMargin - 2,
  },

  h5: {
    fontSize:   fontSize * 1.1,
    fontWeight: '400',
  },

  h5_wrapper:  {
    marginBottom: titleMargin - 3,
  },

  h6: {
    fontWeight: '400',
  },

  h6_wrapper: {
    marginBottom: titleMargin - 3,
  },

  img: {
    height:     150,
    resizeMode: Image.resizeMode.contain,
    width:      null,
  },

  li: {
    fontSize: fontSize * 0.9,
  },

  li_wrapper: {
    paddingLeft:  20,
    marginBottom: 10,
  },

  p: {
    lineHeight: Math.round(fontSize * 1.4),
  },

  p_wrapper: {
    marginBottom: 13,
  },

  pre_wrapper: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ccc',
    borderRadius: 4,
    borderWidth: 1,
    marginBottom: 10,
    padding: 10,
  },

  strong: {
    fontWeight: 'bold',
  },

  u: {
    textDecorationLine: 'underline',
  },
});