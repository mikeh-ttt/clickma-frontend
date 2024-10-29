import { parseMarkdown } from '../utils/html';
import { spacing } from '../utils/theme';
import { Divider } from './Divider';
import { Table } from './Table';
import { Typography, typographyVariants } from './Typography';

const { widget } = figma;
const { AutoLayout } = widget;

export const MarkdownContent = ({
  content,
  mode,
  rawContent,
}: {
  content: string;
  mode: 'raw' | 'html';
  rawContent: string;
}) => {
  if (mode === 'raw') return rawContent;
  const markdownObject = parseMarkdown(content);

  console.log({ markdownObject });
  return markdownObject.map((object, index) => {
    switch (object.type) {
      case 'header':
        return (
          <Typography
            variant={`h${object.level}` as keyof typeof typographyVariants}
            key={`${object.type}-${index}`}
          >
            {object.content}
          </Typography>
        );

      case 'paragraph':
        return (
          <Typography variant={`p`} key={`${object.type}-${index}`}>
            {object.content}
          </Typography>
        );
      case 'formatted': {
        const formattedContent = object.content
          .split(/(\*\*.*?\*\*|_.*?_|<u>.*?<\/u>)/g)
          .map((text, i) => {
            if (
              object.formatting.bold.indexOf(text.replace(/\*\*/g, '')) !== -1
            ) {
              return (
                <Typography fontWeight='bold' key={`bold-${i}`}>
                  {text.replace(/\*\*/g, '')}
                </Typography>
              );
            }
            if (
              object.formatting.italic.indexOf(text.replace(/_/g, '')) !== -1
            ) {
              return (
                <Typography key={`italic-${i}`} italic={true}>
                  {text.replace(/_/g, '')}
                </Typography>
              );
            }
            return text; // Unformatted text remains as-is
          });

        return (
          <Typography
            width='fill-parent'
            wrap={true}
            key={`formatted-${index}`}
            variant='p'
          >
            {formattedContent}
          </Typography>
        );
      }

      case 'list': {
        return (
          <AutoLayout
            width='fill-parent'
            key={`list-${index}`}
            direction='vertical'
            spacing={spacing}
          >
            {object.items.map((item, itemIndex) => {
              if (item.content === '* *')
                return (
                  <AutoLayout
                    padding={{
                      top: spacing,
                      bottom: spacing,
                      left: spacing,
                      right: spacing,
                    }}
                    width='fill-parent'
                  >
                    <Divider />
                  </AutoLayout>
                );
              return (
                <AutoLayout
                  width='fill-parent'
                  key={`listItem-${itemIndex}`}
                  direction='horizontal'
                  spacing={spacing}
                  padding={{
                    left: item.indent * spacing,
                  }}
                >
                  {item.ordered ? (
                    <Typography variant='body1'>{`${
                      itemIndex + 1
                    }.`}</Typography>
                  ) : (
                    <Typography variant='body1'>•</Typography>
                  )}
                  <Typography width='fill-parent' variant='p'>
                    {item.content.replace(/\*\*/g, '')}
                  </Typography>
                </AutoLayout>
              );
            })}
          </AutoLayout>
        );
      }

      case 'table':
        {
          return (
            <Table
              alignments={object.alignments}
              headers={object.headers}
              rows={object.rows}
            />
          );
        }

        return (
          <AutoLayout width='fill-parent' key={index} direction='vertical'>
            <AutoLayout width='fill-parent' direction='horizontal' spacing={16}>
              {object.headers.map((header, headerIndex) => (
                <Typography
                  key={headerIndex}
                  variant='body1'
                  fontWeight={700}
                  width='fill-parent'
                >
                  {header}
                </Typography>
              ))}
            </AutoLayout>
            {object.rows.map((row, rowIndex) => (
              <AutoLayout
                stroke='#000'
                strokeWidth={2}
                width='fill-parent'
                key={rowIndex}
                direction='horizontal'
                spacing={16}
              >
                {row.map((cell, cellIndex) => (
                  <Typography
                    key={cellIndex}
                    variant='body1'
                    width='fill-parent'
                  >
                    {cell}
                  </Typography>
                ))}
              </AutoLayout>
            ))}
          </AutoLayout>
        );
      default:
        return null;
    }
  });
};
