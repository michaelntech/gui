import React from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Step, StepLabel, Stepper } from '@material-ui/core';

import SoftwareDevices from './deployment-wizard/softwaredevices';
import ScheduleRollout from './deployment-wizard/schedulerollout';
import Review from './deployment-wizard/review';

import AppStore from '../../stores/app-store';

const deploymentSteps = [
  { title: 'Select target software and devices', closed: false, component: SoftwareDevices },
  { title: 'Set a rollout schedule', closed: true, component: ScheduleRollout },
  { title: 'Review and create', closed: false, component: Review }
];

export default class ScheduleDialog extends React.Component {
  constructor(props, context) {
    super(props, context);
    const isEnterprise = AppStore.getIsEnterprise();
    const steps = deploymentSteps.reduce((accu, step) => {
      if (step.closed && !isEnterprise) {
        return accu;
      }
      accu.push(step);
      return accu;
    }, []);
    this.state = {
      activeStep: 0,
      release: null,
      deploymentDeviceIds: [],
      isEnterprise,
      steps
    };
  }

  deploymentSettings(value, property) {
    this.setState({ [property]: value });
  }

  render() {
    const self = this;
    const { open, onDismiss, onScheduleSubmit } = this.props;
    const { activeStep, release, deploymentDeviceIds, group, steps } = self.state;
    const disabled = !(release && deploymentDeviceIds.length);
    const finalStep = activeStep === steps.length - 1;
    const ComponentToShow = steps[activeStep].component;
    return (
      <Dialog open={open || false} fullWidth={true} maxWidth="sm">
        <DialogTitle>Create a deployment</DialogTitle>
        <DialogContent className="dialog">
          <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map(step => (
              <Step key={step.title}>
                <StepLabel>{step.title}</StepLabel>
              </Step>
            ))}
          </Stepper>
          <ComponentToShow deploymentSettings={(...args) => self.deploymentSettings(...args)} {...self.props} {...self.state} />
        </DialogContent>
        <DialogActions>
          <Button key="schedule-action-button-1" onClick={onDismiss} style={{ marginRight: '10px', display: 'inline-block' }}>
            Cancel
          </Button>
          <Button disabled={activeStep === 0} onClick={() => self.setState({ activeStep: activeStep - 1 })}>
            Back
          </Button>
          <div style={{ flexGrow: 1 }} />
          <Button
            variant="contained"
            color="primary"
            disabled={disabled}
            onClick={finalStep ? () => onScheduleSubmit(group, deploymentDeviceIds, release) : () => self.setState({ activeStep: activeStep + 1 })}
          >
            {finalStep ? 'Create' : 'Next'}
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}
