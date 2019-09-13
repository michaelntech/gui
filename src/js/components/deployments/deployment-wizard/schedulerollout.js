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

import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import MomentUtils from '@date-io/moment';

import { RootRef } from '@material-ui/core';
import { getOnboardingComponentFor } from '../../../utils/onboardingmanager';
import AppStore from '../../../stores/app-store';

export default class SoftwareDevices extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      disabled: false,
    };
  }

  deploymentSettingsUpdate(value, property) {
    this.setState({ [property]: value });
    this.props.deploymentSettings(value, property);
  }

  handleChange(event) {
    console.log(event.target.name, event.target.value);

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

                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="age-simple">Age</InputLabel>
                  <Select
                    onChange={self._handleChange}
                  >
                    <MenuItem value={0}>Start immediately</MenuItem>
                    <MenuItem value={1}>Schedule a start date & time</MenuItem>

                  </Select>
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
                    <TextField value={device ? device.id : ''} label="Device" disabled={self.state.disabled} style={styles.infoStyle} />
                  ) : (
                    <div>
                      <AutoSelect
                        label="Select a device group to deploy to"
                        errorText="Please select a group from the list"
                        value={self.props.group}
                        items={groupItems}
                        disabled={!hasDevices}
                        onChange={item => self.deploymentSettingsUpdate(item, 'group')}
                        style={styles.textField}
                      />
                      {hasDevices ? null : (
                        <p className="info" style={{ marginTop: '10px' }}>
                          <ErrorOutlineIcon style={{ marginRight: '4px', fontSize: '18px', top: '4px', color: 'rgb(171, 16, 0)', position: 'relative' }} />
                          There are no connected devices.{' '}
                          {hasPending ? (
                            <span>
                              <Link to="/devices/pending">Accept pending devices</Link> to get started.
                            </span>
                          ) : null}
                        </p>
                      )}
                    </div>
                  )}
             

                  {onboardingComponent}
                </div>
              </Grid>
            </Grid>


            <Grid 
              container 
              spacing={16} 
              justify="center" 
              alignItems="center"
            >
              <Grid item xs={10}>
             
              </Grid>
            </Grid>
          </div>
        </form>
      </div>
    );
  }
}
