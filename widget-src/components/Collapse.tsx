import { spacing } from '../utils/theme';
import { Typography } from './Typography';

const { widget } = figma;
const { AutoLayout, useSyncedState, SVG } = widget;

// Chevron icons for open/close states
const IconOpen = () => (
  <SVG
    src={`
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="16" fill="#BFBFBF" fill-opacity="0.25"/>
        <path d="M11 19L16 24L21 19M11 13L16 8L21 13" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `}
  />
);

const IconClose = () => (
  <SVG
    src={`
     <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="16" fill="#BFBFBF" fill-opacity="0.25"/>
        <path d="M11 24L16 19L21 24M11 8L16 13L21 8" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `}
  />
);

interface CollapseProps {
  title: string;
  content: string | FigmaDeclarativeNode;
  defaultOpen?: boolean;
  width?: number | 'fill-parent';
  fill?: string;
  headerFill?: string;
  titleColor?: string;
  iconColor?: string;
  id: string;
}

export function Collapse({
  title,
  content,
  defaultOpen = false,
  width = 'fill-parent',
  fill = '#FFFFFF',
  id,
}: CollapseProps) {
  const [isOpen, setIsOpen] = useSyncedState(`${id}-isOpen`, defaultOpen);

  return (
    <AutoLayout
      direction='vertical'
      width={width}
      height='hug-contents'
      fill={fill}
      overflow='hidden'
    >
      {/* Header */}
      <AutoLayout
        width='fill-parent'
        height='hug-contents'
        spacing={spacing}
        onClick={() => setIsOpen(!isOpen)}
      >
        <AutoLayout
          width='fill-parent'
          height='hug-contents'
          verticalAlignItems='center'
          spacing='auto'
        >
          <Typography variant='h2'>{title}</Typography>
          <AutoLayout>{isOpen ? <IconClose /> : <IconOpen />}</AutoLayout>
        </AutoLayout>
      </AutoLayout>

      {/* Content */}
      {isOpen && (
        <AutoLayout
          direction='vertical'
          width='fill-parent'
          height='hug-contents'
          padding={{
            top: 16,
          }}
        >
          {typeof content === 'string' ? (
            <Typography variant='p'>{content}</Typography>
          ) : (
            content
          )}
        </AutoLayout>
      )}
    </AutoLayout>
  );
}
