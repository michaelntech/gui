import React from 'react';
import PropTypes from 'prop-types';
import ReactTooltip from 'react-tooltip';

var createReactClass = require('create-react-class');
var DeviceGroups = require('./device-groups');
var PendingDevices = require('./pending-devices');
var pluralize = require('pluralize');


var AppStore = require('../../stores/app-store');
var AppActions = require('../../actions/app-actions');


import { Router, Route, Link } from 'react-router';

import { Tabs, Tab } from 'material-ui/Tabs';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';


var Devices = createReactClass({
	getInitialState() {
		return {
			tabIndex: this._updateActive(),
			acceptedCount: AppStore.getTotalAcceptedDevices(),
			rejectedCount: AppStore.getTotalRejectedDevices(),
			pendingCount: AppStore.getTotalPendingDevices(),
			snackbar: AppStore.getSnackbar(),
			deviceToReject: {},
      		rejectDialog: false,
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
  		this._getRejectedCount();
  		this._getPendingCount();
  	},




  	/*
  	* Get counts of devices
  	*/
  	_getAcceptedCount: function() {
  		var self = this;
  		var callback = {
  			success: function(count) {
  				self.setState({acceptedCount: count});
  			},
  			error: function(error) {

  			}
  		};
  		AppActions.getDeviceCount(callback, "accepted");
  	},
  	_getRejectedCount: function() {
  		var self = this;
  		var callback = {
  			success: function(count) {
  				self.setState({rejectedCount: count});
  			},
  			error: function(error) {

  			}
  		};
  		AppActions.getDeviceCount(callback, "rejected");
  	},
  	_getPendingCount: function() {
  		var self = this;
  		var callback = {
  			success: function(count) {
  				self.setState({pendingCount: count});
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
	    return this.context.router.isActive({ pathname: '/devices' }, true) ? '/devices/groups' :
	      this.context.router.isActive('/devices/groups') ? '/devices/groups' :
	      this.context.router.isActive('/devices/pending') ? '/devices/pending' : '/devices/groups';
	},
	
	_handleTabActive: function(tab) {
		AppActions.setSnackbar("");
		this.setState({currentTab: tab.props.label});
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
	          // self.setState({pauseAdmisson: false});
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
	      AppActions.acceptDevice(device.id, singleCallback);
	    });
	},

	_handleRejectDevice: function(device) {
		var self = this;
		this.setState({deviceToReject: device}, function() {
			self._rejectDevice();
		})
	},

	_rejectDevice: function() {
	    var self = this;

	   	//self.setState({pauseAdmisson: true});
	    // self._pauseTimers(true); // pause periodic calls to device apis until finished authing devices

	    var callback = {
	      success: function(data) {
	        AppActions.setSnackbar("Device was rejected successfully");
	        self._refreshAll();
	        // self.setState({pauseAdmisson: false});
	        // if (device.status==="accepted") { self._setDeviceDetails(self.state.blockDevice) }
	      },
	      error: function(err) {
	        var errMsg = err.res.body.error || "";
	        // self.setState({pauseAdmisson: false});
	        AppActions.setSnackbar(preformatWithRequestID(err.res, "There was a problem rejecting the device: "+errMsg));
	      }
	    };

	    AppActions.rejectDevice(self.state.deviceToReject.id, callback);
	},

	_decommissionDevice: function() {
		 var self = this;

	   	//self.setState({pauseAdmisson: true});
	    // self._pauseTimers(true); // pause periodic calls to device apis until finished authing devices

	    var callback = {
	      success: function(data) {
	        AppActions.setSnackbar("Device was decommissioned successfully");
	        self._refreshAll();
	        // self.setState({pauseAdmisson: false});
	        // if (device.status==="accepted") { self._setDeviceDetails(self.state.blockDevice) }
	      },
	      error: function(err) {
	        var errMsg = err.res.body.error || "";
	        // self.setState({pauseAdmisson: false});
	        AppActions.setSnackbar(preformatWithRequestID(err.res, "There was a problem decommissioning the device: "+errMsg));
	      }
	    };
	    AppActions.decommissionDevice(self.state.deviceToReject.device_id, callback);
	},

	dialogToggle: function (ref) {
	    var state = {};
	    state[ref] = !this.state[ref];
	    //this.props.pauseRefresh(state[ref]);
	    this.setState(state);
	},

	_openRejectDialog: function(device, status) {
	    device.status = status;
	    this.setState({rejectDialog: true, deviceToReject: device});
	},


	render: function() {
		// nested tabs
	    var tabHandler = this._handleTabActive;
	    var styles = {
	      tabStyle : {
	        display:"block",
	        width:"100%",
	        color: "rgba(0, 0, 0, 0.8)",
	        textTransform: "none"
	      },
	      listStyle: {
	        fontSize: "12px",
	        paddingTop: "10px",
	        paddingBottom: "10px",
	      },
	      listButtonStyle: {
	      	fontSize: "12px",
	      	marginTop: "-10px",
	      	paddingRight: "12px",
	      	marginLeft: "0px",
	      },
	    };

        var rejectActions =  [
	      <div style={{marginRight:"10px", display:"inline-block"}}>
	        <FlatButton
	          label="Cancel"
	          onClick={this.dialogToggle.bind(null, "rejectDialog")} />
	      </div>
	    ];

	    var pendingLabel = this.state.pendingCount ? "Pending (" + this.state.pendingCount + ")" : "Pending";

		return (
			<div className="contentContainer" style={{marginTop: "10px"}}>

		        <Tabs
		          value={this.state.tabIndex}
		          onChange={this.changeTab}
		          tabItemContainerStyle={{background: "none", width:"280px"}}>

		          	<Tab
			            label="Device groups"
			            value="/devices/groups"
			            onActive={tabHandler}
			            style={styles.tabStyle}>

							<DeviceGroups rejectOrDecomm={this._openRejectDialog} styles={styles} rejectedDevices={this.state.rejectedCount} acceptedDevices={this.state.acceptedCount} currentTab={this.state.currentTab} snackbar={this.state.snackbar} rejectDevice={this._rejectDevice} />
					</Tab>
					<Tab
			            label={pendingLabel}
			            value="/devices/pending"
			            onActive={tabHandler}
			            style={styles.tabStyle}>

							<PendingDevices styles={styles} currentTab={this.state.currentTab} snackbar={this.state.snackbar} disabled={this.state.pauseAdmisson} authorizeDevices={this._authorizeDevices} count={this.state.pendingCount} rejectDevice={this._handleRejectDevice} />
					</Tab>
				</Tabs>

				 <Dialog
		          ref="rejectDialog"
		          open={this.state.rejectDialog}
		          title={this.state.deviceToReject.status!=="rejected" ? 'Reject or decommission device?' : "Authorize or decommission device?"}
		          actions={rejectActions}
		          autoDetectWindowHeight={true}
		          bodyStyle={{paddingTop:"0", fontSize:"13px"}}
		          contentStyle={{overflow:"hidden", boxShadow:"0 14px 45px rgba(0, 0, 0, 0.25), 0 10px 18px rgba(0, 0, 0, 0.22)"}}
		          >
		          {this.state.deviceToReject ? <ListItem className="margin-bottom-small" style={styles.listStyle} disabled={true} primaryText="Device ID" secondaryText={this.state.deviceToReject.device_id}  />: null}
		          {this.state.deviceToReject.status==="accepted" ?
		            <div className="split-dialog">
		              <div className="align-center">
		                <div>
		                  <FontIcon className="material-icons" style={{marginTop:6, marginBottom:6, marginRight:6, verticalAlign: "middle", color:"#c7c7c7"}}>cancel</FontIcon>
		                  <h3 className="inline align-middle">Reject</h3>
		                </div>
		                <p>
		                  De-authorize this device and block it from making authorization requests in the future.
		                </p>
		                <RaisedButton onClick={this._rejectDevice} className="margin-top-small" secondary={true} label={"Reject device"} icon={<FontIcon style={{marginTop:"-4px"}} className="material-icons">cancel</FontIcon>} />
		              </div>
		            </div> 
		          : 
		          	<div className="split-dialog">
		              	<div className="align-center">
			                <div>
			                  <FontIcon className="material-icons" style={{marginTop:6, marginBottom:6, marginRight:6, verticalAlign: "middle", color:"#c7c7c7"}}>check_circle</FontIcon>
			                  <h3 className="inline align-middle">Authorize</h3>
			                </div>
			                <p>
			                 	Authorize this device and allow it to connect to the server.
			                </p>
			                <RaisedButton onClick={this._authorizeDevice} className="margin-top-small" secondary={true} label={"Authorize device"} icon={<FontIcon style={{marginTop:"-4px"}} className="material-icons">check_circle</FontIcon>} />
			              </div>
		            </div>
		          }

		          <div className="split-dialog left-border">
		            <div className="align-center">
		              <div>
		                <FontIcon className="material-icons" style={{marginTop:6, marginBottom:6, marginRight:6, verticalAlign: "middle", color:"#c7c7c7"}}>delete_forever</FontIcon>
		                <h3 className="inline align-middle">Decommission</h3>
		              </div>
		              <p>
		                Decommission this device and remove all device data. This action is not reversible.
		              </p>
		              <RaisedButton onClick={this._decommissionDevice} className="margin-top-small" secondary={true} label={"Decommission device"} icon={<FontIcon style={{marginTop:"-4px"}} className="material-icons">delete_forever</FontIcon>} />
		            </div>
		          </div>
		        </Dialog>


			</div>

		);
	}

});

Devices.contextTypes = {
  router: PropTypes.object
};


module.exports = Devices;