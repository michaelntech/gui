import React from 'react';
import PropTypes from 'prop-types';

// material ui
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';

var createReactClass = require('create-react-class');

var DemoArtifacts =  createReactClass({
 	_changePage: function(path) {
 		this.props.changePage(path);
 	},
	render: function() {
		var version = "1.2.1";
		var links = {};
		 if (!this.props.isEmpty(this.props.links)) {

		 	for (var k in this.props.links.links) {
		 		console.log("k " +k);
		 		links[k] = [];
		 		var tmpLinks = this.props.links.links[k][version] || this.props.links.links[k]["master"];
		 		for (var tmp in tmpLinks) {
		 			if (tmp.indexOf('mender.gz') != -1) {
		 				links[k].push({name:tmp, url:tmpLinks[tmp]});
		 			}
		 		}
		 	}
	    }

	    return (
	        <div>
	        	<h2>Download demo Artifacts</h2>

	         	<p>We provide demo Artifacts that you can use with devices connected to the Mender server (see <a onClick={this._changePage.bind(null, "help/connecting-devices/provision-a-demo")}>Provision demo device</a>).</p>
				<p>Two Artifacts are provided for each device type so that you can do several deployments (Mender will skip deployments if the Artifact installed is the same as the one being deployed).</p>

				<p>Download the Artifacts for your desired device types below:</p>

				{ !this.props.isEmpty(this.props.links) ?
				<Table
					selectable={false}>
				<TableHeader adjustForCheckbox={false}
					displaySelectAll={false}>
					<TableRow>
					<TableHeaderColumn>Device type</TableHeaderColumn>
					<TableHeaderColumn>Release 1</TableHeaderColumn>
					<TableHeaderColumn>Release 2</TableHeaderColumn>
					</TableRow>
				</TableHeader>
				<TableBody displayRowCheckbox={false}>
					<TableRow>
						<TableRowColumn>Virtual device</TableRowColumn>
						<TableRowColumn><a href="{links['vexpress'][0].href}">{links['vexpress'][0].name}</a></TableRowColumn>
						<TableRowColumn><a href="{links['vexpress'][1].href}">{links['vexpress'][1].name}</a></TableRowColumn>
					</TableRow>
					<TableRow>
						<TableRowColumn>Raspberry Pi 3</TableRowColumn>
						<TableRowColumn><a href="{links['raspberrypi3'][0].href}">{links['raspberrypi3'][0].name}</a></TableRowColumn>
						<TableRowColumn><a href="{links['raspberrypi3'][1].href}">{links['raspberrypi3'][1].name}</a></TableRowColumn>
					</TableRow>
					<TableRow>
						<TableRowColumn>BeagleBone Black</TableRowColumn>
						<TableRowColumn><a href="{links['beaglebone'][0].href}">{links['beaglebone'][0].name}</a></TableRowColumn>
						<TableRowColumn><a href="{links['beaglebone'][1].href}">{links['beaglebone'][1].name}</a></TableRowColumn>
					</TableRow>
				</TableBody>

				</Table> : null}

				<p>Then upload them to the <a onClick={this._changePage.bind(null, "artifacts")}>Artifacts tab</a>.</p>
	        </div>
	    )
	}
});


module.exports = DemoArtifacts;



