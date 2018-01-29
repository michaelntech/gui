import React from 'react';
var createReactClass = require('create-react-class');

var Groups = require('./groups');
var GroupSelector = require('./groupselector');
var CreateGroup = require('./create-group');
var DeviceList = require('./devicelist');
var Filters = require('./filters');
var Loader = require('../common/loader');
var pluralize = require('pluralize');

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
		};
	},

	componentDidMount() {
		// Get groups
		this._refreshGroups();
	},


	componentDidUpdate: function(prevProps, prevState) {
	    if (prevState.selectedGroup !== this.state.selectedGroup) {
	      //clearInterval(this.deviceTimer);
	      this._refreshGroups();
	      //this.deviceTimer = setInterval(this._refreshDevices, this.state.refreshDeviceLength);
	    }
	 },

	_handleGroupsChange: function(group) {
	    AppActions.selectGroup(group);
	    this.setState({doneLoading:false, selectedGroup:group});
	    this._refreshGroups();
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

	_handleGroupChange: function(group) {
		console.log("changeGroup");
	},

	_toggleDialog: function(ref) {
		var state = {};
    	state[ref] = !this.state[ref];
    	this.setState(state);
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
                	<DeviceList rejectOrDecomm={this.props.rejectOrDecomm} currentTab={this.props.currentTab} groupCount={this.props.acceptedDevices} acceptedDevices={this.props.acceptedDevices} rejectedDevices={this.props.rejectedDevices} styles={this.props.styles} group={this.state.selectedGroup} devices={this.state.devices} />
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