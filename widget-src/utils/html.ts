import { getAllMatches } from './string';

// Base type for all markdown elements
interface BaseMarkdownElement {
  type: string;
}

// Header element type
interface HeaderElement extends BaseMarkdownElement {
  type: 'header';
  level: number;
  content: string;
}

// Paragraph element type
interface ParagraphElement extends BaseMarkdownElement {
  type: 'paragraph';
  content: string;
  links?: LinkElement[];
}

// Link element type
interface LinkElement {
  text: string;
  url: string;
}

// List element type
interface ListElement extends BaseMarkdownElement {
  type: 'list';
  items: ListItemElement[];
  ordered: boolean;
}

// List item element type
interface ListItemElement extends BaseMarkdownElement {
  type: 'listItem';
  indent: number;
  ordered: boolean;
  content: string;
}

// Code block element type
interface CodeElement extends BaseMarkdownElement {
  type: 'code';
  language: string;
  content: string[];
}

// Table element type
interface TableElement extends BaseMarkdownElement {
  type: 'table';
  headers: string[];
  alignments: ('left' | 'center' | 'right')[];
  rows: string[][];
}

// Formatted text element type
interface FormattedElement extends BaseMarkdownElement {
  type: 'formatted';
  content: string;
  formatting: {
    bold: string[];
    italic: string[];
  };
}

// Union type of all possible markdown elements
type MarkdownElement =
  | HeaderElement
  | ParagraphElement
  | ListElement
  | ListItemElement
  | CodeElement
  | TableElement
  | FormattedElement;

// Main function type
export type ParseMarkdownFunction = (markdown: string) => MarkdownElement[];

// Update the function signature
export const parseMarkdown: ParseMarkdownFunction = (markdown: string) => {
  const lines = markdown.split('\n');
  const result = [];
  let currentSection = null;
  let listItems = [];
  let codeBlock: any = null;
  let tableData: any = null;

  const parseTableRow = (line: string) => {
    return line
      .split('|')
      .filter((cell) => cell.trim() !== '')
      .map((cell) => cell.trim());
  };

  const isTableDelimiterRow = (line: string) => {
    const cells = line.split('|').filter((cell) => cell.trim() !== '');
    return cells.every((cell) => {
      const trimmed = cell.trim();
      return trimmed.match(/^[-:]+$/) && trimmed.length >= 3;
    });
  };

  const getColumnAlignment = (delimiter: string) => {
    const trimmed = delimiter.trim();
    if (trimmed.startsWith(':') && trimmed.endsWith(':')) return 'center';
    if (trimmed.endsWith(':')) return 'right';
    return 'left';
  };

  const processLine = (line: string) => {
    // Table handling
    if (line.includes('|')) {
      if (!tableData) {
        // Potential start of a table
        const headerCells = parseTableRow(line);
        if (headerCells.length > 0) {
          tableData = {
            type: 'table',
            headers: headerCells,
            alignments: [],
            rows: [],
          };
          return null;
        }
      } else if (isTableDelimiterRow(line)) {
        // Table delimiter row defines column alignments
        const delimiters = line
          .split('|')
          .filter((cell) => cell.trim() !== '')
          .map((cell) => cell.trim());
        tableData.alignments = delimiters.map(getColumnAlignment);
        return null;
      } else if (tableData) {
        // Regular table row
        const rowCells = parseTableRow(line);
        if (rowCells.length === tableData.headers.length) {
          tableData.rows.push(rowCells);
          return null;
        }
      }
    } else if (tableData) {
      // End of table reached
      const completedTable = { ...tableData };
      tableData = null;
      return completedTable;
    }

    // Headers
    const headerMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headerMatch) {
      return {
        type: 'header',
        level: headerMatch[1].length,
        content: headerMatch[2].trim(),
      };
    }

    // Code blocks
    if (line.startsWith('```')) {
      if (!codeBlock) {
        codeBlock = {
          type: 'code',
          language: line.slice(3).trim(),
          content: [],
        };
        return null;
      } else {
        const completedBlock = { ...codeBlock };
        codeBlock = null;
        return completedBlock;
      }
    }

    if (codeBlock) {
      codeBlock.content.push(line);
      return null;
    }

    // Lists
    const listMatch = line.match(/^(\s*)([-*+]|\d+\.)\s+(.+)$/);
    if (listMatch) {
      const indent = listMatch[1].length;
      return {
        type: 'listItem',
        indent,
        ordered: /\d+\./.test(listMatch[2]),
        content: listMatch[3].trim(),
      };
    }

    // Links
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    if (line.match(linkRegex)) {
      return {
        type: 'paragraph',
        content: line,
        links: [...getAllMatches(line, linkRegex)].map((match) => ({
          text: match[1],
          url: match[2],
        })),
      };
    }

    // Bold and Italic
    const hasFormatting = /[*_]{1,2}[^*_]+[*_]{1,2}/.test(line);
    if (hasFormatting) {
      return {
        type: 'formatted',
        content: line,
        formatting: {
          bold:
            line.match(/[*_]{2}([^*_]+)[*_]{2}/g)?.map((m) => m.slice(2, -2)) ||
            [],
          italic:
            line
              .match(/(^|[^*_])([*_])([^*_]+)\2(?![*_])/g)
              ?.map((m) => m.slice(1, -1)) || [],
        },
      };
    }

    // Paragraphs
    if (line.trim()) {
      return {
        type: 'paragraph',
        content: line.trim(),
      };
    }

    return null;
  };

  for (const line of lines) {
    const processed = processLine(line);
    if (processed) {
      if (processed.type === 'listItem') {
        listItems.push(processed);
      } else {
        if (listItems.length > 0) {
          result.push({
            type: 'list',
            items: listItems,
            ordered: listItems[0].ordered,
          });
          listItems = [];
        }
        result.push(processed);
      }
    }
  }

  // Handle any remaining list items
  if (listItems.length > 0) {
    result.push({
      type: 'list',
      items: listItems,
      ordered: listItems[0].ordered,
    });
  }

  // Handle any remaining table
  if (tableData) {
    result.push(tableData);
  }

  return result;
};
