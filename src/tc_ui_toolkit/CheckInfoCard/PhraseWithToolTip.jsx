/* eslint-disable no-return-assign */
import React, { useEffect, useRef } from 'react';
import marked from 'marked';
import { getOffset } from './helpers';

/**
 * Attaches click listeners to links in the ref's text
 * @param ref
 * @param onClick
 */
const useLinkEffect = (ref, onClick) => {
  useEffect(() => {
    // find anchors in text
    const anchors = ref.current ? ref.current.getElementsByTagName(`a`) : [];

    // add click handler
    for (const a of anchors) {
      a.onclick = (event) => {
        event.preventDefault();

        if (typeof onClick === 'function') {
          // give the link path and title to the handler.
          onClick(a.href, a.innerHTML);
        }
      };
    }
  }, [ref, onClick]);
};

function PhraseWithToolTip({
  phrase, getScriptureFromReference, onClickLink,
}) {
  const phraseEl = useRef(null);
  const toolTippedPhraseEl = useRef(null);

  useLinkEffect(phraseEl, onClickLink);
  useLinkEffect(toolTippedPhraseEl, onClickLink);

  let scriptureRef;
  let tooltipRef;
  const rcMatch = phrase.match(/\[([^\]]+)\]\s*\(rc:\/\/([\w-]+)\/([\w-]+)\/book\/(\w+)\/(\d+)\/(\d+)\)/) || [];
  const showTooltip = rcMatch.length > 0;

  if (showTooltip) {
    const [wholeMatch, referenceText, lang, id, book, chapter, verse] = rcMatch;
    const [preReference, postReference] = phrase.split(wholeMatch);
    const tooltipLabel = getScriptureFromReference(lang, id, book, chapter, verse);
    return (
      <div>
        <span dangerouslySetInnerHTML={{ __html: preReference }}/>
        <span onMouseEnter={() => {
          const { top, left } = getOffset(scriptureRef);
          tooltipRef.style.top = `${top}px`;
          tooltipRef.style.left = `${left}px`;
          tooltipRef.style.width = `${scriptureRef.offsetWidth}px`;
          tooltipRef.style.height = `${scriptureRef.offsetHeight}px`;
        }} style={{ position: 'relative' }}>
          <div ref={(ref) => tooltipRef = ref}
            aria-label={tooltipLabel}
            className="hint--top hint--medium"
            style={{ position: 'fixed' }}/>
          <span style={{
            whiteSpace: 'nowrap',
            textDecoration: 'underline',
          }} ref={(ref) => scriptureRef = ref}>
            {referenceText}
          </span>
        </span>
        <span ref={toolTippedPhraseEl} style={{ color: '#fff' }}
          dangerouslySetInnerHTML={{ __html: marked(postReference) }}/>
      </div>
    );
  } else {
    return (
      <div ref={phraseEl} style={{ color: '#fff' }} dangerouslySetInnerHTML={{ __html: marked(phrase) }}/>
    );
  }
}

export default PhraseWithToolTip;
