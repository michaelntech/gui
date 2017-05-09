import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';

var VirtualDevice = React.createClass({
  render: function () {
    var content = (
      <div>
        <p>Here you can see the ID and details of the device requesting authorization.</p>
        <p><b>Click the row to expand it</b> and view further device identity details.</p>
      </div>
    );
    if (this.props.accepted) {
      content = (
        <div>
          <ul className="unstyled">
            <li><FontIcon className="material-icons margin-right align-middle success-tick" style={{color: "#009E73"}}>done</FontIcon>Connect a virtual device to the server</li>
            <li style={{color:"#c7c7c7"}}><FontIcon className="material-icons margin-right align-middle" style={{color: "#d4e9e7"}}>done</FontIcon>Upload a Mender Artifact</li>
            <li style={{color:"#c7c7c7"}}><FontIcon className="material-icons margin-right align-middle" style={{color: "#d4e9e7"}}>done</FontIcon>Deploy an update to the device
            </li>
          </ul>
          <p>Now your device has been authorized, you can manage its deployments.</p>
          <RaisedButton className="float-right" label="Next" primary={true} onClick={this.props.joyrideStep.bind(null, 5)} />
        </div> 
      );
    } else if (this.props.clicked) {
      content = (
        <div>
          <p>Now you can see all of the device's identity details on the left. <b>Click the button with the checkmark</b> to authorize the device.</p>
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

module.exports = VirtualDevice;

