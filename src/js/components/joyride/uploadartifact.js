import React from 'react';

var UploadArtifact = React.createClass({

  render: function () {
    var content = (
      <div>
        <p>The next step is to upload a Mender Artifact to the server.</p>
        <p>Click the 'Artifacts' tab to continue.</p>
      </div>
    );
    if (this.props.uploaded) {
      content = (
        <div>
          <p>Now you're ready to deploy the Artifact to your virtual device.</p>
          <p>Click the 'Deployments' tab to continue.</p>
        </div>
      );
    } else if (this.props.loaded) {
      content = (
        <div>
          <p>First, <a href="https://d1b0l86ne08fsf.cloudfront.net/1.0.1/vexpress-qemu/vexpress_release_2_1.0.1.mender">download the compatible Artifact file</a> we have provided for testing. It is compatible with your virtual device.</p>
          <p>When you have downloaded it, drag and drop the file into the panel above to upload it to the Mender server.</p>
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

