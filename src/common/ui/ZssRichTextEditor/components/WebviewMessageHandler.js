/* eslint-disable max-len */
import ActionTypes, { messages } from './actionTypes';

function emptyFunction() {}

export default function (action) {
  switch (action.type) {
    case ActionTypes.enableOnChange:
      return 'zss_editor.enableOnChange();';
    case ActionTypes.setTitleHtml:
      return `zss_editor.setTitleHTML('${action.data}');`;
    case ActionTypes.toggleTitle:
      return `zss_editor.toggleTitle('${action.data}');`;
    case ActionTypes.hideTitle:
      return `zss_editor.hideTitle('${action.data}');`;
    case ActionTypes.showTitle:
      return `zss_editor.showTitle('${action.data}');`;
    case ActionTypes.setContentHtml:
      return `zss_editor.setContentHTML('${action.data}');`;
    case ActionTypes.blurTitleEditor:
      return 'zss_editor.blurTitleEditor();';
    case ActionTypes.blurContentEditor:
      return 'zss_editor.blurContentEditor();';
    case ActionTypes.setBold:
      return 'zss_editor.setBold();';
    case ActionTypes.setItalic:
      return 'zss_editor.setItalic();';
    case ActionTypes.setUnderline:
      return 'zss_editor.setUnderline();';
    case ActionTypes.heading1:
      return 'zss_editor.setHeading("h1");';
    case ActionTypes.heading2:
      return 'zss_editor.setHeading("h2");';
    case ActionTypes.heading3:
      return 'zss_editor.setHeading("h3");';
    case ActionTypes.heading4:
      return 'zss_editor.setHeading("h4");';
    case ActionTypes.heading5:
      return 'zss_editor.setHeading("h5");';
    case ActionTypes.heading6:
      return 'zss_editor.setHeading("h6");';
    case ActionTypes.setBlockquote:
      return 'zss_editor.setBlockquote();';
    case ActionTypes.setParagraph:
      return 'zss_editor.setParagraph();';
    case ActionTypes.removeFormat:
      return 'zss_editor.removeFormating();';
    case ActionTypes.alignLeft:
      return 'zss_editor.setJustifyLeft();';
    case ActionTypes.alignCenter:
      return 'zss_editor.setJustifyCenter();';
    case ActionTypes.alignRight:
      return 'zss_editor.setJustifyRight();';
    case ActionTypes.alignFull:
      return 'zss_editor.setJustifyFull();';
    case ActionTypes.insertBulletsList:
      return 'zss_editor.setUnorderedList();';
    case ActionTypes.insertOrderedList:
      return 'zss_editor.setOrderedList();';
    case ActionTypes.insertLink:
      return `zss_editor.insertLink('${action.data.url}', '${action.data.title}');`;
    case ActionTypes.updateLink:
      return `zss_editor.updateLink('${action.data.url}', '${action.data.title}');`;
    case ActionTypes.insertImage:
      return `zss_editor.insertImage('${action.data}');`;
    case ActionTypes.setSubscript:
      return 'zss_editor.setSubscript();';
    case ActionTypes.setSuperscript:
      return 'zss_editor.setSuperscript();';
    case ActionTypes.setStrikethrough:
      return 'zss_editor.setStrikeThrough();';
    case ActionTypes.setHR:
      return 'zss_editor.setHorizontalRule();';
    case ActionTypes.setIndent:
      return 'zss_editor.setIndent();';
    case ActionTypes.setOutdent:
      return 'zss_editor.setOutdent();';
    case ActionTypes.setTitlePlaceholder:
      return `zss_editor.setTitlePlaceholder('${action.data}');`;
    case ActionTypes.setContentPlaceholder:
      return `zss_editor.setContentPlaceholder('${action.data}');`;
    case ActionTypes.getTitleHtml:
      return `
        var html = zss_editor.getTitleHTML();
        postMessage(JSON.stringify({type: '${messages.TITLE_HTML_RESPONSE}', data: html}));
      `;
    case ActionTypes.getTitleText:
      return `
        var html = zss_editor.getTitleText();
        postMessage(JSON.stringify({type: '${messages.TITLE_TEXT_RESPONSE}', data: html}));
      `;
    case ActionTypes.getContentHtml:
      return `
        var html = zss_editor.getContentHTML();
        postMessage(JSON.stringify({type: '${messages.CONTENT_HTML_RESPONSE}', data: html}));
      `;
    case ActionTypes.setTitleFocusHandler:
      return 'zss_editor.setTitleFocusHandler();';
    case ActionTypes.setContentFocusHandler:
      return 'zss_editor.setContentFocusHandler();';
    case ActionTypes.getSelectedText:
      return `
        var selectedText = getSelection().toString();
        postMessage(JSON.stringify({type: '${messages.SELECTED_TEXT_RESPONSE}', data: selectedText}));
      `;
    case ActionTypes.focusContent:
      return 'zss_editor.focusContent();';
    case ActionTypes.focusTitle:
      return 'zss_editor.focusTitle();';
    case ActionTypes.prepareInsert:
      return 'zss_editor.prepareInsert();';
    case ActionTypes.restoreSelection:
      return 'zss_editor.restorerange();';
    case ActionTypes.setCustomCSS:
      return `zss_editor.setCustomCSS('${action.data}');`;
    case ActionTypes.setTextColor:
      return `zss_editor.setTextColor('${action.data}');`;
    case ActionTypes.setBackgroundColor:
      return `zss_editor.setBackgroundColor('${action.data}');`;
    case ActionTypes.init:
      return 'zss_editor.init();';
    case ActionTypes.setEditorHeight:
      return `zss_editor.setEditorHeight('${action.data}');`;
    case ActionTypes.setFooterHeight:
      return `zss_editor.setFooterHeight('${action.data}');`;
    case ActionTypes.setPlatform:
      return `zss_editor.setPlatform('${action.data}');`;

    default:
      return emptyFunction.toString();
  }
}