import React from 'react';
import FontIcon from 'material-ui/FontIcon';

var UploadArtifact = React.createClass({

  render: function () {
    var content = (
      <div>
        <p>The next step is to upload a <b>Mender artifact</b> to the server.</p>
        <p>A Mender Artifact is a file format that includes metadata like the checksum and name, as well as the actual root file system that will be deployed. See <a href="https://docs.mender.io/architecture/mender-artifacts" target="_blank">Mender artifacts documentation</a> for more.</p>
        <p>Now, <b>click the Artifacts tab</b> to continue.</p>
      </div>
    );
    if (this.props.uploaded) {
      content = (
        <div>
          <ul className="unstyled">
            <li><FontIcon className="material-icons margin-right align-middle" style={{color: "#009E73"}}>done</FontIcon>Connect a virtual device to the server</li>
            <li style={{color: "#009E73"}}><FontIcon className="material-icons margin-right align-middle success-tick" style={{color: "#009E73"}}>done</FontIcon>Upload a Mender artifact</li>
            <li style={{color:"#c7c7c7"}}><FontIcon className="material-icons margin-right align-middle" style={{color: "#d4e9e7"}}>done</FontIcon>Deploy an update to the device</li>
          </ul>
          <p>Now you've uploaded the artifact, you're ready to deploy it as an update to your virtual device.</p>
          <p><b>Click the Deployments tab</b> to continue.</p>
        </div>
      );
    } else if (this.props.loaded) {
      content = (
        <div>
          <p>First, <a href="https://d1b0l86ne08fsf.cloudfront.net/1.0.1/vexpress-qemu/vexpress_release_2_1.0.1.mender">download the compatible artifact file</a> we have provided for testing. It is compatible with your virtual device.</p>
          <p>When you have downloaded it, <b>drag and drop</b> the file into the panel above to upload it to the Mender server.</p>
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

module.exports = UploadArtifact;

