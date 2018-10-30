import React from 'react';
import { Router, Route, Link } from 'react-router';
import Time from 'react-time';
import Collapse from 'react-collapse';
var createReactClass = require('create-react-class');
import ReactTooltip from 'react-tooltip';
import { AuthButton } from '../helptips/helptooltips';
import PropTypes from 'prop-types';

var AppStore = require('../../stores/app-store');
var AppActions = require('../../actions/app-actions');
var ScheduleForm = require('../deployments/scheduleform');
var Authsets = require('./authsets');
var Loader = require('../common/loader');
import cookie from 'react-cookie';
import copy from 'copy-to-clipboard';

import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import Dialog from 'material-ui/Dialog';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

import { preformatWithRequestID } from '../../helpers';

function getGroups() {
  var copy = AppStore.getGroups().slice();
  return copy
}

var ExpandedDevice = createReactClass({
  getInitialState: function() {
    return {
      showInput: false,
      selectedGroup: {
        payload: '',
        text: ''
      },
      schedule: false,
      authsets: false,
      artifacts: AppStore.getArtifactsRepo(),
      user: AppStore.getCurrentUser(),
    };
  },

  componentDidMount: function() {
    this._getArtifacts();
  },

  _getArtifacts: function() {
    var self = this;
    var callback = {
      success: function(artifacts) {
        
        setTimeout(function() {
          self.setState({artifacts:artifacts});
        }, 300);
      },
      error: function(err) {
        var errormsg = err.error || "Please check your connection";
      }
    };
    AppActions.getArtifacts(callback);
  },

  dialogToggle: function (ref) {
    var state = {};
    state[ref] = !this.state[ref];
    this.setState(state);
    this.setState({filterByArtifact:null, artifact:null});
  },

  _updateParams: function(val, attr) {
    // updating params from child schedule form
    var tmp = {};
    tmp[attr] = val;
    this.setState(tmp);
  },

  _clickListItem: function() {
    AppActions.setSnackbar("");
    this.dialogToggle('schedule');
  },

  _showAuthsets: function() {
    AppActions.setSnackbar("");
    this.dialogToggle('authsets');
  },

  _onScheduleSubmit: function() {
    var self = this;
    var newDeployment = {
      devices: [this.props.device.device_id],
      name: this.props.device.device_id,
      artifact_name: this.state.artifact.name
    }
    var callback = {
      success: function(data) {
        // get id, if showhelptips & no onboarded cookie, this is user's first deployment - add id cookie
        var lastslashindex = data.lastIndexOf('/');
        var id = data.substring(lastslashindex  + 1);

        // onboarding
        if (self.props.showHelpTips && !cookie.load(self.state.user.id+'-onboarded') && !cookie.load(self.state.user.id+'-deploymentID')) {
          cookie.save(self.state.user.id+'-deploymentID', id);
        }

        AppActions.setSnackbar("Deployment created successfully. Redirecting...", 5000);
        var params = {};
        params.route="deployments";
        setTimeout(function() {
          self.context.router.push(params.route);
        }, 1200)
      },
      error: function(err) {
        try {
          var errMsg = err.res.body.error || ""
          AppActions.setSnackbar(preformatWithRequestID(err.res, "Error creating deployment. " + errMsg), null, "Copy to clipboard");
        } catch (e) {
          console.log(e)
        }
      }
    }
    AppActions.createDeployment(newDeployment, callback);
    this.dialogToggle('schedule');
  },

  _handleStopProp: function(e) {
    e.stopPropagation();
  },

  _deploymentParams: function(val, attr) {
    // updating params from child schedule form
    var tmp = {};
    tmp[attr] = val;
    this.setState(tmp);

    // check that device type matches
    var filteredDevs = null;
    if (attr==='artifact' && val) {
      for (var i = 0; i<val.device_types_compatible.length; i++) {
        if (val.device_types_compatible[i] === this.props.device_type) {
          filteredDevs = [this.props.device];
          break;
        }
      }
    }
    this.setState({filterByArtifact:filteredDevs});
  },
  _clickLink: function() {
    window.location.assign('https://docs.mender.io/'+this.props.docsVersion+'/client-configuration/configuration-file/polling-intervals');
  },
  _copyLinkToClipboard: function() {
    var location = window.location.href.substring(0, window.location.href.indexOf("/devices") + "/devices".length);
    copy(location + "/id=" + this.props.device.device_id);
    AppActions.setSnackbar("Link copied to clipboard");
  },
  render: function() {

    var status = this.props.device.status;

    var deviceIdentity = [];
    deviceIdentity.push(
        <ListItem key="id_checksum" style={this.props.styles.listStyle} disabled={true} primaryText="Device ID" secondaryText={(this.props.device || {}).device_id || ''} secondaryTextLines={2} />
    );

    if ((this.props.device || {}).id_data) {
      var data = typeof this.props.device.id_data == "object" ? this.props.device.id_data : JSON.parse(this.props.device.id_data);
      for (var k in data) {
        deviceIdentity.push(
          <ListItem key={k} style={this.props.styles.listStyle} disabled={true} primaryText={k} secondaryText={ data[k] } />
        );
      };
    }

    if ((this.props.device || {}).request_time) {
      deviceIdentity.push(
        <div key="connectionTime">
          <ListItem style={this.props.styles.listStyle} disabled={true} primaryText={status==="preauthorized" ? "Date added" : "Time of request"} secondaryText={<div><Time value={this.props.device.request_time} format="YYYY-MM-DD HH:mm" /></div>} />
        </div>
      );
    }

    var deviceInventory = [];

    var waiting = false;
    if (typeof this.props.attrs !== 'undefined' && this.props.attrs.length>0) {

      var sortedAttributes = this.props.attrs.sort(function (a, b) {
          return a.name.localeCompare( b.name );
      });
      for (var i=0;i<sortedAttributes.length;i++) {
        var secondaryText = (sortedAttributes[i].value instanceof Array) ? sortedAttributes[i].value.toString() : sortedAttributes[i].value;
        var secondaryTextLines = (sortedAttributes[i].value instanceof Array) || (secondaryText.length>50 ) ? 2 : 1;
        deviceInventory.push(
          <div key={i}>
            <ListItem style={this.props.styles.listStyle} disabled={true} primaryText={sortedAttributes[i].name} secondaryText={secondaryText} secondaryTextLines={secondaryTextLines} />
            <Divider />
          </div>
        );
      };

    } else {
      waiting = true;
      deviceInventory.push(
        <div className="waiting-inventory" key="waiting-inventory">
          <div
            onClick={this._handleStopProp}
            id="inventory-info"
            className="tooltip info"
            style={{top:"8px", right:"8px"}}
            data-tip
            data-for='inventory-wait'
            data-event='click focus'>
            <FontIcon className="material-icons">info</FontIcon>
          </div>
          <ReactTooltip
            id="inventory-wait"
            globalEventOff='click'
            place="top"
            type="light"
            effect="solid"
            className="react-tooltip">
            <h3>Waiting for inventory data</h3>
            <p>Inventory data not yet received from the device - this can take up to 30 minutes with default installation.</p>
            <p>Also see the documentation for <a onClick={this._clickLink} href="https://docs.mender.io/client-configuration/configuration-file/polling-intervals">Polling intervals</a>.</p>
          </ReactTooltip>

          <p>Waiting for inventory data from the device</p>
          <Loader show={true} waiting={true} />
        </div>
      );
    }

    var deviceInventory2 = [];
    if (deviceInventory.length > deviceIdentity.length) {
      deviceInventory2 = deviceInventory.splice((deviceInventory.length/2)+(deviceInventory.length%2),deviceInventory.length);
    }

    var statusIcon = "";
    switch (status) {
      case "accepted":
        statusIcon = (<FontIcon className="material-icons green" style={{margin: "12px 0 12px 12px"}}>check_circle</FontIcon>)
        break;
      case "pending":
        statusIcon = (<div className="pending-icon" style={{margin: "12px 0 12px 12px"}}></div>)
        break;
      case "rejected":
        statusIcon = (<FontIcon className="material-icons red" style={{margin: "12px 0 12px 12px"}}>block</FontIcon>)
        break;
      case "preauthorized":
        statusIcon = (<FontIcon className="material-icons" style={{margin: "12px 0 12px 12px"}}>check</FontIcon>)
        break;
    }

    var formatStatus = (
      <span className="text-color">
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );

    var authLabel = (
      <span style={{fontSize:'14px'}}>
        {status === "pending" ? "Accept, reject or dismiss the device?" :
        status === "accepted" ? "Reject, dismiss or decommission this device?" :
        status === "rejected" ? "Accept, dismiss or decommission this" : "Remove this device from preauthorization?" }
      </span>
    );

    var deviceInfo = (
      <div key="deviceinfo">

        <div id="device-identity" className="report-list bordered">
          <h4 className="margin-bottom-none">Device identity</h4>
          <List className="list-horizontal-display">
            {deviceIdentity}
          </List>

          <List className="block list-horizontal-display">
            <ListItem
              key="statusButton"
              disabled={true}
              style={this.props.styles.listButtonStyle}
              primaryText={"Device status"}
              secondaryText={formatStatus}
              leftIcon={statusIcon} />

            <ListItem
              key="authsetsButton"
              disabled={false}
              style={this.props.styles.listButtonStyle}
              primaryText={authLabel}
              secondaryText={"Click to adjust authorization status for this device"}
              onClick={this._showAuthsets} />
          </List>
        </div>

        <div id="device-inventory">
          <div className={this.props.unauthorized ? "hidden" : "report-list"} >
            <h4 className="margin-bottom-none">Device inventory</h4>
            <List>
              {deviceInventory}
            </List>
          </div>
    

          <div className={this.props.unauthorized ? "hidden" : "report-list"} >
            <List style={{marginTop:"34px"}}>
              {deviceInventory2}
            </List>
          </div>

        </div>

        { (status==="accepted" && !waiting) ? 
          (
            <div id="device-actions" className="report-list">
              <List className="list-horizontal-display" style={{marginTop:"24px"}}>
                <ListItem
                key="copylink"
                style={this.props.styles.iconListButtonStyle}
                primaryText="Copy link to this device"
                onClick={this._copyLinkToClipboard}
                leftIcon={<FontIcon className="material-icons update" style={{margin: "12px 0 12px 12px"}}>link</FontIcon>} />
                <ListItem
                key="updateButton"
                className={status === "accepted" ? null : "hidden"}
                style={this.props.styles.iconListButtonStyle}
                primaryText="Create a deployment for this device"
                onClick={this._clickListItem}
                leftIcon={<FontIcon className="material-icons update" style={{margin: "12px 0 12px 12px"}}>replay</FontIcon>} />
              </List>
            </div>
          ) : null
        }
      
      </div>
    );

    var scheduleActions =  [
      <div style={{marginRight:"10px", display:"inline-block"}}>
        <FlatButton
          label="Cancel"
          onClick={this.dialogToggle.bind(null, 'schedule')} />
      </div>,
      <RaisedButton
        label="Create deployment"
        primary={true}
        disabled={!this.state.filterByArtifact}
        onClick={this._onScheduleSubmit}
        ref="save" />
    ];


    var authsetActions =  [
      <div style={{marginRight:"10px", display:"inline-block"}}>
        <FlatButton
          label="Close"
          onClick={this.dialogToggle.bind(null, 'authsets')} />
      </div>
    ];

    var fakeDevice = {
      "id": "00001",
      "identity_data": {
        "application/json": {
          "mac": "00:01:02:03:04:05",
          "sku": "My Device 1",
          "sn": "SN1234567890"
        }
      },
      "status": "pending",
      "created_ts": "2018-10-29T09:25:31.385Z",
      "updated_ts": "2018-10-29T09:25:31.385Z",
      "auth_sets": [
        {
          "id": "qwertyuiop",
          "pubkey": "-----BEGIN PUBLIC KEY-----↵MIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKCAYEAxOc4fm5poQQk5RinJ0Fi↵dZE1843+yCzPtoV8q4nQkCjoA18/6vntx9Cn6kQKnXesiYN2BrefCWom2Pck8WT3↵DKAznsEKxrHA8N/L6IYTzIR4mkZq0o+8jW1mJR+VqXsvtlBwy0GZgdroRkBDCSVA↵DASF5RVOlslaPhZmS62ggSRd0Uask1zrbwgJOFxZ4u3pqUdhgYfAHJJiqUWYYrf4↵0278zzkls7NYp2mUfBHqYZyWljjUkiS4qB00Pamlv5d2bZaffMIBYfy6IuyTcnnj↵Lfu98BWmS/1aviPm+ET6/iieq6K2f/FNCnxpoC0RrGtoloOJgPMlkf/jReX0qoby↵HiCEwq9rp7uzpxyATIrcUxfuUSOmP7eiKr8uTCY6NyWi5ck7bP8d8MBtqxgqtL6E↵cxQ4BsoUtgF2RV8qXd/7lxOpnE6Mfzrn57jS1C1ZMOHzuEihJK31/WXDFx3mRbDO↵bopL5UzqpoPq6GAErl2VuyNzEa8WImG/1BV6X7z794RNAgMBAAE=↵-----END PUBLIC KEY-----↵",
          "identity_data": {
            "application/json": {
              "mac": "00:01:02:03:04:05",
              "sku": "My Device 1",
              "sn": "SN1234567890"
            }
          },
          "status": "rejected",
          "ts": "2018-10-29T09:25:31.385Z"
        },
        {
          "id": "asdfghjkl",
          "pubkey": "-----BEGIN PUBLIC KEY-----↵MIIBojANBgkqhkiG9w0BAQEFAAOCAY8AMIIBigKCAYEAxOc4fm5poQQk5RinJ0Fi↵dZE1843+yCzPtoV8q4nQkCjoA18/6vntx9Cn6kQKnXesiYN2BrefCWom2Pck8WT3↵DKAznsEKxrHA8N/L6IYTzIR4mkZq0o+8jW1mJR+VqXsvtlBwy0GZgdroRkBDCSVA↵DASF5RVOlslaPhZmS62ggSRd0Uask1zrbwgJOFxZ4u3pqUdhgYfAHJJiqUWYYrf4↵0278zzkls7NYp2mUfBHqYZyWljjUkiS4qB00Pamlv5d2bZaffMIBYfy6IuyTcnnj↵Lfu98BWmS/1aviPm+ET6/iieq6K2f/FNCnxpoC0RrGtoloOJgPMlkf/jReX0qoby↵HiCEwq9rp7uzpxyATIrcUxfuUSOmP7eiKr8uTCY6NyWi5ck7bP8d8MBtqxgqtL6E↵cxQ4BsoUtgF2RV8qXd/7lxOpnE6Mfzrn57jS1C1ZMOHzuEihJK31/WXDFx3mRbDO↵bopL5UzqpoPq6GAErl2VuyNzEa8WImG/1BV6X7z794RNAgMBAAE=↵-----END PUBLIC KEY-----↵",
          "identity_data": {
            "application/json": {
              "mac": "00:01:02:03:04:05",
              "sku": "My Device 1",
              "sn": "SN1234567890"
            }
          },
          "status": "pending",
          "ts": "2018-10-29T09:25:31.385Z"
        }
      ],
    };

    return (
      <div>
        {deviceInfo}

          { this.props.showHelptips && status==="pending" ?
            <div>
              <div 
                id="onboard-4"
                className={this.props.highlightHelp ? "tooltip help highlight" : "tooltip help"}
                data-tip
                data-for='auth-button-tip'
                data-event='click focus'
                style={{left:"580px",top:"178px"}}>
                <FontIcon className="material-icons">help</FontIcon>
              </div>
              <ReactTooltip
                id="auth-button-tip"
                globalEventOff='click'
                place="bottom"
                type="light"
                effect="solid"
                className="react-tooltip">
                <AuthButton devices={[this.props.device]} />
              </ReactTooltip>
            </div>
          : null }

        <Dialog
          open={this.state.schedule}
          title='Create a deployment'
          actions={scheduleActions}
          autoDetectWindowHeight={true}
          bodyStyle={{paddingTop:"0", fontSize:"13px"}}
          contentStyle={{overflow:"hidden", boxShadow:"0 14px 45px rgba(0, 0, 0, 0.25), 0 10px 18px rgba(0, 0, 0, 0.22)"}}
          >
          <ScheduleForm deploymentDevices={[this.props.device]} filteredDevices={this.state.filterByArtifact} deploymentSettings={this._deploymentParams} artifact={this.state.artifact} artifacts={this.state.artifacts} device={this.props.device} deploymentSchedule={this._updateParams} groups={this.props.groups} />

        </Dialog>


        <Dialog
          open={this.state.authsets}
          title='Device authentication sets'
          autoDetectWindowHeight={true}
          actions={authsetActions}
          bodyStyle={{paddingTop:"0", fontSize:"13px"}}
          contentStyle={{width: "80%", maxWidth: "1500px", overflow:"hidden", boxShadow:"0 14px 45px rgba(0, 0, 0, 0.25), 0 10px 18px rgba(0, 0, 0, 0.22)"}}
          >
          <Authsets device={fakeDevice} id_attribute={this.props.id_attribute}  id_value={this.props.id_value} />
        </Dialog>


      </div>
    );
  }
});

ExpandedDevice.contextTypes = {
  router: PropTypes.object,
  location: PropTypes.object,
};

module.exports = ExpandedDevice;
