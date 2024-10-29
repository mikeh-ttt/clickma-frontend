import Button from '../Button';

const { widget } = figma;
const { SVG } = widget;

export const TaskSyncButton = ({
  id,
  workspace,
  onClick,
}: {
  id: string;
  workspace: string;
  onClick: () => void;
}) => {
  return (
    <Button
      onClick={onClick}
      icon={
        <SVG
          src={`
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 8C2 6.4087 2.63214 4.88258 3.75736 3.75736C4.88258 2.63214 6.4087 2 8 2C9.67737 2.00631 11.2874 2.66082 12.4933 3.82667L14 5.33333M14 5.33333V2M14 5.33333H10.6667M14 8C14 9.5913 13.3679 11.1174 12.2426 12.2426C11.1174 13.3679 9.5913 14 8 14C6.32263 13.9937 4.71265 13.3392 3.50667 12.1733L2 10.6667M2 10.6667H5.33333M2 10.6667V14" stroke="black" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `}
        />
      }
      variant='outline'
      label={`Sync`}
    />
  );
};
