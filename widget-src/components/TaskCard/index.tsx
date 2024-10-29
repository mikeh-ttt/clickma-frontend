import { GetTaskByIDType } from '../../types/responses';
import Button from '../Button';
import { Collapse } from '../Collapse';
import { Divider } from '../Divider';
import { Typography } from '../Typography';
import TaskDetails from './TaskDetails';
import { TaskLink } from './TaskLink';
import { TaskSyncButton } from './TaskSyncButton';

const { widget } = figma;
const { AutoLayout, Text, useSyncedState } = widget;
export const TaskCard = ({
  workspace,
  task,
  index,
}: {
  workspace: string;
  task: GetTaskByIDType;
  index: number;
}) => (
  <AutoLayout spacing={20} direction='vertical'>
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

    <AutoLayout spacing={12} direction='horizontal'>
      <TaskLink id={task.custom_id || task.id} workspace={workspace} />
      <TaskSyncButton id={task.id} workspace={workspace} />
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
      content={task.description}
    />
  </AutoLayout>
);
