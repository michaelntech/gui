import React from 'react';

import { Chip, List, Table, TableBody, TableCell, TableRow } from '@material-ui/core';

import ExpandableDeviceAttribute from '../../devices/expandable-device-attribute';

const Review = props => {
  const { release, group, deploymentDeviceIds, startTime, phases = [] } = props;
  // const rows = [
  //   {
  //     batch_size: 100,
  //     start_ts: props.start_time
  //   }
  // ];

  const items = [
    { primary: 'Release', secondary: release.name },
    { primary: 'Device group', secondary: group },
    { primary: 'Device types compatible', secondary: release.device_types_compatible.join(', ') },
    { primary: '# devices', secondary: deploymentDeviceIds.length },
    { primary: 'Start time', secondary: startTime }
  ];

  return (
    <div className="device-identity bordered">
      <h4 className="margin-bottom-none">Review deployment details</h4>

      <List className="list-horizontal-flex">
        {items.map(item => (
          <ExpandableDeviceAttribute key={item.primary} primary={item.primary} secondary={item.secondary} style={{ flexBasis: 200 }} dividerDisabled={true} />
        ))}
      </List>

      <h6 className="margin-bottom-none">Rollout Schedule</h6>

      <span>Batch size</span>
      <span>Phase begins</span>
      <Table size="small">
        <TableBody>
          {phases.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                <Chip size="small" label={'Phase ' + index} />
              </TableCell>
              <TableCell>{row.batch_size}</TableCell>
              <TableCell>{row.start_ts}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Review;
