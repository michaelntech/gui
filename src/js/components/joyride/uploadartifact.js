import React from 'react';

var UploadArtifact = React.createClass({

  render: function () {
    var content = (
      <div>
        <p>The next step is to upload a <b>Mender Artifact</b> to the server.</p>
        <p>A Mender Artifact is a file format that includes metadata like the checksum and name, as well as the actual root file system that is deployed. See <a href="https://docs.mender.io/architecture/mender-artifacts" target="_blank">Mender Artifacts</a> for more.</p>
        <p>Now, <b>click the Artifacts tab</b> to continue.</p>
      </div>
    );
    if (this.props.uploaded) {
      content = (
        <div>
          <p>Now you're ready to deploy the Artifact to your virtual device.</p>
          <p><b>Click the Deployments tab</b> to continue.</p>
        </div>
      );
    } else if (this.props.loaded) {
      content = (
        <div>
          <p>First, <a href="https://d1b0l86ne08fsf.cloudfront.net/1.0.1/vexpress-qemu/vexpress_release_2_1.0.1.mender">download the compatible Artifact file</a> we have provided for testing. It is compatible with your virtual device.</p>
          <p>When you have downloaded it, <b>drag and drop</b> the file into the panel above to upload it to the Mender server.</p>
        </div>
      );
    }
    return (
      <div className="joyride-inline">
        {content}

        <a className="skip" onClick={this.props.joyrideSkip.bind(null, true)}>Skip tutorial</a>
      </div>
    )
  }
});

module.exports = UploadArtifact;

