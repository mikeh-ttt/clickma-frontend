const { widget } = figma;
const { AutoLayout, Text } = widget;

const typographyVariants = {
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

interface TypographyProps {
  variant?: keyof typeof typographyVariants;
  children: string | number;
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
}: TypographyProps) {
  const style = typographyVariants[variant];

  return (
    <AutoLayout
      width={width}
      height='hug-contents'
      onClick={onClick}
      padding={padding}
      wrap={wrap}
    >
      <Text {...style} fill={fill} fontFamily={fontFamily}>
        {children}
      </Text>
    </AutoLayout>
  );
}
