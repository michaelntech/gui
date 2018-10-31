import React from 'react';
var createReactClass = require('create-react-class');

import { formatTime, preformatWithRequestID, formatPublicKey  } from '../../helpers.js';
import Time from 'react-time';
import Collapse from 'react-collapse';

var mui = require('material-ui');
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

var AuthsetList = createReactClass({

	getInitialState() {
		return {
			divHeight: 208,
		};
	},

	_adjustCellHeight: function(height) {
    this.setState({divHeight: height+95});
  },

	setConfirmStatus: function(authset, newStatus, index) {
		this.setState({expandRow: index, newStatus: newStatus, showKey: null});
	},

	showKey: function(index) {
		this.setState({showKey: index, expandRow: null});
	},

	render: function() {
		var self = this;
		var list = this.props.authsets.map(function(authset, index) {

			var expanded = '';
			if ( self.state.expandRow === index ) {
        expanded = <div className="expand-confirm">
        						<div className="float-right">
	        						<p className="bold margin-right-large padding-right">Are you sure you want to {self.state.newStatus} this authset?</p>
	        						<div className="float-right">
	        							<FlatButton style={{marginRight: "10px"}} onClick={self.setConfirmStatus.bind(null, null, null, null)}>Cancel</FlatButton>
	        							<RaisedButton><span className="capitalized">{self.state.newStatus}</span></RaisedButton>
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

			var key = self.state.showKey === index ? 
				(
					<Collapse springConfig={{stiffness: 210, damping: 20}} onHeightReady={self._adjustCellHeight} className="expanded" isOpened={true} style={{whiteSpace: "normal"}}>
            {authset.pubkey} <a onClick={self.showKey} className="margin-left-small">show less</a>
        	</Collapse>
        )
        : <span>{formatPublicKey(authset.pubkey)} <a onClick={self.showKey.bind(null, index)} className="margin-left-small">show all</a></span>;


			return (
        <TableRow style={self.props.active ? {"backgroundColor": "#e9f4f3"} : {}} className={expanded ? "expand" : null} key={index}>
          <TableRowColumn style={expanded ? {height: self.state.divHeight} : null}><Time value={formatTime(authset.ts)} format="YYYY-MM-DD HH:mm" /></TableRowColumn>
          <TableRowColumn style={self.state.showKey === index ? {whiteSpace: "normal", width: "400px"} : {width: "400px"}} className={self.state.showKey===index ? "break-word" : "" }>{key}</TableRowColumn>
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

		return (
			<Table fixedHeader={false}
        selectable={false}>
        <TableHeader
          displaySelectAll={false}
          adjustForCheckbox={false}
          style={this.props.hideHeader ? {display:"none"} : {}}>
          <TableRow>
            <TableHeaderColumn>Request time</TableHeaderColumn>
            <TableHeaderColumn style={{width: "400px"}}>Public key</TableHeaderColumn>
            <TableHeaderColumn>Status</TableHeaderColumn>
            <TableHeaderColumn>Actions</TableHeaderColumn>
            <TableHeaderColumn className="columnHeader" style={{width:"0px", paddingRight:"0", paddingLeft:"0"}}></TableHeaderColumn>
          </TableRow>
        </TableHeader>
        <TableBody
          displayRowCheckbox={false}>
          {list}
        </TableBody>
      </Table>
		)
	}

});

module.exports = AuthsetList;