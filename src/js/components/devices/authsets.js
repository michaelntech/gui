import React from 'react';
var createReactClass = require('create-react-class');

import Time from 'react-time';
var AppActions = require('../../actions/app-actions');
import { formatTime } from '../../helpers.js';

// material ui
var mui = require('material-ui');
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

var Authsets = createReactClass({
	getInitialState() {
		return {
			active: [],
			inactive: []
		};
	},

	componentDidMount() {
		console.log(this.props.device);
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
	},

	deleteAuthset: function(authset) {
		console.log("dismissing! If this is only one, close dialog?");
	},
	
	render: function() {
		var self = this;
		var activeList = this.state.active.map(function(authset, index) {
			var actionButtons = (
				<div className="actionButtons">
					{authset.status !== "accepted" ? <a onClick={self.updateAuthset.bind(null, authset, "accept")}>Accept</a> : <span className="bold muted">Accept</span> }
					{authset.status !== "rejected" ? <a onClick={self.updateAuthset.bind(null, authset, "reject")}>Reject</a> : <span className="bold muted">Reject</span> }
					<a onClick={self.deleteAuthset.bind(null, authset)}>Dismiss</a>
				</div>
			);
			return (
        <TableRow style={{"backgroundColor": "#e9f4f3"}} key={index}>
          <TableRowColumn><Time value={formatTime(authset.ts)} format="YYYY-MM-DD HH:mm" /></TableRowColumn>
          <TableRowColumn style={{width: "450px"}}>{authset.pubkey}</TableRowColumn>
       		<TableRowColumn className="capitalized">{authset.status}</TableRowColumn>
          <TableRowColumn>{actionButtons}</TableRowColumn>
        </TableRow>
      )
		});

		var inactiveList = this.state.inactive.map(function(authset, index) {
			var actionButtons = (
				<div className="actionButtons">
					{authset.status !== "accepted" ? <a onClick={self.updateAuthset.bind(null, authset, "accept")}>Accept</a> : <span className="bold muted">Accept</span> }
					{authset.status !== "rejected" ? <a onClick={self.updateAuthset.bind(null, authset, "reject")}>Reject</a> : <span className="bold muted">Reject</span> }
					<a onClick={self.deleteAuthset.bind(null, authset)}>Dismiss</a>
				</div>
			);
			return (
        <TableRow key={index}>
          <TableRowColumn><Time value={formatTime(authset.ts)} format="YYYY-MM-DD HH:mm" /></TableRowColumn>
          <TableRowColumn style={{width: "450px"}}>{authset.pubkey}</TableRowColumn>
       		<TableRowColumn className="capitalized">{authset.status}</TableRowColumn>
          <TableRowColumn>{actionButtons}</TableRowColumn>
        </TableRow>
      )
		});
		return (
      <div style={{minWidth:"900px"}}>
      	<div className="margin-bottom-small">For {this.props.id_attribute || "Device ID"}: {this.props.id_value}</div>

	      {this.state.active.length ?
		      <Table fixedHeader={false}
		        selectable={false}>
		        <TableHeader
		          displaySelectAll={false}
		          adjustForCheckbox={false}>
		          <TableRow>
		            <TableHeaderColumn>Request time</TableHeaderColumn>
		            <TableHeaderColumn style={{width: "450px"}}>Public key</TableHeaderColumn>
		            <TableHeaderColumn>Status</TableHeaderColumn>
		            <TableHeaderColumn>Actions</TableHeaderColumn>
		          </TableRow>
		        </TableHeader>
		        <TableBody
		          displayRowCheckbox={false}>
		          {activeList}
		        </TableBody>
		      </Table>
		    : null }

		    <div className="margin-top-large margin-bottom auto"></div>

		    {this.state.inactive.length ?
		    	<div>
		    	<h4 className="align-center">Inactive sets</h4>
		      <Table fixedHeader={false}
		        selectable={false}>
		        <TableHeader
		          displaySelectAll={false}
		          adjustForCheckbox={false}
		          style={this.state.active.length ? {display:"none"} : {}}>
		          <TableRow>
		            <TableHeaderColumn>Request time</TableHeaderColumn>
		            <TableHeaderColumn style={{width: "450px"}}>Public key</TableHeaderColumn>
		            <TableHeaderColumn>Status</TableHeaderColumn>
		            <TableHeaderColumn>Actions</TableHeaderColumn>
		          </TableRow>
		        </TableHeader>
		        <TableBody
		          displayRowCheckbox={false}>
		          {inactiveList}
		        </TableBody>
		      </Table>
		      </div>
		    : null }

      </div>
    )
	}
});

module.exports = Authsets;