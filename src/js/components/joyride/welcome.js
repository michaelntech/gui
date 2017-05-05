import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

var Welcome = React.createClass({
  _handleClick: function() {
    this.props.joyrideStep(1);
  },
  render: function () {
    return (
      <div className="joyride-inline">
        <div className="margin-bottom">
          <p>In this tutorial we will show how to use the Mender UI to:</p>
          <ul>
            <li>connect a virtual device to the server,</li>
            <li>upload a Mender Artifact,</li>
            <li>then deploy a full rootfs image update to the device.
            </li>
          </ul>
        </div>
         
        <a className="skip" onClick={this.props.joyrideSkip.bind(null, true)}>Skip tutorial</a><RaisedButton primary={true} className="float-right" label="Get started!" onClick={this._handleClick} />
      </div>
    )
  }
});

module.exports = Welcome;

