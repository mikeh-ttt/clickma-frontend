import { GetTaskByIDType } from '../../types/responses';
import { formatDate } from '../../utils/date';
import { parseMarkdown } from '../../utils/html';
import { spacing } from '../../utils/theme';
import Button from '../Button';
import { Collapse } from '../Collapse';
import { Divider } from '../Divider';
import { MarkdownContent } from '../MarkdownContent';
import { Typography } from '../Typography';
import TaskDetails from './TaskDetails';
import { TaskLink } from './TaskLink';
import { TaskSyncButton } from './TaskSyncButton';

const { widget } = figma;
const { AutoLayout, useSyncedState } = widget;
export const TaskCard = ({
  workspace,
  task,
  index,
  onSync,
}: {
  workspace: string;
  task: GetTaskByIDType;
  index: number;
  onSync: (task: GetTaskByIDType, index: number) => Promise<void>;
}) => {
  const [lastSyncTime, setLastSyncTime] = useSyncedState(
    `last-sync-${task.id}`,
    ''
  );

  const handleSync = () => {
    setLastSyncTime(formatDate(new Date()));
    onSync(task, index);
  };
  console.log(parseMarkdown(task.markdown_description || ''));
  return (
    <AutoLayout spacing={spacing * 2} direction='vertical'>
      {lastSyncTime ? (
        <AutoLayout verticalAlignItems='center'>
          <Typography fill='#666'>{`Last synced: ${lastSyncTime}`}</Typography>
        </AutoLayout>
      ) : null}
      <AutoLayout direction='horizontal' spacing='auto'>
        <AutoLayout>
          <Typography padding={{ right: 100 }} variant='h1'>
            {task.name}
          </Typography>
        </AutoLayout>
        <Button
          rounded={6}
          variant='secondary'
          label={task.status.status}
          fill={task.status.color}
        />
      </AutoLayout>

      <AutoLayout spacing={spacing * 2} direction='horizontal'>
        <TaskLink id={task.custom_id || task.id} workspace={workspace} />
        <TaskSyncButton
          id={task.id}
          workspace={workspace}
          onClick={async () => {
            await onSync(task, index);
            setLastSyncTime(formatDate(new Date()));
          }}
        />
      </AutoLayout>

      <Divider />

      <Collapse
        title='Ticket details'
        id={`${task.id}-${index}-ticket-description`}
        content={<TaskDetails task={task} />}
      />

      <Divider />

      <Collapse
        title='Ticket description'
        id={`${task.id}-${index}-html-description`}
        content={
          <AutoLayout
            width='fill-parent'
            direction='vertical'
            spacing={spacing}
          >
            <MarkdownContent
              mode='html'
              content={task.markdown_description || task.description}
              rawContent={task.description}
            />
          </AutoLayout>
        }
      />
    </AutoLayout>
  );
};
