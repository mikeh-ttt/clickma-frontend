import { borderRadius, colors, spacing } from '../utils/theme';

const { widget } = figma;
const { AutoLayout, Text, useSyncedState, SVG } = widget;

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'destructive'
  | 'outline'
  | 'ghost'
  | 'link'
  | 'loading';

export type ButtonProps = {
  onClick?: (event: WidgetClickEvent) => Promise<any> | void;
  variant?: ButtonVariant;
  loading?: boolean;
  label?: string;
  rounded?: number;
  fill?: string;
  href?: string;
  icon?: FigmaDeclarativeNode;
};
const IconLink = () => (
  <SVG
    src={`
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.25 2.25H15.75M15.75 2.25V6.75M15.75 2.25L7.5 10.5M13.5 9.75V14.25C13.5 14.6478 13.342 15.0294 13.0607 15.3107C12.7794 15.592 12.3978 15.75 12 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V6C2.25 5.60218 2.40804 5.22064 2.68934 4.93934C2.97064 4.65804 3.35218 4.5 3.75 4.5H8.25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    `}
  />
);

const Button = ({
  onClick,
  variant = 'primary',
  loading,
  label,
  rounded = 1,
  fill,
  href,
  icon: Icon,
}: ButtonProps) => {
  const [isLoading] = useSyncedState('button-is-loading', loading || false);

  const currentColors = colors[isLoading ? 'loading' : variant];

  return (
    <AutoLayout
      spacing={spacing}
      onClick={onClick}
      fill={fill || currentColors.background}
      stroke={variant === 'outline' ? colors.outline.border : undefined}
      cornerRadius={rounded * borderRadius}
      padding={{ vertical: 8, horizontal: 16 }}
    >
      {Icon && <AutoLayout>{Icon}</AutoLayout>}
      <Text
        textDecoration={variant === 'link' ? 'underline' : 'none'}
        fill={currentColors.text}
        {...(href && { href: href })}
      >
        {isLoading ? 'Loading...' : label}
      </Text>
    </AutoLayout>
  );
};

export default Button;
