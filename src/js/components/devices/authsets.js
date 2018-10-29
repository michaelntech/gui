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
	
	render: function() {

		var activeList = this.state.active.map(function(authset, index) {
			return (
        <TableRow style={{"backgroundColor": "#e9f4f3"}} key={index}>
          <TableRowColumn ><Time value={formatTime(authset.ts)} format="YYYY-MM-DD HH:mm" /></TableRowColumn>
          <TableRowColumn style={{width: "450px"}}>{authset.pubkey}</TableRowColumn>
       		<TableRowColumn className="capitalized">{authset.status}</TableRowColumn>
          <TableRowColumn >Action buttons</TableRowColumn>
        </TableRow>
      )
		});

		var inactiveList = this.state.inactive.map(function(authset, index) {
			return (
        <TableRow key={index}>
          <TableRowColumn ><Time value={formatTime(authset.ts)} format="YYYY-MM-DD HH:mm" /></TableRowColumn>
          <TableRowColumn style={{width: "450px"}}>{authset.pubkey}</TableRowColumn>
       		<TableRowColumn className="capitalized">{authset.status}</TableRowColumn>
          <TableRowColumn >Action buttons</TableRowColumn>
        </TableRow>
      )
		});
		return (
      <div style={{minWidth:"900px"}}>
      	{this.props.id_attribute || "Device ID"}: {this.props.id_value}

	      {this.state.active.length ?
		      <Table fixedHeader={false}
		        selectable={false}>
		        <TableHeader
		          displaySelectAll={false}
		          adjustForCheckbox={false}>
		          <TableRow>
		            <TableHeaderColumn >Request time</TableHeaderColumn>
		            <TableHeaderColumn style={{width: "450px"}}>Public key</TableHeaderColumn>
		            <TableHeaderColumn >Status</TableHeaderColumn>
		            <TableHeaderColumn >Actions</TableHeaderColumn>
		          </TableRow>
		        </TableHeader>
		        <TableBody
		          displayRowCheckbox={false}>
		          {activeList}
		        </TableBody>
		      </Table>
		    : null }

		    <div style={{width:"200px"}} className="margin-top margin-bottom auto"><Divider/></div>

		    {this.state.inactive.length ?
		      <Table fixedHeader={false}
		        selectable={false}>
		        <TableHeader
		          displaySelectAll={false}
		          adjustForCheckbox={false}
		          style={this.state.active.length ? {display:"none"} : {}}>
		          <TableRow>
		            <TableHeaderColumn >Request time</TableHeaderColumn>
		            <TableHeaderColumn style={{width: "450px"}}>Public key</TableHeaderColumn>
		            <TableHeaderColumn >Status</TableHeaderColumn>
		            <TableHeaderColumn >Actions</TableHeaderColumn>
		          </TableRow>
		        </TableHeader>
		        <TableBody
		          displayRowCheckbox={false}>
		          {inactiveList}
		        </TableBody>
		      </Table>
		    : null }

      </div>
    )
	}
});

module.exports = Authsets;