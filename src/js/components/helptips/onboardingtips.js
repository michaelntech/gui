import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ReactTooltip from 'react-tooltip';

import { IconButton } from '@material-ui/core';
import { ArrowUpward as ArrowUpwardIcon, Close as CloseIcon, Schedule as HelpIcon } from '@material-ui/icons';

import { setSnackbar } from '../../actions/appActions';
import { setShowDismissOnboardingTipsDialog } from '../../actions/onboardingActions';
import { setShowConnectingDialog } from '../../actions/userActions';

const WelcomeSnackTipComponent = ({ progress, setSnackbar }) => {
  const onClose = (_, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar('');
  };

  const messages = {
    1: (
      <div>
        Welcome to Mender! Follow the{' '}
        <div className="onboard-icon">
          <ArrowUpwardIcon />
        </div>{' '}
        tutorial tips on screen to:
      </div>
    ),
    2: <div>Next up</div>,
    3: <div>Next up</div>,
    4: <div>Success!</div>
  };
  return (
    <div className="onboard-snack">
      <IconButton onClick={onClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
      <div className="flexbox">
        {messages[progress]}
        <ol>
          {['Connect a device', 'Deploy an Application Update', 'Create your own Release and deploy it'].map((item, index) => {
            let classNames = '';
            if (index < progress) {
              classNames = 'bold';
              if (index < progress - 1) {
                classNames = 'completed';
              }
            }
            return (
              <li className={classNames} key={`onboarding-step-${index}`}>
                {index + 1}. {item}
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
};

const mapDispatchToProps = dispatch => {
  return bindActionCreators({ setSnackbar }, dispatch);
};

export const WelcomeSnackTip = connect(null, mapDispatchToProps)(WelcomeSnackTipComponent);

class DevicePendingTipComponent extends React.PureComponent {
  componentDidUpdate() {
    ReactTooltip.show(this.tipRef);
  }
  render() {
    const { setShowConnectingDialog, setShowDismissOnboardingTipsDialog } = this.props;
    return (
      <div className="onboard-tip" style={{ left: '50%', top: '50%' }}>
        <a
          className="tooltip onboard-icon"
          data-tip
          data-for="pending-device-onboarding-tip"
          data-event="click focus"
          data-event-off="dblclick"
          ref={ref => (this.tipRef = ref)}
        >
          <HelpIcon />
        </a>
        <ReactTooltip id="pending-device-onboarding-tip" place="bottom" type="light" effect="solid" className="content" clickable={true}>
          <p>It may take a few moments before your device appears.</p>
          <a onClick={() => setShowConnectingDialog(true)}>Open the tutorial</a> again or{' '}
          <Link to="/help/application-updates/mender-deb-package">go to the help pages</Link> if you have problems.
          <div className="flexbox">
            <div style={{ flexGrow: 1 }} />
            <a onClick={() => setShowDismissOnboardingTipsDialog(true)}>Dismiss</a>
          </div>
        </ReactTooltip>
      </div>
    );
  }
}

const mappedActionCreators = dispatch => {
  return bindActionCreators({ setShowConnectingDialog, setShowDismissOnboardingTipsDialog }, dispatch);
};

export const DevicePendingTip = connect(null, mappedActionCreators)(DevicePendingTipComponent);

export const GetStartedTip = () => <div>Click here to get started!</div>;

export const DashboardOnboardingState = () => (
  <div>This should be your device, asking for permission to join the server. Inspect its identity details, then check it to accept it!</div>
);

export const DevicesPendingAcceptingOnboarding = () => <div>If you recognize this device as your own, you can accept it</div>;

export const DashboardOnboardingPendings = () => <div>Next accept your device</div>;

export const DevicesAcceptedOnboarding = () => (
  <div>
    <b>Good job! Your first device is connected!</b>
    <p>
      Your device is now <b>accepted</b>! It&apos;s now going to share inventory details with the server.
    </p>
    Click to expand the device and see more
  </div>
);

export const ApplicationUpdateReminderTip = () => (
  <div>
    <b>Deploy your first Application update</b>
    <p>
      To continue to make a demo deployment to this device click the <Link to="/releases">Releases</Link> tab
    </p>
  </div>
);

export const UploadPreparedArtifactTip = ({ demoArtifactLink }) => (
  <div>
    Download our prepared demo Artifact from <a href={demoArtifactLink}>here</a> to upload it to your profile.
  </div>
);

export const ArtifactIncludedOnboarding = ({ artifactIncluded }) => (
  <div>
    {artifactIncluded ? 'We have included' : 'Now you have'} a Mender artifact with a simple Application update for you to test with.
    <p>Expand it for more details.</p>
  </div>
);

export const ArtifactIncludedDeployOnboarding = () => <div>Let&apos;s deploy this Release to your device now</div>;

export const SchedulingArtifactSelection = ({ selectedRelease }) => <div>{`Select the ${selectedRelease} release we included.`}</div>;

export const SchedulingAllDevicesSelection = () => (
  <div>
    Select &apos;All devices&apos; for now.<p>You can learn how to create device groups later.</p>
  </div>
);

export const SchedulingGroupSelection = ({ createdGroup }) => <div>{`Select the ${createdGroup} device group you just made.`}</div>;

export const SchedulingReleaseToDevices = ({ selectedDevice, selectedGroup, selectedRelease }) => (
  <div>{`Create the deployment! This will deploy the ${selectedRelease.Name} Artifact to ${
    selectedDevice ? selectedDevice : selectedGroup || 'All devices'
  }`}</div>
);

export const DeploymentsInprogress = () => <div>Your deployment is in progress. Click to view a report</div>;

export const DeploymentsPast = () => <div>Your deployment has finished, click here to view it</div>;

export const DeploymentsPastCompletedFailure = () => (
  <div>Your deployment has finished, but it looks like there was a problem. Click to view the deployment report, where you can see the error log.</div>
);

export const UploadNewArtifactTip = ({ setShowCreateArtifactDialog }) => (
  <div>
    Click &apos;Upload&apos; to upload the file and create your new Release.
    <p>
      You can <a onClick={() => setShowCreateArtifactDialog(true)}>view the instructions again</a> if you need help creating the <i>index.html</i> file.
    </p>
  </div>
);

export const UploadNewArtifactDialogUpload = () => (
  <div>
    Drag or select your new <i>index.html</i> file here to upload it.
  </div>
);

export const UploadNewArtifactDialogDestination = () => (
  <div>
    We have prefilled this for you, for the demo - it is the destination on your device where the new <i>index.html</i> file will be installed.
    <p>Click &apos;Next&apos; below.</p>
  </div>
);

export const UploadNewArtifactDialogDeviceType = () => (
  <div>Enter the device types this will be compatible with. For the demo, you just need to select the device type of your demo device.</div>
);

export const UploadNewArtifactDialogReleaseName = () => (
  <div>
    Now name your Release: for the demo you could call it something like &quot;hello-world&quot;.
    <p>Then click &apos;Upload&apos; to finish this step!</p>
  </div>
);

export const ArtifactModifiedOnboarding = () => (
  <div>
    Your uploaded Artifact is now part of a new &apos;Release&apos;.
    <p>Now create a deployment with this Release!</p>
  </div>
);
