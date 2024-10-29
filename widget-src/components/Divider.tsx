const { widget } = figma;
const { AutoLayout } = widget;
interface DividerProps {
  width?: number | 'fill-parent';
  stroke?: string;
  strokeWidth?: number;
}

export function Divider({
  width = 'fill-parent',
  stroke = '#00000040',
  strokeWidth = 2,
}: DividerProps) {
  return (
    <AutoLayout width={width} height={strokeWidth} fill={stroke} padding={0} />
  );
}
