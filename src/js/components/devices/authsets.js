import React from 'react';
var createReactClass = require('create-react-class');

var AppActions = require('../../actions/app-actions');
var Authsetlist = require('./authsetlist');
import { preformatWithRequestID } from '../../helpers.js';

// material ui
var mui = require('material-ui');
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/RaisedButton';


var Authsets = createReactClass({
	getInitialState() {
		return {
			active: [],
			inactive: [],
		};
	},

	componentDidMount() {
		this._getActiveAuthsets(this.props.device.auth_sets);
	},

	_getActiveAuthsets: function(authsets) {
		// for each authset compare the device status and if it matches authset status, put it in correct listv
		var self = this;
		var active = [], inactive = [];
		for (var i=0;i<authsets.length; i++) {
			if (authsets[i].status === self.props.device.status) {
				active.push(authsets[i]);
			} else {
				inactive.push(authsets[i]);
			}
		}
		self.setState({active: active, inactive: inactive});
	},


	updateAuthset: function(authset, newStatus) {
		console.log("Updating authset to " + newStatus);
		this.setState({loading: authset.id});
		// on finish, change "loading" back to null
		if (newStatus==="dismiss") {
			this.deleteAuthset(authset);
		} else {
			// call API to update authset
			// refresh - call appactions or send up to parent?
		}

	},

	deleteAuthset: function(authset) {
		console.log("dismissing! If this is only one, close dialog?");
		// call API to dismiss authset
		// refresh or if only authset, call parent to close dialog and refresh devices
	},
	
	render: function() {
		var self = this;
		var activeList = <Authsetlist confirm={this.updateAuthset} loading={this.state.loading} device={this.props.device} active={true} authsets={this.state.active} />
		var inactiveList = <Authsetlist confirm={this.updateAuthset} loading={this.state.loading} device={this.props.device} hideHeader={this.state.active.length} authsets={this.state.inactive} />

		return (
      <div style={{minWidth:"900px"}}>
      	<div className="margin-bottom-small" style={{fontSize: "15px"}}>{this.props.id_attribute || "Device ID"}: {this.props.id_value}</div>

	      {this.state.active.length ? activeList : null }

		    <div className="margin-top-large margin-bottom auto"></div>

		    {this.state.inactive.length ?
		    	<div>
		    		<h4 className="align-center">Inactive authentication sets</h4>
		       {inactiveList}
		      </div>
		    : null }

      </div>
    )
	}
});

module.exports = Authsets;