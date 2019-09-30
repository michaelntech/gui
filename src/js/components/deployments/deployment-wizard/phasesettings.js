import React from 'react';

import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/Add';

import { Table, TableBody, TableCell, TableHead, TableRow, Select, MenuItem, Input, IconButton } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';

export default class PhaseSettings extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  getRemainder(phases) {
    let remainder = 100;
    for (let phase of phases) {
      remainder = phase.batch_size ? remainder - phase.batch_size : remainder;
    }
    return remainder;

  }

  updateDelay(value, index) {
    let newPhases = this.props.phases;
    newPhases[index].delay = value;
    this.props.updatePhaseStarts(newPhases);
    // logic for updating time stamps should be in parent - only change delays here
  }

  updateBatchSize(value, index) {
    // When phase's batch size changes, adjust other phases' batch sizes starting with 'remainder' first.
    let newPhases = this.props.phases;

    if (value < 1) {
      value = 1;
    } else if (value >100) {
      value = 100;
    }

    newPhases[index].batch_size = value;
    const remainder = this.getRemainder(newPhases);
    // if new remainder will be 0 or negative remove last phase
    if (remainder < 1) {
      newPhases.pop();
      newPhases[newPhases.length-1].batch_size = this.getRemainder(newPhases);
    }

    this.props.deploymentSettings(newPhases, 'phases');
  }

  addPhase() {
    let phases = this.props.phases;
    let newPhase = {};

    // assign new batch size to *previous* last batch
    const remainder = this.getRemainder(phases);
    // make it 10, unless remainder is <=10 in which case make it half remainder
    let batch_size = (remainder>10) ? 10 : (Math.floor(remainder/2));
    phases[phases.length-1].batch_size = batch_size;

    // check for previous phase delay or set 2hr default
    const delay = phases[phases.length-1].delay || 2;
    phases[phases.length-1].delay = delay;
    
    phases.push(newPhase);
    // use function to set new phases incl start time of new phase
    this.props.updatePhaseStarts(phases);
  }

  removePhase(index) {
    let phases = this.props.phases;
    phases.splice(index, 1);
    if (phases.length===1) {
      delete phases[0].batch_size;
      delete phases[0].delay;
      this.props.deploymentSettings(phases, 'phases');
    } else {
      this.props.updatePhaseStarts(phases);
    }

  }

  render() {
    const self = this;
    const props = self.props;

    const remainder = self.getRemainder(props.phases);

    const hoursArray = [...Array(24).keys()];
    const hours = hoursArray.map((hour, idx) =>
      <MenuItem key={idx} value={idx+1}>{idx+1}</MenuItem>
    );

    const daysArray = [...Array(7).keys()];
    const days = daysArray.map((day, idx) =>
      <MenuItem key={idx} value={idx+1}>{idx+1}</MenuItem>
    );

  
    const phases = props.phases ? props.phases.map((phase, index) => {
      let max = index > 0 ? 100-(props.phases[index-1].batch_size) : 100;
      return (
        <TableRow key={index}>
          <TableCell component="th" scope="row">
            <Chip size="small" label={'Phase ' + (index+1).toString()} />
          </TableCell>
          <TableCell>{phase.batch_size && (phase.batch_size<100) ? 
            <Input
              value={phase.batch_size}
              margin="dense"
              onChange={event => self.updateBatchSize(event.target.value, index)}
              inputProps={{
                step: 1,
                min: 1,
                max: max,
                type: 'number',
              }}
            />
            : phase.batch_size || remainder}</TableCell>
          <TableCell>{phase.start_ts}</TableCell>
          <TableCell>
            { phase.delay && (index!==props.phases.length-1) ?
              <Select
                value={ phase.delay }
                onChange={event => self.updateDelay(event.target.value, index)}
              >
                { hours }
              </Select> 
              : '-' }
          </TableCell>
          <TableCell> 
            {index >= 1 ?
              <IconButton onClick={() => self.removePhase(index)}>
                <CancelIcon />
              </IconButton> 
            : null}
          </TableCell>
        </TableRow>
      )}) : null;

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

        <Chip disabled={remainder<=1} className="margin-top-small" color="primary" clickable icon={<AddIcon />} label="Add a phase" onClick={() => this.addPhase()} />
      </div>
    );
  }
}