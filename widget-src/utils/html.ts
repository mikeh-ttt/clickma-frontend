// Types for parsed components
interface BaseComponent {
  type: string;
}

interface HTMLTextComponent extends BaseComponent {
  type: 'h1' | 'h2' | 'h3' | 'p';
  content: string;
}

interface ListComponent extends BaseComponent {
  type: 'ul' | 'ol';
  items: (string | string[])[];
}

interface TableComponent extends BaseComponent {
  type: 'table';
  headers: string[];
  rows: string[][];
}

type ParsedComponent = HTMLTextComponent | ListComponent | TableComponent;

// Parser function
export function parseHTMLString(html: string): ParsedComponent[] {
  const components: ParsedComponent[] = [];

  const cleanText = (text: string): string => {
    return text
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .trim();
  };

  const extractContent = (
    str: string,
    startTag: string,
    endTag: string
  ): string => {
    const startIndex = str.indexOf(startTag) + startTag.length;
    const endIndex = str.indexOf(endTag);
    if (startIndex >= 0 && endIndex >= 0) {
      return str.slice(startIndex, endIndex);
    }
    return '';
  };

  const chunks = html.split(
    /(<h[1-6]>|<\/h[1-6]>|<p>|<\/p>|<ul>|<\/ul>|<ol>|<\/ol>|<table>|<\/table>)/
  );

  let currentList: ListComponent | null = null;
  let currentTable: TableComponent | null = null;
  let insideList = false;
  let insideTable = false;

  chunks.forEach((chunk) => {
    const trimmedChunk = chunk.trim();
    if (!trimmedChunk) return;

    const headingMatch = trimmedChunk.match(/<h(\d)>/);
    if (headingMatch) {
      const level = headingMatch[1];
      const headingText = extractContent(html, `<h${level}>`, `</h${level}>`);
      components.push({
        type: `h${level}` as 'h1' | 'h2' | 'h3',
        content: cleanText(headingText),
      });
    } else if (trimmedChunk.startsWith('<p>')) {
      const paragraphText = extractContent(trimmedChunk, '<p>', '</p>');
      components.push({
        type: 'p',
        content: cleanText(paragraphText),
      });
    } else if (trimmedChunk === '<ul>') {
      currentList = { type: 'ul', items: [] };
      insideList = true;
    } else if (trimmedChunk === '</ul>' && currentList) {
      if (currentList.items.length > 0) {
        components.push(currentList);
      }
      currentList = null;
      insideList = false;
    } else if (trimmedChunk === '<ol>') {
      currentList = { type: 'ol', items: [] };
      insideList = true;
    } else if (trimmedChunk === '</ol>' && currentList) {
      if (currentList.items.length > 0) {
        components.push(currentList);
      }
      currentList = null;
      insideList = false;
    } else if (trimmedChunk.includes('<li>') && insideList && currentList) {
      const itemContent = extractContent(trimmedChunk, '<li>', '</li>');
      if (itemContent.includes('<p>')) {
        const paragraphs = itemContent
          .split('</p>')
          .map((p) => extractContent(p, '<p>', '</p>'))
          .filter((p) => p)
          .map((p) => cleanText(p));
        currentList.items.push(paragraphs);
      } else {
        currentList.items.push(cleanText(itemContent));
      }
    } else if (trimmedChunk === '<table>') {
      currentTable = { type: 'table', headers: [], rows: [] };
      insideTable = true;
    } else if (trimmedChunk === '</table>' && currentTable) {
      if (currentTable.headers.length > 0 || currentTable.rows.length > 0) {
        components.push(currentTable);
      }
      currentTable = null;
      insideTable = false;
    } else if (trimmedChunk.includes('<th>') && insideTable && currentTable) {
      const headerText = extractContent(trimmedChunk, '<th>', '</th>');
      currentTable.headers.push(cleanText(headerText));
    } else if (trimmedChunk.includes('<td>') && insideTable && currentTable) {
      const cellText = extractContent(trimmedChunk, '<td>', '</td>');
      if (currentTable.rows.length === 0) {
        currentTable.rows.push([]);
      }
      if (currentTable.rows.length > 0) {
        currentTable.rows[currentTable.rows.length - 1].push(
          cleanText(cellText)
        );
      }
    } else if (trimmedChunk.includes('<tr>') && insideTable && currentTable) {
      if (!trimmedChunk.includes('<th>')) {
        currentTable.rows.push([]);
      }
    }
  });

  return components;
}
