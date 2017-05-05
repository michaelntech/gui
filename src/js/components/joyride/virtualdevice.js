import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

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
          <p>Your virtual device has been authorized, so you can now manage its deployments.</p>
          <RaisedButton className="float-right" label="Next" onClick={this.props.joyrideStep.bind(null, 5)} />
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
        
        <a className="skip" onClick={this.props.joyrideSkip.bind(null, true)}>Skip tutorial</a>
      </div>
    )
  }
});

module.exports = VirtualDevice;

