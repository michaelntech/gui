import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Router, Route } from 'react-router';

var AuthRequest = React.createClass({

  _handleRedirect: function() {
    this.context.router.push("/devices");
  },
  render: function () {
    return (
      <div className="joyride-inline">
        <p>There is 1 virtual device asking for permission to join the server so that you can manage its deployments.</p>

        <p>Click <b>Review details</b> to view the device that is waiting to be authorized.</p>
         
        <a className="skip" onClick={this.props.joyrideSkip.bind(null, true)}>Skip tutorial</a>
      </div>
    )
  }
});

AuthRequest.contextTypes = {
  router: React.PropTypes.object,
};

module.exports = AuthRequest;