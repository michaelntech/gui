import React from 'react';
import { Link } from 'react-router-dom';
import pluralize from 'pluralize';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import AutoSelect from '../../common/forms/autoselect';
import { RootRef } from '@material-ui/core';
import { getOnboardingComponentFor } from '../../../utils/onboardingmanager';
import AppStore from '../../../stores/app-store';

export default class SoftwareDevices extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  deploymentSettingsUpdate(value, property) {
    this.setState({ [property]: value });
    this.props.deploymentSettings(value, property);
  }

  render() {
    const self = this;

    return (
      <div style={{ overflow: 'visible', height: '300px' }}>
         {!artifactItems.length ? (
          <p className="info" style={{ marginTop: '0' }}>
            <ErrorOutlineIcon style={{ marginRight: '4px', fontSize: '18px', top: '4px', color: 'rgb(171, 16, 0)' }} />
            There are no artifacts available. <Link to="/artifacts">Upload one to the repository</Link> to get started.
          </p>
        ) : (
          <form>
            <RootRef rootRef={ref => (this.releaseRef = ref)}>
              <Grid container spacing={16}>
                <Grid item>
                  {release ? (
                    <TextField value={release.Name} label="Release" disabled={true} style={infoStyle} />
                  ) : (
                    <AutoSelect
                      className="margin-right"
                      label="Select target Release"
                      errorText="Choose a Release to be deployed"
                      items={artifactItems}
                      onChange={item => self.deploymentSettingsUpdate(item, 'artifact')}
                    />
                  )}
                </Grid>
              </Grid>
            </RootRef>

            <div ref={ref => (this.groupRef = ref)}>
              {self.state.disabled ? (
                <TextField value={device ? device.id : ''} label="Device" disabled={self.state.disabled} style={infoStyle} />
              ) : (
                <div>
                  <AutoSelect
                    label="Select target group"
                    errorText="Please select a group from the list"
                    items={groupItems}
                    disabled={!hasDevices}
                    onChange={item => self.deploymentSettingsUpdate(item, 'group')}
                  />
                  {hasDevices ? null : (
                    <p className="info" style={{ marginTop: '0' }}>
                      <ErrorOutlineIcon style={{ marginRight: '4px', fontSize: '18px', top: '4px', color: 'rgb(171, 16, 0)' }} />
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
            <div className="margin-top">
              {self.props.devices ? (
                <p>
                  ${devicesLength} devices will be targeted. 
                  <span onClick={() => showDevices()} className={this.state.disabled ? 'hidden' : 'link'}>
                    View the devices
                  </span>
                </p>
              ) : null}
              {hasDevices && artifactItems.length ? (
                <p className="info">
                  <InfoOutlinedIcon fontSize="small" style={{ verticalAlign: 'middle', margin: '0 6px 4px 0' }} />
                  The deployment will skip any devices that are already on the target Release version, or that have a different device type.
                </p>
              ) : null}
            </div>
          </form>
        )}
      </div>
    );
  }
}
