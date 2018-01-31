import React from 'react';
var createReactClass = require('create-react-class');

var Groups = require('./groups');
var GroupSelector = require('./groupselector');
var CreateGroup = require('./create-group');
var DeviceList = require('./devicelist');
var Filters = require('./filters');
var Loader = require('../common/loader');
var pluralize = require('pluralize');
var Pagination = require('rc-pagination');
var _en_US = require('rc-pagination/lib/locale/en_US');

import { setRetryTimer, clearRetryTimer, clearAllRetryTimers } from '../../utils/retrytimer';

var AppStore = require('../../stores/app-store');
var AppActions = require('../../actions/app-actions');

import { Tabs, Tab } from 'material-ui/Tabs';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

var AcceptedDevices = createReactClass({
	getInitialState() {
		return {
			groups: AppStore.getGroups(),
      		selectedGroup: AppStore.getSelectedGroup(),
      		addGroup: false,
      		groupInvalid: true,
      		filters: AppStore.getFilters(),
      		attributes: AppStore.getAttributes(),
      		snackbar: AppStore.getSnackbar(),
      		createGroupDialog: false,
      		devices: [],
      		pageNo: 1,
      		pageLength: 20,
      		loading: true,
		};
	},

	componentDidMount() {
		// Get groups
		this._refreshGroups();
    	this._getDevices();
	},

	componentDidUpdate: function(prevProps, prevState) {
	    if (prevState.selectedGroup !== this.state.selectedGroup) {
	      //clearInterval(this.deviceTimer);
	      this._refreshGroups();
	      //this.deviceTimer = setInterval(this._refreshDevices, this.state.refreshDeviceLength);
	    }
	},


	 /*
	 * Groups
	 */
	_refreshGroups: function() {
	    var self = this;
	    var groupDevices = {};
	    var callback = {
	      success: function (groups) {
	        self.setState({groups: groups});

	        for (var i=0;i<groups.length;i++) {
	          groupDevices[groups[i]] = 0;
	          setNum(groups[i], i);
	          function setNum(group, idx) {
	            
	            AppActions.getNumberOfDevicesInGroup(function(noDevs) {
	              groupDevices[group] = noDevs;
	              self.setState({groupDevices: groupDevices});
	            }, group);
	          }
	        }

	      },
	      error: function(err) {
	        console.log(err);
	      }
	    };
	    AppActions.getGroups(callback);
	},

	_handleGroupChange: function(group, numDev) {
		var self = this;
		this.setState({selectedGroup: group, groupCount: numDev, pageNo:1}, function() {
			self._getDevices();
		});
	},

	_toggleDialog: function(ref) {
		var state = {};
    	state[ref] = !this.state[ref];
    	this.setState(state);
	},



	/*
	* Devices
	*/ 
	
	_getDevices: function() {
	    var self = this;
	    if (!this.state.selectedGroup) {
	      // no group selected, get all accepted
	      this._getAllAccepted();
	    } else {
	       var callback =  {
	        success: function(devices) {
	          self.setState({devices: devices, loading: false, pageLoading: false});
	        },
	        error: function(error) {
	          console.log(err);
	          var errormsg = err.error || "Please check your connection.";
	          self.setState({loading: false});
	             // setRetryTimer(err, "devices", "Devices couldn't be loaded. " + errormsg, self.state.refreshDeviceLength);
	        }
	      };

	      self.setState({loading: true});
	      AppActions.getDevices(callback, this.state.pageNo, this.state.pageLength, this.state.selectedGroup);
	    }
	},
	  
	_getAllAccepted: function() {
	    var self = this;
	    var callback =  {
	      success: function(devices) {
	        self.setState({devices: devices});
	        if (devices.length) {
	          // for each device get inventory
	          devices.forEach( function(dev, index) {
	            self._getInventoryForDevice(dev, function(device) {
	              devices[index].attributes = device.attributes;
	              devices[index].updated_ts = devices.updated_ts;
	              if (index===devices.length-1) {
	                self.setState({devices:devices, loading: false, pageLoading: false});
	              }
	            });
	          });   

	        } else {
	           self.setState({loading: false});
	        }
	      },
	      error: function(error) {
	        console.log(err);
	        var errormsg = err.error || "Please check your connection.";
	        self.setState({loading: false});
	           // setRetryTimer(err, "devices", "Devices couldn't be loaded. " + errormsg, self.state.refreshDeviceLength);
	      }
	    };

	    self.setState({loading: true});
	    AppActions.getDevicesByStatus(callback, "accepted", this.state.pageNo, this.state.pageLength);
	},


	_getInventoryForDevice: function(device, originCallback) {
	    // get inventory for single device
	    var callback = {
	      success: function(device) {
	        originCallback(device);
	      },
	      error: function(err) {
	        console.log(err);
	        originCallback(null);
	      }
	    };
	    AppActions.getDeviceById(device.device_id, callback);
	},

	_handlePageChange: function(pageNo) {
    	var self = this;
    	self.setState({pageLoading: true, pageNo: pageNo}, () => {self._getDevices()});
  	},


	render: function() {
		// Add to group dialog 
		var addActions = [
	      <div style={{marginRight:"10px", display:"inline-block"}}>
	        <FlatButton
	          label="Cancel"
	          onClick={this._cancelAdd} />
	      </div>,
	      <RaisedButton
	        label="Add to group"
	        primary={true}
	        onClick={this._addToGroupDialog}
	        ref="save" 
	        disabled={this.state.groupInvalid} />
	    ];

	    var groupCount = this.state.groupCount ? this.state.groupCount : this.props.acceptedDevices;

		return (
			<div className="margin-top">
				<Filters attributes={this.state.attributes} filters={this.state.filters} onFilterChange={this._onFilterChange} />
				
				<div className="leftFixed">
                    <Groups
                      openGroupDialog={this._toggleDialog.bind(null, "createGroupDialog")}
                      changeGroup={this._handleGroupChange}
                      groups={this.state.groups}
                      groupDevices={this.state.groupDevices}
                      selectedGroup={this.state.selectedGroup}
                      acceptedDevices={this.props.acceptedDevices}
                      showHelptips={this.state.showHelptips} />
                </div>
                <div className="rightFluid">
                	<DeviceList loading={this.state.loading} rejectOrDecomm={this.props.rejectOrDecomm} currentTab={this.props.currentTab} acceptedDevices={this.props.acceptedDevices} groupCount={groupCount}  styles={this.props.styles} group={this.state.selectedGroup} devices={this.state.devices} />
                	{this.state.devices.length ?
                	<div className="margin-top">
		             	<Pagination locale={_en_US} simple pageSize={this.state.pageLength} current={this.state.pageNo} total={groupCount} onChange={this._handlePageChange} />
		               	{this.state.pageLoading ?  <div className="smallLoaderContainer"><Loader show={true} /></div> : null}
		            </div> : null }
                </div>



		        <Dialog
		          open={this.state.addGroup}
		          title="Add selected devices to group"
		          actions={addActions}
		          autoDetectWindowHeight={true}
		          bodyStyle={{fontSize: "13px"}}>  
		          <GroupSelector numDevices={(this.state.selectedRows||{}).length} willBeEmpty={this.state.willBeEmpty} tmpGroup={this.state.tmpGroup} selectedGroup={this.props.selectedGroup} changeSelect={this.props.changeSelect} validateName={this._validate} groups={this.props.groups} selectedField={this.props.selectedField} />
		        </Dialog>


		        <CreateGroup
		        	ref="createGroupDialog"
		        	toggleDialog={this._toggleDialog}
			        open={this.state.createGroupDialog}
			        groups={this.state.groups}
			        changeGroup={this._handleGroupChange}
		         />

		        <Snackbar
		          open={this.state.snackbar.open}
		          message={this.state.snackbar.message}
		          autoHideDuration={8000}
		        />
			</div>

		);

	}

});

module.exports = AcceptedDevices;