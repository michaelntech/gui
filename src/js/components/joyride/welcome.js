import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

var Welcome = React.createClass({
  _handleClick: function() {
    this.props.joyrideStep(1);
  },
  render: function () {
    return (
      <div className="joyride-inline">
        <div className="margin-bottom">
          <p>To get you familiar with the Mender UI, we're going to guide you through your first update. In this tutorial we will show how to complete 3 steps:</p>
          <ul className="unstyled">
            <li><FontIcon className="material-icons margin-right align-middle" style={{color: "#d4e9e7"}}>done</FontIcon>Connect a virtual device to the server,</li>
            <li><FontIcon className="material-icons margin-right align-middle" style={{color: "#d4e9e7"}}>done</FontIcon>Upload a Mender Artifact,</li>
            <li><FontIcon className="material-icons margin-right align-middle" style={{color: "#d4e9e7"}}>done</FontIcon>Deploy an update to the device.
            </li>
          </ul>
        </div>
         
        <a className="skip" onClick={this.props.joyrideSkip}>Skip tutorial</a><RaisedButton primary={true} className="float-right" label="Get started!" onClick={this._handleClick} />
      </div>
    )
  }
});

module.exports = Welcome;

