import parseHtml from '../parseHtml';

describe('ui.Html parseHtml', () => {
  it('should parse link with plain text', async () => {
    const html = '<a>link</a> text';
    const children = await parseHtml(html);
    expect(children[0].name).toEqual('a');
    expect(children[1].name).toEqual('text');
    expect(children[1].text).toEqual(' text');
  });
});