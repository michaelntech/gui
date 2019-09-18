import React, { useState } from 'react';

import Chip from '@material-ui/core/Chip';
import AddIcon from '@material-ui/icons/Add';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

function PhaseSettings(props) {

  const rows = [{
    batch_size: 100,
    start_ts: props.start_time
  }];

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
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell component="th" scope="row">
                <Chip size="small" label={"Phase "+index} />
              </TableCell>
              <TableCell>{row.batch_size}</TableCell>
              <TableCell>{row.start_ts}</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Chip color="primary" clickable icon={<AddIcon />} label="Add a phase" />

    </div>
  );
}

export default PhaseSettings;