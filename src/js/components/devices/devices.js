import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

var createReactClass = require('create-react-class');
var AcceptedDevices = require('./accepted-devices');
var PendingDevices = require('./pending-devices');


var AppStore = require('../../stores/app-store');
var AppActions = require('../../actions/app-actions');


import { Router, Route, Link } from 'react-router';

import { Tabs, Tab } from 'material-ui/Tabs';


var Devices = createReactClass({
	getInitialState() {
		return {
			tabIndex: this._updateActive(),
			acceptedCount: AppStore.getTotalAcceptedDevices(),
			pendingCount: AppStore.getTotalPendingDevices(),
		};
	},

	componentWillMount: function() {
    	AppStore.changeListener(this._onChange);
  	},

  	_onChange: function() {
    	this.setState(this.getInitialState());
  	},


  	componentDidMount() {
  		this._refreshAll();
  	},

  	componentWillUnmount() {
  		AppStore.removeChangeListener(this._onChange);
  	},

  	_refreshAll: function() {
  		this._getAcceptedCount();
  	},




  	/*
  	* Get counts of devices
  	*/
  	_getAcceptedCount: function() {
  		var self = this;
  		var callback = {
  			success: function(count) {
  				self.setState(acceptedCount: count);
  			},
  			error: function(error) {

  			}
  		};
  		AppActions.getDeviceCount(callback, "accepted");
  	},
  	_getPendingCount: function() {
  		var self = this;
  		var callback = {
  			success: function(count) {
  				self.setState(pendingCount: count);
  			},
  			error: function(error) {

  			}
  		};
  		AppActions.getDeviceCount(callback, "pending");
  	},



	// nested tabs
  	componentWillReceiveProps: function(nextProps) {
    	this.setState({tabIndex: this._updateActive()});
  	},

  	_updateActive: function() {
	    var self = this;
	    return this.context.router.isActive({ pathname: '/devices' }, true) ? '/devices/accepted' :
	      this.context.router.isActive('/devices/accepted') ? '/devices/accepted' :
	      this.context.router.isActive('/devices/pending') ? '/devices/pending' : '/devices/accepted';
	},
	
	_handleTabActive: function(tab) {
	    this.context.router.push(tab.props.value);
	},



	render: function() {
		// nested tabs
	    var tabHandler = this._handleTabActive;
	    var style = {
	      tabStyle : {
	        display:"block",
	        width:"100%",
	        color: "rgba(0, 0, 0, 0.8)",
	        textTransform: "none"
	      }
	    };

	    var pendingLabel = this.state.pendingCount ? "Pending (" + this.state.pendingCount + ")" : "Pending";

		return (
			<div className="contentContainer" style={{marginTop: "10px"}}>

		        <Tabs
		          value={this.state.tabIndex}
		          onChange={this.changeTab}
		          tabItemContainerStyle={{background: "none", width:"280px"}}>

		          	<Tab
			            label="Accepted"
			            value="/devices/accepted"
			            onActive={tabHandler}
			            style={style.tabStyle}>

							<AcceptedDevices />
					</Tab>
					<Tab
			            label={pendingLabel}
			            value="/devices/pending"
			            onActive={tabHandler}
			            style={style.tabStyle}>

							<PendingDevices />
					</Tab>
				</Tabs>

			</div>

		);
	}

});

Devices.contextTypes = {
  router: PropTypes.object
};


module.exports = Devices;