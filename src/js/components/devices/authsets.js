import React from 'react';
var createReactClass = require('create-react-class');

import Time from 'react-time';
var AppActions = require('../../actions/app-actions');
import { formatTime } from '../../helpers.js';
import Collapse from 'react-collapse';

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
			inactive: [],
			divHeight: 208,
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

	_adjustCellHeight: function(height) {
    this.setState({divHeight: height+95});
  },

	updateAuthset: function(authset, newStatus) {
		console.log("Updating authset to " + newStatus);
	},

	deleteAuthset: function(authset) {
		console.log("dismissing! If this is only one, close dialog?");
	},

	setConfirmDismiss: function(authset, index) {

	},

	setConfirmStatus: function(authset, newStatus, index) {
		this.setState({expandRow: index, newStatus: newStatus});
	},
	
	render: function() {
		var self = this;
		var activeList = this.state.active.map(function(authset, index) {

			var expanded = '';
			if ( self.state.expandRow === index ) {
        expanded = <div className="expand-confirm">
        						<div className="float-right">
	        						<p className="bold margin-right-large padding-right">Are you sure you want to {self.state.newStatus} this authset?</p>
	        						<div className="float-right">
	        							<FlatButton className="margin-right-small" onClick={self.setConfirmStatus.bind(null, null, null, null)}>Cancel</FlatButton>
	        							<FlatButton><span className="capitalized">{self.state.newStatus}</span></FlatButton>
	        						</div>
	        					</div>
	        				</div>
      }

			var actionButtons = expanded ? "Confirm " + self.state.newStatus +"?" : (
				<div className="actionButtons">
					{((authset.status !== "accepted") && (authset.status !== "preauthorized")) ? <a onClick={self.setConfirmStatus.bind(null, authset, "accept", index)}>Accept</a> : <span className="bold muted">Accept</span> }
					{authset.status !== "rejected" ? <a onClick={self.setConfirmStatus.bind(null, authset, "reject", index)}>Reject</a> : <span className="bold muted">Reject</span> }
					{authset.status !== "preauthorized" ? <a onClick={self.setConfirmStatus.bind(null, authset, "dismiss", index)}>Dismiss</a> : <span className="bold muted">Dismiss</span> }
				</div>
			);
			return (
        <TableRow style={{"backgroundColor": "#e9f4f3"}} className={expanded ? "expand" : null} key={index}>
          <TableRowColumn style={expanded ? {height: self.state.divHeight} : null}><Time value={formatTime(authset.ts)} format="YYYY-MM-DD HH:mm" /></TableRowColumn>
          <TableRowColumn style={{width: "450px"}}>{authset.pubkey}</TableRowColumn>
       		<TableRowColumn className="capitalized">{authset.status}</TableRowColumn>
          <TableRowColumn>
          	{actionButtons}
          </TableRowColumn>
          <TableRowColumn style={{width:"0", padding:"0", overflow:"visible"}}>
            <Collapse springConfig={{stiffness: 210, damping: 20}} onHeightReady={self._adjustCellHeight} className="expanded" isOpened={expanded ? true : false}>
              {expanded}
            </Collapse>
          </TableRowColumn>
        </TableRow>
      )
		});

		var inactiveList = this.state.inactive.map(function(authset, index) {
			var actionButtons = (
				<div className="actionButtons">
					{(authset.status !== "accepted") && (authset.status !== "preauthorized") ? <a onClick={self.setConfirmStatus.bind(null, authset, "accept", index)}>Accept</a> : <span className="bold muted">Accept</span> }
					{authset.status !== "rejected" ? <a onClick={self.setConfirmStatus.bind(null, authset, "reject", index)}>Reject</a> : <span className="bold muted">Reject</span> }
					{authset.status !== "preauthorized" ? <a onClick={self.setConfirmStatus.bind(null, authset, "dismiss", index)}>Dismiss</a> : <span className="bold muted">Dismiss</span> }
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
      	<div className="margin-bottom-small">{this.props.id_attribute || "Device ID"}: {this.props.id_value}</div>

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
		            <TableHeaderColumn className="columnHeader" style={{width:"0px", paddingRight:"0", paddingLeft:"0"}}></TableHeaderColumn>
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