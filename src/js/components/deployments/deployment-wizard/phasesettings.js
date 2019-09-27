import React from 'react';

import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/Add';

import { Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem } from '@material-ui/core';

export default class PhaseSettings extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  updateDelay(value, index) {
    const newPhases = this.props.phases;
    newPhases[index].delay = value;
    this.props.updatePhaseStarts(newPhases);
    // logic for updating time stamps should be in parent - only change delays here
  }

  render() {
    const self = this;
    const props = self.props;
    console.log(props);
    const hours = new Array(24);
  
    const phases = props.phases.map((phase, index) => (
      <TableRow key={index}>
        <TableCell component="th" scope="row">
          <Chip size="small" label={'Phase ' + index} />
        </TableCell>
        <TableCell>{phase.batch_size}</TableCell>
        <TableCell>{phase.start_ts}</TableCell>
        <TableCell>
          { phase.delay ?
            <Select
              value={phase.delay}
              onChange={(event, index) => self.updateDelay(event.target.value, index)}
            >
              {hours.map(hour =>
                <MenuItem key={hour} value={hour+1}>{hour+1}</MenuItem>
              )}
            </Select> 
            : null }
        </TableCell>
        <TableCell></TableCell>
      </TableRow>
    ));

    return (
      <div>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>Batch size</TableCell>
              <TableCell>Phase begins</TableCell>
              <TableCell>Delay before next phase</TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {phases}
          </TableBody>
        </Table>

        <Chip className="margin-top-small" color="primary" clickable icon={<AddIcon />} label="Add a phase" />
      </div>
    );
  }
}