import { GetTaskByIDType } from '../../types/responses';
import { formatDuration, formatTimestampToDate } from '../../utils/date';
import { spacing } from '../../utils/theme';
import { Typography } from '../Typography';

const { widget } = figma;
const { AutoLayout } = widget;

export const TicketDetails = ({ task }: { task: GetTaskByIDType }) => {
  return (
    <AutoLayout direction='vertical' width='fill-parent' spacing={spacing * 2}>
      {/* Details grid */}
      <AutoLayout
        direction='vertical'
        width='fill-parent'
        spacing={spacing * 2}
      >
        {/* Row 1 */}
        <AutoLayout direction='horizontal' width='fill-parent'>
          {/* Left column */}
          <AutoLayout direction='vertical' width='fill-parent'>
            <Typography variant='h5' children='Assignee' />
            <Typography
              children={task.assignees.map((e) => e.username).join(', ')}
            />
          </AutoLayout>
          {/* Right column */}
          <AutoLayout direction='vertical' width='fill-parent'>
            <Typography variant='h5' children='Priority' />
            <Typography children={task?.priority?.priority || '-'} />
          </AutoLayout>
        </AutoLayout>

        {/* Row 2 */}
        <AutoLayout direction='horizontal' width='fill-parent'>
          {/* Left column */}
          <AutoLayout direction='vertical' width='fill-parent'>
            <Typography variant='h5' children='Time estimate' />
            <Typography
              children={
                task.time_estimate
                  ? formatDuration(Number(task.time_estimate))
                  : '-'
              }
            />
          </AutoLayout>
          {/* Right column */}
          <AutoLayout direction='vertical' width='fill-parent'>
            <Typography variant='h5' children='Sprint points' />
            <Typography children={task.points || '-'} />
          </AutoLayout>
        </AutoLayout>

        {/* Row 3 */}
        <AutoLayout direction='horizontal' width='fill-parent'>
          {/* Left column */}
          <AutoLayout direction='vertical' width='fill-parent'>
            <Typography variant='h5' children='Dates' />
            <Typography
              children={
                task.date_created && formatTimestampToDate(task.date_created)
              }
            />
          </AutoLayout>
          {/* Right column */}
          <AutoLayout direction='vertical' width='fill-parent'>
            <Typography variant='h5' children='Tags' />
            <Typography children={task.tags.map((e) => e.name).join(', ')} />
          </AutoLayout>
        </AutoLayout>
      </AutoLayout>
    </AutoLayout>
  );
};

export default TicketDetails;
