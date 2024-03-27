import {
  TRANSLATION_ACADEMY,
  TRANSLATION_NOTES,
  TRANSLATION_WORDS,
} from '../common/constants';

/**
 *
 * @param {String} src
 * @param {String} languageId
 * @param {String} articleCat - category of the given article. Ok if empty
 */
export function convertMarkdownLinks(src, languageId, articleCat='') {
  if (!src) {
    return src;
  }

  // OBS tN: Convert all [<Title>](rc://<lang>/tn/help/obs/*) links to just show "Open Bible Stories - <Title>"
  src = src.replace(/\[([^\]]+)\]\(rc:\/\/[^/]+\/tn\/help\/obs[^)]+\)/g, 'Open Bible Stories - $1');
  // tN: Convert all [<Bible Ref>](rc://<lang>/tn/*) links to just show the <Bible ref> (no link)
  src = src.replace(/\[([^\]]+)\]\(rc:\/\/[^/]+\/tn\/[^)]+\)/g, '$1');
  // tW: Convert all [<Title>](rc://<lang>/tw/dict/bible/<articleCat>/<articleId>) links to make a clickable link to call the followlink() function for tw
  src = src.replace(/\[([^\]]+)\]\(rc:\/\/([^/]+)\/tw\/dict\/bible\/([^/)]+)\/([^/)]+)\)/g, '<a style="cursor: pointer" onclick="return followLink(\'$2/tw/$3/$4\')">$1</a>');
  // tW: Convert all [<Title>](../[other|kt|names]/[articleId].md) relative tW links to make a clickable link to call the followlink() function for 'tw'
  src = src.replace(/\[([^\]]+)\]\((\.\.\/)*(other|kt|names)\/([^.)]+)\.md\)/g, '<a style="cursor: pointer" onclick="return followLink(\''+languageId+'/tw/$3/$4\')">$1</a>');
  // tA: Convert all [<Title>](rc://<lang>/ta/man/<articleCat>/<articleId>) links to make a clickable link to call the followlink() function for ta
  src = src.replace(/\[([^\]]+)\]\(rc:\/\/([^/]+)\/ta\/man\/([^/)]+)\/([^/)]+)\)/g, '<a style="cursor: pointer" onclick="return followLink(\'$2/ta/$3/$4\')">$1</a>');
  // tA: Convert all [<Title>](../[articleId]/01.md) relative tA links to make a clickable link to call the followlink() function for 'ta'
  src = src.replace(/\[([^\]]+)\]\((\.\.\/)*([^/)]+)\/01.md\)/g, '<a style="cursor: pointer" onclick="return followLink(\''+languageId+'/ta/'+articleCat+'/$3\')">$1</a>');
  // tA: Convert all [<Title>](../../[manual]/[articleId]/01.md) relative tA links to make a clickable link to call the followlink() function for 'ta'
  src = src.replace(/\[([^\]]+)\]\((\.\.\/)*([^/)]+)\/([^/)]+)\/01.md\)/g, '<a style="cursor: pointer" onclick="return followLink(\''+languageId+'/ta/$3/$4\')">$1</a>');
  // tA: Convert all [<Title>](../[articleId]) relative tA links to make a clickable link to call the followlink() function for 'ta'
  src = src.replace(/\[([^\]]+)\]\((\.\.\/)*([^/)]+)\)/g, '<a style="cursor: pointer" onclick="return followLink(\''+languageId+'/ta/'+articleCat+'/$3\')">$1</a>');
  // tA: Convert all [<Title>](../[manual]/[articleId]) relative tA links to make a clickable link to call the followlink() function for 'ta'
  src = src.replace(/\[([^\]]+)\]\((\.\.\/)*([^/)]+)\/([^/)]+)\)/g, '<a style="cursor: pointer" onclick="return followLink(\''+languageId+'/ta/$3/$4\')">$1</a>');
  return src;
}

export function getResourceDirByType(type) {
  switch (type) {
  case 'ta':
    return TRANSLATION_ACADEMY;
  case 'tw':
    return TRANSLATION_WORDS;
  case 'tn':
    return TRANSLATION_NOTES;
  default:
    return type;
  }
}

export function getArticleFromState(resourcesReducer = {}, contextId = {}, toolName) {
  const translationHelps = resourcesReducer.translationHelps || {};
  const article = translationHelps[toolName];
  const { groupId } = contextId;
  return article && groupId ? article[groupId] : '';
}
