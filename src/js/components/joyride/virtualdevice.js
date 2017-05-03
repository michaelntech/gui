import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';

var VirtualDevice = React.createClass({
  render: function () {
    var content = (
      <div>
        <p>Here you can see the ID and details of the device requesting authorization.</p>
        <p>Click to expand the row and view more device identity details.</p>
      </div>
    );
    if (this.props.accepted) {
      content = (
        <div>
          <p>Your virtual device has been accepted, so you can now manage its deployments.</p>
          <RaisedButton className="float-right" label="Next" onClick={this.props.joyrideStep.bind(null, 5)} />
        </div> 
      );
    } else if (this.props.clicked) {
      content = (
        <div>
          <p>Once you have seen the device's identity, click to authorize it.</p>
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

