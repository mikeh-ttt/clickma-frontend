const { widget } = figma;
const { AutoLayout, SVG, useSyncedState, Text, useEffect } = widget;

export const Checkbox = ({
  label,
  onChange,
  defaultChecked,
}: {
  label: string;
  onChange: (state: boolean) => void;
  defaultChecked?: boolean;
}) => {
  const [isChecked, setChecked] = useSyncedState(
    'isChecked',
    defaultChecked !== undefined ? defaultChecked : false
  );

  //   useEffect(() => {
  //     if (defaultChecked !== undefined) {
  //       setChecked(defaultChecked);
  //     }
  //   });

  // SVG path for the checkmark
  const checkMarkSvg = `
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 13l4 4L19 7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
  `;

  return (
    <AutoLayout
      direction='horizontal'
      verticalAlignItems='center'
      spacing={8}
      padding={8}
      onClick={() => {
        setChecked(!isChecked);
        onChange(!isChecked);
      }}
    >
      {/* Checkbox Box */}
      <AutoLayout
        width={24}
        height={24}
        fill={isChecked ? '#000' : '#FFFFFF'}
        stroke='#000'
        cornerRadius={4}
        horizontalAlignItems='center'
        verticalAlignItems='center'
      >
        {/* Show checkmark if checked */}
        {isChecked && <SVG src={checkMarkSvg} />}
      </AutoLayout>

      {/* Label */}
      <Text fontSize={14} fill='#333'>
        {label}
      </Text>
    </AutoLayout>
  );
};

export default Checkbox;
