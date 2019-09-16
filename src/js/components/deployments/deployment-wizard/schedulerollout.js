import React from 'react';
import { Link } from 'react-router-dom';

import pluralize from 'pluralize';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import Tooltip from '@material-ui/core/Tooltip';

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import DateTimePicker from 'material-ui-pickers/DateTimePicker';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import MomentUtils from '@date-io/moment';

import { RootRef } from '@material-ui/core';
import { getOnboardingComponentFor } from '../../../utils/onboardingmanager';
import AppStore from '../../../stores/app-store';

export default class ScheduleRollout extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      disabled: false,
      start_time: '',
      pattern: '',
      isPickerOpen: true,
    };
  }

  deploymentSettingsUpdate(value, property) {
    this.setState({ [property]: value });
    this.props.deploymentSettings(value, property);
  }

  handleStartChange(event) {
    if (event.target.value === "immediate") {
      this.setState({start_time: event.target.value});
    } else {
      this.setPickerOpen(true);
    }

  }

  handlePatternChange(value) {

  }

  setPickerOpen(value) {
    this.setState({isPickerOpen: value});
    console.log(value);
  }

  render() {
    const self = this;
    const { artifact, device, deploymentAnchor, deploymentDevices, groups, hasDevices, hasPending, showDevices } = self.props;
  
    const styles = {
      textField: {
        minWidth: '400px'
      },
      infoStyle: {
        minWidth: '400px',
        borderBottom: 'none',
      }
    }

 
    let onboardingComponent = null;
    if (this.scheduleRef && this.groupRef && deploymentAnchor) {
      const anchor = { top: this.scheduleRef.offsetTop + (this.scheduleRef.offsetHeight / 3) * 2, left: this.scheduleRef.offsetWidth / 2 };
      onboardingComponent = getOnboardingComponentFor('scheduling-artifact-selection', { anchor, place: 'right' });
      const groupAnchor = { top: this.groupRef.offsetTop + (this.groupRef.offsetHeight / 3) * 2, left: this.groupRef.offsetWidth / 2 };
      onboardingComponent = getOnboardingComponentFor('scheduling-all-devices-selection', { anchor: groupAnchor, place: 'right' }, onboardingComponent);
      onboardingComponent = getOnboardingComponentFor('scheduling-group-selection', { anchor: groupAnchor, place: 'right' }, onboardingComponent);
      const buttonAnchor = {
        top: deploymentAnchor.offsetTop - deploymentAnchor.offsetHeight,
        left: deploymentAnchor.offsetLeft + deploymentAnchor.offsetWidth / 2
      };
      onboardingComponent = getOnboardingComponentFor('scheduling-release-to-devices', { anchor: buttonAnchor, place: 'bottom' }, onboardingComponent);
    }

    return (
      <div style={{ overflow: 'visible', minHeight: '300px', marginTop:'15px' }}>
      
        <form>
          <RootRef rootRef={ref => (this.scheduleRef = ref)}>
            <Grid 
              container 
              spacing={16} 
              justify="center" 
              alignItems="center"
            >
              <Grid item>
                <div style={{width:'min-content', minHeight:'105px'}}>

                <FormControl>
                  <InputLabel>Set the start time</InputLabel>
                  <Select
                    onChange={event => self.handleStartChange(event)}
                    value={self.state.start_time}
                    style={styles.textField}
                  >
                    <MenuItem value="immediate">Start immediately</MenuItem>
                    <MenuItem value="schedule">Schedule a start date & time</MenuItem>

                  </Select>

                  <MuiPickersUtilsProvider utils={MomentUtils} className="margin-left margin-right inline-block">
                    <DateTimePicker
                      open={self.state.isPickerOpen}
                      onOpen={() => self.setPickerOpen(true)}
                      onClose={() => self.setPickerOpen(false)}
                      label="Start time"
                      value={self.props.startDate}
                      onChange={date => self._handleChangeStartDate(date)}
                    />
         
                  </MuiPickersUtilsProvider>

                </FormControl>
                 
                </div>
              </Grid>
            </Grid>
          </RootRef>

          <div ref={ref => (this.groupRef = ref)}>
            <Grid 
              container 
              spacing={16} 
              justify="center" 
              alignItems="center"
            >
              <Grid item>
                <div style={{width:'min-content'}}>

                  {self.state.disabled ? (
                    <TextField value={"Single phase: 100%"} label="Select a rollout pattern" disabled={self.state.disabled} style={styles.infoStyle} />
                  ) : (
                   <FormControl>
                    <InputLabel>Select a rollout pattern</InputLabel>
                    <Select
                      onChange={event => this.handlePatternChange(event.target.value)}
                      value={self.state.pattern}
                      style={styles.textField}
                    >
                      <MenuItem value={0}>Single phase: 100%</MenuItem>
                      <MenuItem value={1}>Custom</MenuItem>

                    </Select>
                    </FormControl>
                  )}
             

                  {onboardingComponent}
                </div>
              </Grid>
            </Grid>

          </div>
        </form>
      </div>
    );
  }
}
