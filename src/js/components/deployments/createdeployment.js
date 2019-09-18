import React from 'react';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

import SoftwareDevices from './deployment-wizard/softwaredevices';
import ScheduleRollout from './deployment-wizard/schedulerollout';

import AppStore from '../../stores/app-store';

export default class ScheduleDialog extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      showDevices: false,
      activeStep: 0,
      disabled: true,
      isEnterprise: AppStore.getIsEnterprise()
    };
  }

  componentWillReceiveProps(nextProps) {
    var disabled = true;
    if (this.state.activeStep === 0 && (nextProps.deploymentDevices && nextProps.deploymentDevices.length > 0) && nextProps.artifact) {
      disabled = false;
    }

    this.setState({disabled: disabled});
  }

  _getSteps() {
    return ['Select target software and devices', 'Set a rollout schedule', 'Review and create'];
  }

  _getStepContent(stepIndex) {
    const props = this.props;

    if (this.state.isEnterprise) {
      switch (stepIndex) {
      case 0:
        return <SoftwareDevices isEnterprise={true} { ...props} />;
      case 1:
        return <ScheduleRollout { ...props} />;
      case 2:
        return 'review';
      default:
        return 'Unknown stepIndex';
      }
    } else {
      switch (stepIndex) {
      case 0:
        return <SoftwareDevices { ...props} />;
      case 1:
        return 'review';
      default:
        return 'Unknown stepIndex';
      }
    }
  }

  render() {
    const self = this;
    const { artifact, open, onDismiss, deploymentDevices, ...other } = this.props;
    var disabled = deploymentDevices && deploymentDevices.length > 0 ? false : true;
    const steps = self._getSteps();

    return (
      <Dialog open={open || false} fullWidth={true} maxWidth="sm">
        <DialogTitle>Create a deployment</DialogTitle>
        <DialogContent className="dialog">
          <Stepper activeStep={self.state.activeStep} alternativeLabel>
            {steps.map(label => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <div>
            {self._getStepContent(self.state.activeStep)}
            
          </div>
          
        </DialogContent>
        <DialogActions>
          <Button key="schedule-action-button-1" onClick={onDismiss} style={{ marginRight: '10px', display: 'inline-block' }}>
            Cancel
          </Button>
          <Button
            disabled={self.state.activeStep === 0}
            onClick={() => self.setState({ activeStep: self.state.activeStep - 1 })}
          >
          Back
          </Button>
          <div style={{ flexGrow: 1 }} />
          <Button 
            variant="contained" 
            color="primary"
            disabled={self.state.disabled}
            onClick={(self.state.activeStep === steps.length - 1) ? () => self.onScheduleSubmit(self.state.group, deploymentDevices, self.state.artifact || artifact) : () => self.setState({ activeStep: self.state.activeStep + 1 })}
          >
            {self.state.activeStep === steps.length - 1 ? 'Create' : 'Next'}
          </Button>
      
        </DialogActions>
      </Dialog>
    );
  }
}

