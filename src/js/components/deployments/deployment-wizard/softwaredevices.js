import React from 'react';
import { Link } from 'react-router-dom';

import pluralize from 'pluralize';

import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';

import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

import Tooltip from '@material-ui/core/Tooltip';

import AutoSelect from '../../common/forms/autoselect';
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

  render() {
    const self = this;
    const { artifact, device, deploymentAnchor, deploymentDevices, groups, hasDevices, hasPending, showDevices } = self.props;

    var devicesLength = deploymentDevices ? deploymentDevices.length : 0;

    const styles = {
      textField: {
        minWidth: '400px'
      },
      infoStyle: {
        minWidth: '400px',
        borderBottom: 'none',
      }
    }

    const devicetypes = artifact ? artifact.device_types_compatible : []; 
    const tooltipTypes = (
       <p>{devicetypes.join(', ')}</p>
    );

    const devicetypesInfo = (
      <Tooltip title={tooltipTypes} placement="bottom">
        <span className="link">{devicetypes.length} device {pluralize('types', devicetypes.length)}</span>
      </Tooltip>
    );


    var artifactItems = this.props.artifacts.map(art => ({
      title: art.name,
      value: art
    }));


    const release = AppStore.getDeploymentRelease();
    const releaseDeviceTypes = release
      ? release.Artifacts.reduce((accu, item) => {
        accu.push(item.device_types_compatible);
        return accu;
      }, [])
      : [];

    let groupItems = [{ title: 'All devices', value: 'All devices' }];
    if (device) {
      // If single device, don't show groups
      groupItems[0] = {
        title: device.id,
        value: device
      };
      artifactItems = artifactItems.filter(art =>
        art.value.device_types_compatible.some(type => type === device.attributes.find(attr => attr.name === 'device_type').value)
      );
    } else {
      groupItems = groups.reduce((accu, group) => {
        accu.push({
          title: group,
          value: group
        });
        return accu;
      }, groupItems);
    }

    const groupLink = self.props.group ? `/devices/group=`+self.props.group : '/devices/';

    let onboardingComponent = null;
    if (this.releaseRef && this.groupRef && deploymentAnchor) {
      const anchor = { top: this.releaseRef.offsetTop + (this.releaseRef.offsetHeight / 3) * 2, left: this.releaseRef.offsetWidth / 2 };
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
        {!artifactItems.length ? (
          <p className="info" style={{ marginTop: '0' }}>
            <ErrorOutlineIcon style={{ marginRight: '4px', fontSize: '18px', top: '4px', color: 'rgb(171, 16, 0)' }} />
            There are no artifacts available. <Link to="/artifacts">Upload one to the repository</Link> to get started.
          </p>
        ) : (
          <form>
            <RootRef rootRef={ref => (this.releaseRef = ref)}>
              <Grid 
                container 
                spacing={16} 
                justify="center" 
                alignItems="center"
              >
                <Grid item>
                  <div style={{width:'min-content', minHeight:'105px'}}>
                    {release ? (
                      <TextField value={release.Name} label="Release" disabled={true} style={styles.infoStyle} />
                    ) : (
                      <AutoSelect
                        label="Select a Release to deploy"
                        errorText="Select a Release to deploy"
                        items={artifactItems}
                        onChange={item => self.deploymentSettingsUpdate(item, 'artifact')}
                        style={styles.textField}
                        value={artifact ? artifact.name : null}
                      />
                    )}


                    <div>
                      {artifact ? (
                        <p className="info" style={{marginBottom:0}}>
                          This Release is compatible with {devicetypesInfo}.
                        </p>
                      ) : null}
                    </div>
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
                   
                    {devicesLength ? (
                      <p className="info">
                        {devicesLength} {pluralize('devices', devicesLength)} will be targeted.{' '}
                      
                        <Link to={groupLink}>View the devices</Link>
                          
                      </p>
                    ) : null}         

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
                {devicesLength && artifact ? (
                  <p className="info icon">
                    <InfoOutlinedIcon fontSize="small" style={{ verticalAlign: 'middle', margin: '0 6px 4px 0' }} />
                    The deployment will skip any devices in the group that are already on the target Release version, or that have an incompatible device type.
                  </p>
                ) : null}
                </Grid>
              </Grid>
            </div>
          </form>
        )}
      </div>
    );
  }
}
