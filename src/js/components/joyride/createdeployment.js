import React from 'react';
import FontIcon from 'material-ui/FontIcon';
import RaisedButton from 'material-ui/RaisedButton';

var CreateDeployment = React.createClass({

  render: function () {
    var content = (
      <div>
        <p>Now that we have a device connected and an Artifact uploaded to the server, all that remains is to <b>create a deployment</b>.</p>
      </div>
    );
    if (this.props.created) {
      content = (
        <div>
          <ul className="unstyled">
            <li><FontIcon className="material-icons margin-right align-middle" style={{color: "#009E73"}}>done</FontIcon>Connect a virtual device to the server</li>
            <li><FontIcon className="material-icons margin-right align-middle" style={{color: "#009E73"}}>done</FontIcon>Upload a Mender Artifact</li>
            <li><FontIcon className="material-icons margin-right align-middle success-tick" style={{color: "#009E73"}}>done</FontIcon>Deploy an update to the device</li>
          </ul>
          <p>Congratulations! You're now deploying your first update. The device will download the Artifact, install the image and reboot.</p>
          <p>Now you can track the deployment's progress and see it in the dashboard.</p>
          <RaisedButton className="float-right" label="Finish" primary={true} onClick={this.props.joyrideSkip} />
        </div>
      );
    } else if (this.props.ready) {
      content = (
        <div>
          <p>Now hit <b>Create deployment</b> to deploy your first update!</p>
        </div>
      );
    } else if (this.props.artifact) {
      content = (
        <div>
          <p>Now select "All devices" from the dropdown. This selects which devices the Artifact will be deployed to - in this case it will include only your virtual device.</p>
          <p className="info"><i>You can learn more about organizing your devices into custom groups later</i>.</p>
        </div>
      );
    }
    else if (this.props.clicked) {
      content = (
        <div>
          <p>From the dropdown, select the Artifact you have just uploaded. This will be deployed to your device.</p>
        </div>
      );
    }
    return (
      <div className="joyride-inline">
        {content}

        <a className="skip" onClick={this.props.joyrideSkip}>Skip tutorial</a>
      </div>
    )
  }
});

module.exports = CreateDeployment;

