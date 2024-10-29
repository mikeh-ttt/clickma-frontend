import { spacing } from '../utils/theme';
import { Divider } from './Divider';
import { Typography, TypographyProps } from './Typography';

const { widget } = figma;
const { AutoLayout, Line } = widget;

interface TableProps {
  headers: string[];
  alignments: Array<'left' | 'center' | 'right'>;
  rows: string[][];
}

export const Table = ({ headers, alignments, rows }: TableProps) => {
  return (
    <AutoLayout width='fill-parent' direction='vertical' spacing={0}>
      {/* Render Headers */}
      <AutoLayout width='fill-parent' direction='horizontal' spacing={0}>
        {headers.map((header, index) => (
          <Typography
            key={`header-${index}`}
            variant='h5'
            width='fill-parent'
            // alignment={alignments[index] as TypographyProps['alighment']}
            padding={{ top: spacing, bottom: spacing }}
          >
            {header}
          </Typography>
        ))}
      </AutoLayout>

      {/* Render Rows */}
      {rows.map((row, rowIndex) => (
        <AutoLayout
          width='fill-parent'
          key={`row-${rowIndex}`}
          direction='horizontal'
          spacing={0}
        >
          {row.map((cell, cellIndex) => (
            <AutoLayout width='fill-parent' direction='vertical'>
              <Divider />
              <Typography
                key={`cell-${rowIndex}-${cellIndex}`}
                variant='body1'
                width='fill-parent'
                padding={{ top: spacing, bottom: spacing }}

                //   alignment={alignments[cellIndex]}
              >
                {cell.replace(/\*\*/g, '')}
              </Typography>
            </AutoLayout>
          ))}
        </AutoLayout>
      ))}
    </AutoLayout>
  );
};
