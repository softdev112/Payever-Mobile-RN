import { Text } from 'ui';
import { log } from 'util';

import htmlToElements from '../htmlToElements';

describe('ui.Html htmlToElements', () => {
  xit('should parse plain text', async () => {
    const element = (await htmlToElements('123'))[0];
    expect(element.type).toEqual(Text);
    expect(element.props.children).toEqual('123');
  });

  xit('should parse plain text with spaces', async () => {
    expect(await htmlToChildren('  123  ')).toEqual('123 ');
    expect(await htmlToChildren('  123  456 ')).toEqual('123 456 ');
  });

  xit('should remove spaces of the first inline element', async () => {
    const children = await htmlToChildren('<p>1<br> 2</p>');
    const elements = children[0].props.children;
    expect(elements[0].props.children).toEqual('1');
    expect(elements[1].props.children).toEqual('\n');
    expect(elements[2].props.children).toEqual('2');
  });

  it('should parse numbers', async () => {
    const html = '<a>link</a> text';
    const children = await htmlToElements(html);
    log.debug(children, { depth: 6 });
    // console.dir(children, { depth: 6 });
  });
});

async function htmlToChildren(html) {
  const elements = await htmlToElements(html);
  return elements[0].props.children;
}