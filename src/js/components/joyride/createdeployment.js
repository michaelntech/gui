import React from 'react';

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
          <p>Now a deployment has been created - the Artifact will be deployed to your virtual device.</p>
          <p>The device will download the image, install it and reboot.</p>
          <p></p>
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

        <a className="skip" onClick={this.props.joyrideSkip.bind(null, true)}>Skip tutorial</a>
      </div>
    )
  }
});

module.exports = CreateDeployment;

