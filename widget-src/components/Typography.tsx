import { getAllMatches } from '../utils/string';

const { widget } = figma;
const { AutoLayout, Text } = widget;

export const typographyVariants = {
  h1: {
    fontSize: 32,
    fontWeight: 700,
  },
  h2: {
    fontSize: 24,
    fontWeight: 600,
  },
  h3: {
    fontSize: 20,
    fontWeight: 600,
  },
  h4: {
    fontSize: 18,
    fontWeight: 600,
  },
  h5: {
    fontSize: 16,
    fontWeight: 600,
  },
  h6: {
    fontSize: 14,
    fontWeight: 600,
  },
  subtitle1: {
    fontSize: 16,
    fontWeight: 500,
  },
  subtitle2: {
    fontSize: 14,
    fontWeight: 500,
  },
  body1: {
    fontSize: 16,
    fontWeight: 400,
  },
  body2: {
    fontSize: 14,
    fontWeight: 400,
  },
  caption: {
    fontSize: 12,
    fontWeight: 400,
  },
  p: {
    fontSize: 16,
    fontWeight: 400,
  },
} as const;

export interface TypographyProps {
  variant?: keyof typeof typographyVariants;
  children: TextChildren['children'];
  fill?: string;
  width?: number | 'hug-contents' | 'fill-parent';
  fontFamily?: string;
  textOverflow?: 'clip' | 'ellipsis';
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  truncate?: boolean;
  onClick?: () => void;
  href?: string;
  padding?: WidgetJSX.Padding;
  wrap?: boolean;
  fontWeight?: WidgetJSX.FontWeight;
  alighment?: 'top' | 'center' | 'bottom';
  stroke?:
    | string
    | WidgetJSX.Color
    | WidgetJSX.SolidPaint
    | WidgetJSX.GradientPaint
    | (WidgetJSX.SolidPaint | WidgetJSX.GradientPaint)[];
  strokeWidth?: number;
}

export function Typography({
  variant = 'body1',
  children,
  fill = '#000',
  width = 'hug-contents',
  fontFamily = 'Inter',
  onClick,
  padding,
  wrap,
  fontWeight,
  alighment,
  stroke,
  strokeWidth,
}: TypographyProps) {
  const style = typographyVariants[variant];
  const markdownLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s]+)\)/g;

  if (
    Array.isArray(children) &&
    typeof children[0] === 'string' &&
    getAllMatches(children[0], markdownLinkRegex).length > 0
  ) {
    const match = getAllMatches(children[0], markdownLinkRegex);
    const [_, linkText, url] = match[0];

    return (
      <AutoLayout
        padding={{ vertical: 4 }}
        cornerRadius={4}
        verticalAlignItems='center'
        horizontalAlignItems='center'
      >
        <Text textDecoration='underline' href={url.toString()}>
          {linkText}
        </Text>
      </AutoLayout>
    );
  }

  return (
    <AutoLayout
      width={variant === 'p' ? 'fill-parent' : width}
      height='hug-contents'
      onClick={onClick}
      padding={padding}
      wrap={wrap}
      stroke={stroke}
      strokeWidth={strokeWidth}
    >
      <Text
        verticalAlignText={alighment}
        width='fill-parent'
        {...style}
        fontWeight={style?.fontWeight || fontWeight || 'normal'}
        fill={fill}
        fontFamily={fontFamily}
      >
        {children}
      </Text>
    </AutoLayout>
  );
}
