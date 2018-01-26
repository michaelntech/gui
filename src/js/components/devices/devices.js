import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

var createReactClass = require('create-react-class');
var AcceptedDevices = require('./accepted-devices');
var PendingDevices = require('./pending-devices');
var pluralize = require('pluralize');


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
			snackbar: AppStore.getSnackbar(),
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
  		this._getPendingCount();
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
  				AppActions.setSnackbar("");
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
		AppActions.setSnackbar("");
	    this.context.router.push(tab.props.value);
	},


	// authorize devices
	_authorizeDevices: function(devices) {
	    /*
	    * function for authorizing group of devices via devadmn API
	    */
	    var self = this;
	    self.setState({pauseAdmisson: true});

	    // make into chunks of 5 devices
	    var arrays = [], size = 5;
	    var deviceList = devices.slice();
	    while (deviceList.length > 0) {
	      arrays.push(deviceList.splice(0, size));
	    }

	    var i = 0;
	    var success = 0;
	    var loopArrays = function(arr) {
	      // for each chunk, authorize one by one
	      self._authorizeBatch(arr[i], function(num) {
	        success = success+num;
	        i++;
	        if (i < arr.length) {
	          loopArrays(arr);
	        } else {
	          self.setState({pauseAdmisson: false});
	          AppActions.setSnackbar(success + " " + pluralize("devices", success) + " " + pluralize("were", success) + " authorized");
	          // refresh counts
	          self._refreshAll();
	        }
	      });
	    }
	    loopArrays(arrays);
	  },
	  _authorizeBatch(devices, callback) {
	    // authorize the batch of devices one by one, callback when finished
	    var i = 0;
	    var fail = 0;
	    var singleCallback = {
	      success: function(data) {
	        i++;
	        if (i===devices.length) {
	          callback(i);
	        }
	      }.bind(this),
	      error: function(err) {
	        var errMsg = err.res.body.error || ""

	        fail++;
	        i++;

	        AppActions.setSnackbar(preformatWithRequestID(err.res, "There was a problem authorizing the device: "+errMsg));
	        if (i===devices.length) {
	          callback(i-fail);
	        }
	      }
	    };

	    devices.forEach( function(device, index) {
	      AppActions.acceptDevice(device, singleCallback);
	    });
	},

	_rejectDevice: function(device) {
	    var self = this;
	   	self.setState({pauseAdmisson: true});
	    // self._pauseTimers(true); // pause periodic calls to device apis until finished authing devices

	    var callback = {
	      success: function(data) {
	        AppActions.setSnackbar("Device was rejected successfully");
	        self._refreshAll();
	        self.setState({pauseAdmisson: false});
	        // if (device.status==="accepted") { self._setDeviceDetails(self.state.blockDevice) }
	      },
	      error: function(err) {
	        var errMsg = err.res.body.error || "";
	        self.setState({pauseAdmisson: false});
	        AppActions.setSnackbar(preformatWithRequestID(err.res, "There was a problem rejecting the device: "+errMsg));
	      }
	    };

	    // if device **already accepted** use devauth api
	    // otherwise use device admission api
	    if (device.status==="accepted") {
	      AppActions.blockDevice(device, callback);
	    } else {
	      AppActions.rejectDevice(device, callback);
	    }
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

							<AcceptedDevices count={this.state.acceptedCount} />
					</Tab>
					<Tab
			            label={pendingLabel}
			            value="/devices/pending"
			            onActive={tabHandler}
			            style={style.tabStyle}>

							<PendingDevices snackbar={this.state.snackbar} disabled={this.state.pauseAdmisson} authorizeDevices={this._authorizeDevices} count={this.state.pendingCount} rejectDevice={this._rejectDevice} />
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