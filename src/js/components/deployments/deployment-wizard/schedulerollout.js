import React from 'react';

import { FormControl, Grid, InputLabel, MenuItem, RootRef, Select } from '@material-ui/core';
import { DatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';

import PhaseSettings from './phasesettings';

export default class ScheduleRollout extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      disabled: false,
      pattern: '',
      isPickerOpen: false,
      isPhasesOpen: false
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.start_time !== this.props.start_time) {
      this.setState({ start_time: this.props.start_time });
    }
  }

  deploymentSettingsUpdate(value, property) {
    this.setState({ [property]: value });
    this.props.deploymentSettings(value, property);
  }

  handleStartChange() {
    // To be used with updated datetimepicker to open programmatically
    if (event.target.value) {
      this.setPickerOpen(true);
    }
  }

  handlePatternChange(value) {
    this.setState({ pattern: value });
  }

  setPickerOpen(value) {
    this.setState({ isPickerOpen: value });
    // To be used with updated datetimepicker
  }

  render() {
    const self = this;
    const props = self.props;

    const styles = {
      textField: {
        minWidth: '400px'
      },
      infoStyle: {
        minWidth: '400px',
        borderBottom: 'none'
      }
    };

    return (
      <div style={{ overflow: 'visible', minHeight: '300px', marginTop: '15px' }}>
        <form>
          <RootRef rootRef={ref => (this.scheduleRef = ref)}>
            <Grid container spacing={16} justify="center" alignItems="center">
              <Grid item>
                <div style={{width:'min-content', minHeight:'105px'}}>

                { (self.state.isPickerOpen || props.start_time) ?

                  <FormControl>
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DateTimePicker
                        open={self.state.isPickerOpen}
                        onOpen={() => self.setPickerOpen(true)}
                        onClose={() => self.setPickerOpen(false)}
                        label="Set the start time"
                        value={props.start_time}
                        style={styles.textField}
                        minDate={new Date()}
                        onChange={date => self.deploymentSettingsUpdate(date.toISOString(), 'start_time')}
                      />
                    </MuiPickersUtilsProvider>
                  </FormControl>
                  :
                  <FormControl>
                    <InputLabel>Set a start time</InputLabel>
                    <Select
                      onChange={event => this.handlePatternChange(event.target.value)}
                      value={0}
                      style={styles.textField}
                    >
                      <MenuItem value={0}>Start immediately</MenuItem>
                      <MenuItem value={1}>Schedule a start date & time</MenuItem>
                    </Select>
                  </FormControl>
                }
                 
                </div>
              </Grid>
            </Grid>
          </RootRef>

          <div ref={ref => (this.groupRef = ref)}>
            <Grid container spacing={16} justify="center" alignItems="center">
              <Grid item>
                <div style={{ width: 'min-content' }}>
                  <FormControl>
                    <InputLabel>Select a rollout pattern</InputLabel>
                    <Select onChange={event => this.handlePatternChange(event.target.value)} value={self.state.pattern} style={styles.textField}>
                      <MenuItem value={0}>Single phase: 100%</MenuItem>
                      <MenuItem value={1}>Custom</MenuItem>
                    </Select>
                  </FormControl>

                  {self.state.pattern ? <PhaseSettings {...props} /> : null}
                </div>
              </Grid>
            </Grid>
          </div>
        </form>
      </div>
    );
  }
}
