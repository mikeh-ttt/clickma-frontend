import Button from '../Button';

const { widget } = figma;
const { SVG } = widget;

export const TaskLink = ({
  id,
  workspace,
}: {
  id: string;
  workspace: string;
}) => {
  return (
    <Button
      icon={
        <SVG
          src={`
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11.25 2.25H15.75M15.75 2.25V6.75M15.75 2.25L7.5 10.5M13.5 9.75V14.25C13.5 14.6478 13.342 15.0294 13.0607 15.3107C12.7794 15.592 12.3978 15.75 12 15.75H3.75C3.35218 15.75 2.97064 15.592 2.68934 15.3107C2.40804 15.0294 2.25 14.6478 2.25 14.25V6C2.25 5.60218 2.40804 5.22064 2.68934 4.93934C2.97064 4.65804 3.35218 4.5 3.75 4.5H8.25" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
    `}
        />
      }
      variant='link'
      label={`Go to ${id}`}
      href={`https://app.clickup.com/t/${workspace}/${id}`}
    />
  );
};