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

import PhaseSettings from './phasesettings';


import { DateTimePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';
import MomentUtils from '@date-io/moment';

import { RootRef } from '@material-ui/core';
import { getOnboardingComponentFor } from '../../../utils/onboardingmanager';
import AppStore from '../../../stores/app-store';

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
      this.setState({start_time: this.props.start_time});
    }
  }

  deploymentSettingsUpdate(value, property) {
    this.setState({ [property]: value });
    this.props.deploymentSettings(value, property);
  }

  handleStartChange(event) {
    // To be used with updated datetimepicker to open programmatically
    /*if (event.target.value === "immediate") {
      this.setState({start_time: event.target.value});
    } else {
      this.setPickerOpen(true);
    }*/
  }

  handlePatternChange(value) {
    this.setState({pattern: value});
  }

  setPickerOpen(value) {
    this.setState({isPickerOpen: value});
    // To be used with updated datetimepicker
  }


  render() {
    const self = this;
    const props = self.props;
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
                    <MuiPickersUtilsProvider utils={MomentUtils}>
                      <DateTimePicker
                        open={self.state.isPickerOpen}
                        onOpen={() => self.setPickerOpen(true)}
                        onClose={() => self.setPickerOpen(false)}
                        label="Set the start time"
                        value={self.state.start_time}
                        style={styles.textField}
                        minDate={ new Date() }
                        onChange={date => self.deploymentSettingsUpdate(date.toISOString(), 'start_time')}
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

                  {self.state.pattern ? <PhaseSettings { ...props } /> : null }
                  
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
