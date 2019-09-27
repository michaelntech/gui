import React from 'react';

import { FormControl, Grid, InputLabel, MenuItem, RootRef, Select } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
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

  handleStartTimeChange(value) {
    // if there is no existing phase, set phase and start time
    if (!this.props.phases) {
      this.props.deploymentSettings([{ batch_size: 100, start_ts: value, delay: 0}], 'phases');
    } else {
      //if there are existing phases, set the first phases to the new start time and adjust later phases in different function
      var newPhases = this.props.phases;
      newPhases[0].start_ts = value;
      this.updatePhaseStarts(newPhases);
    }
    
  }

  updatePhaseStarts(phases) {
    // Iterate through phases ensuring start times are based on delay from previous phase
    for (var i=1; i<phases.length; i++) {
      phases[i].start_ts = phases[i-1].start_ts.addHours(phases[i-1].delay);
      if (i===phases.length-1) {
        this.props.deploymentSettings(phases);
      }
    }
  }

  handleStartChange(value) {
    // To be used with updated datetimepicker to open programmatically
    if (value) {
      this.setPickerOpen(true);
    }
  }

  handlePatternChange(value) {
    var phases = [];
    // if setting new custom pattern we use default 2 phases
    if (value === 'custom') {
      phases = [{batch_size:10, start_ts:new Date().toISOString(), delay:2},{}];
      // check if a start time already exists from props and if so, use it
      if (this.props.phases) {
        phases[0].start_ts = this.props.phases[0].start_ts;
      }
      this.updatePhaseStarts(phases);
      this.setState({ pattern: value });
    }
  }

  setPickerOpen(value) {
    this.setState({ isPickerOpen: value });
    // To be used with updated datetimepicker

  }

  render() {
    const self = this;
    const props = self.props;
    const start_time = props.phases ? props.phases[0].start_ts : null;

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
            <Grid container justify="center" alignItems="center">
              <Grid item>
                <div style={{width:'min-content', minHeight:'105px'}}>

                  { (self.state.isPickerOpen || start_time) ?

                    <FormControl>
                      <MuiPickersUtilsProvider utils={MomentUtils}>
                        <DateTimePicker
                          open={self.state.isPickerOpen}
                          onOpen={() => self.setPickerOpen(true)}
                          onClose={() => self.setPickerOpen(false)}
                          label="Set the start time"
                          value={start_time}
                          style={styles.textField}
                          minDate={new Date()}
                          onChange={date => self.handleStartTimeChange(date.toISOString())}
                        />
                      </MuiPickersUtilsProvider>
                    </FormControl>
                    :
                    <FormControl>
                      <InputLabel>Set a start time</InputLabel>
                      <Select
                        onChange={event => this.handleStartChange(event.target.value)}
                        value={0}
                        style={styles.textField}
                      >
                        <MenuItem value={0}>Start immediately</MenuItem>
                        <MenuItem value="custom">Schedule a start date & time</MenuItem>
                      </Select>
                    </FormControl>
                  }
                 
                </div>
              </Grid>
            </Grid>
          </RootRef>

          <div>
            <Grid container justify="center" alignItems="center">
              <Grid item>
                <div style={{ width:'min-content' }}>
                  <FormControl>
                    <InputLabel>Select a rollout pattern</InputLabel>
                    <Select onChange={event => this.handlePatternChange(event.target.value)} value={self.state.pattern ? 1 : 0} style={styles.textField}>
                      <MenuItem value={0}>Single phase: 100%</MenuItem>
                      <MenuItem value={1}>Custom</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </Grid>
            </Grid>

            {self.state.pattern ? 
              <Grid style={{ marginBottom: '15px' }} container justify="center" alignItems="center">
                <Grid item>
                  <PhaseSettings {...props} updatePhaseStarts={this.updatePhaseStarts} />
                </Grid>
              </Grid>
              : null
            }
            
          </div>
        </form>
      </div>
    );
  }
}
