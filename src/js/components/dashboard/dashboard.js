import React from 'react';
var AppStore = require('../../stores/app-store');
var LocalStore = require('../../stores/local-store');
var AppActions = require('../../actions/app-actions');
var Deployments = require('./deployments');

import { Router, Route, Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import FontIcon from 'material-ui/FontIcon';

function getState() {
  return {
    progress: AppStore.getDeploymentsInProgress(),
    health: AppStore.getHealth(),
    devices: AppStore.getAllDevices(),
    recent: AppStore.getPastDeployments(),
    activity: AppStore.getActivity(),
    hideReview: localStorage.getItem("reviewDevices"),
    snackbar: AppStore.getSnackbar()
  }
}


var Dashboard = React.createClass({
  getInitialState: function() {
    return getState();
  },
  componentWillMount: function() {
    AppStore.changeListener(this._onChange);
  },
  componentWillUnmount: function () {
    clearInterval(this.timer);
    AppStore.removeChangeListener(this._onChange);
  },
  componentDidMount: function() {
    var self = this;
    self.timer = setInterval(self._refreshDeployments, 5000);
    self._refreshDeployments();
    self._refreshAdmissions();
    
    // joyride
    this.props.addTooltip({
      text: 'A new device is asking to connect to the Mender server. You can click <b>Review details</b> to view the device that is waiting to be authorized.',
      selector: '#dashboardPending',
      trigger: '#dashboardPending',
      position: 'bottom'
    });
  },
  _onChange: function() {
    this.setState(this.getInitialState());
  },
  _setStorage: function(key, value) {
    AppActions.setLocalStorage(key, value);
  },
  _refreshDeployments: function() {
    AppActions.getPastDeployments(function() {
      setTimeout(function() {
        this.setState({doneActiveDepsLoading:true});
      }.bind(this), 300)
    }.bind(this), 1, 3);
    AppActions.getDeploymentsInProgress(function() {
      setTimeout(function() {
        this.setState({donePastDepsLoading:true});
      }.bind(this), 300)
    }.bind(this));
  },
  _refreshAdmissions: function() {
    var self = this;
    AppActions.getNumberOfDevicesForAdmission(function(count) {
      var pending = count;
      self.setState({pending: pending});
      setTimeout(function() {
        self.setState({doneAdmnsLoading:true});
      }, 300)
    });
  },
  _handleClick: function(params) {
    switch(params.route){
      case "deployments":
        var tab = (params.tab || "progress") + "/";
        var URIParams = "open="+params.open;
        URIParams = params.id ? URIParams + "&id="+params.id : URIParams;
        URIParams = encodeURIComponent(URIParams);
        this.context.router.push('/deployments/'+tab +URIParams);
        break;
      case "devices":
        var filters = params.status ? encodeURIComponent("status="+params.status) : '';
        this.context.router.push('/devices/'+filters);
        break;
    }
  },
  render: function() {
    var pending_str = '';
    if (this.state.pending) {
      if (this.state.pending > 1) {
        pending_str = 'are ' + this.state.pending + ' devices';
      } else {
        pending_str = 'is ' + this.state.pending + ' device';
      }
    }
    return (
      <div className="contentContainer dashboard">
        <div>
          <div className={this.state.pending && !this.state.hideReview ? "onboard margin-bottom review-devices" : "hidden" }>
            <div className="close" onClick={this._setStorage.bind(null, "reviewDevices", true)} />
            <p>There {pending_str} waiting authorization</p>
            <RaisedButton onClick={this._handleClick.bind(null, {route:"devices"})} primary={true} label="Review details" />
          </div>

          { !this.props.openedTips["#dashboardPending"]
            ? 
            <FontIcon id="dashboardPending" className={this.props.showHelpTooltips ? "material-icons help-tooltip" : "hidden"} style={{left:"50%", marginLeft:"-12px", top:"120px"}}>help</FontIcon>
            :
            null
          }

          <div className="leftDashboard">
            <Deployments loadingActive={!this.state.doneActiveDepsLoading} loadingRecent={!this.state.donePastDepsLoading} clickHandle={this._handleClick} progress={this.state.progress} recent={this.state.recent} />
          </div>
        </div>
        <Snackbar
          open={this.state.snackbar.open}
          message={this.state.snackbar.message}
          autoHideDuration={8000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
});

Dashboard.contextTypes = {
  router: React.PropTypes.object
};
 
module.exports = Dashboard;