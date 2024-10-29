// const { widget } = figma;
// const { AutoLayout, Text, useSyncedState } = widget;

// interface TableProps {
//   headers: string[];
//   data: TableRow[];
//   legendSelection: string;
// }

// interface TableRow {
//   stage: string;
//   count: number;
// }

// const stages = ['All Stages', 'Inactive Assets', 'Development & Production'];

// const Table = ({ headers, data, legendSelection }: TableProps) => (
//   <AutoLayout
//     direction='vertical'
//     spacing={8}
//     padding={16}
//     fill='#FFF'
//     stroke='#DDD'
//     cornerRadius={8}
//   >
//     {/* Render table header */}
//     <AutoLayout direction='horizontal' spacing={16}>
//       {headers.map((header) => (
//         <Text key={header} fontSize={14} weight='bold'>
//           {header}
//         </Text>
//       ))}
//     </AutoLayout>

//     {/* Render each row */}
//     {data
//       .filter(
//         (row) =>
//           legendSelection === 'All Stages' || row.stage === legendSelection
//       )
//       .map((row) => (
//         <AutoLayout direction='horizontal' spacing={16} key={row.stage}>
//           <Text fontSize={14}>{row.stage}</Text>
//           <Text fontSize={14}>{row.count}</Text>
//         </AutoLayout>
//       ))}
//   </AutoLayout>
// );
