import React from 'react';
import ReactDOM from 'react-dom';
import Time from 'react-time';
import { Motion, spring } from 'react-motion';
import Collapse from 'react-collapse';
import ReactHeight from 'react-height';
import ReactTooltip from 'react-tooltip';
import { AuthDevices, ExpandAuth, AuthButton } from '../helptips/helptooltips';
var Loader = require('../common/loader');
var AppActions = require('../../actions/app-actions');
var ExpandedDevice = require('./expanded-device');
var createReactClass = require('create-react-class');
var Pagination = require('rc-pagination');
var _en_US = require('rc-pagination/lib/locale/en_US');
var pluralize = require('pluralize');


// material ui
var mui = require('material-ui');
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import IconButton from 'material-ui/IconButton';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/RaisedButton';
import FontIcon from 'material-ui/FontIcon';
import InfoIcon from 'react-material-icons/icons/action/info-outline';
import Snackbar from 'material-ui/Snackbar';
import Dialog from 'material-ui/Dialog';
import { List, ListItem } from 'material-ui/List';
import TextField from 'material-ui/TextField';

var Authorized =  createReactClass({
  getInitialState: function() {
    return {
      minHeight: 200,
      divHeight: 178,
      devices: [],
      pageNo: 1,
      pageLength: 20,
      selectedRows: [],
      loading: true,
    }
  },

  componentDidMount() {
    this._getDevices();
  },

  componentDidUpdate(prevProps, prevState) {
    if ((prevProps.groupCount !== this.props.groupCount) || (prevProps.acceptedCount !== this.props.acceptedCount) || (prevProps.rejectedCount !== this.props.rejectedCount) ) {
      this._getDevices();
      this.setState({selectedRows:[], expandRow: null});
    }

    if (prevProps.currentTab !== this.props.currentTab) {
      this.setState({selectedRows:[], expandRow: null});
    }
  },

  
  /*
  * Devices to show
  */ 
  _getDevices: function() {
    var self = this;
    if (!this.props.selectedGroup) {
      // no group selected, get all accepted
      this._getAllAccepted();
    } else {
       var callback =  {
        success: function(devices) {
          self.setState({devices: devices, loading: false, pageLoading: false}, self._adjustHeight());
        },
        error: function(error) {
          console.log(err);
          var errormsg = err.error || "Please check your connection.";
          self.setState({loading: false});
             // setRetryTimer(err, "devices", "Devices couldn't be loaded. " + errormsg, self.state.refreshDeviceLength);
        }
      };

      self.setState({loading: true});
      AppActions.getDevices(callback, this.state.pageNo, this.state.pageLength, this.props.selectedGroup);
    }
  },
  
  _getAllAccepted: function() {
    var self = this;
    var callback =  {
      success: function(devices) {
        self.setState({devices: devices}, self._adjustHeight());
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


  _adjustHeight: function () {
    // do this when number of devices changes
    var h = this.state.devices.length * 55;
    this.setState({minHeight: h});
  },
  _sortColumn: function(col) {
    console.log("sort");
  },
  _expandRow: function(rowNumber) {
    AppActions.setSnackbar("");
    var device = this.state.devices[rowNumber];
    if (this.state.expandRow === rowNumber) {
      rowNumber = null;
    }
    
    this._setDeviceDetails(device);
    this.setState({expandRow: rowNumber});
    
  },
  _adjustCellHeight: function(height) {
    this.setState({divHeight: height+85});
  },

   /*
  * Get full device identity details for single selected device
  */
  _setDeviceDetails: function(device) {
    var self = this;

    var callback = {
      success: function(data) {
        console.log(data);
        device.id_data = data.attributes;
        device.device_id = data.device_id;
        device.request_time = data.request_time;
        device.status = data.status;
        self.setState({expandedDevice: device});
      },
      error: function(err) {
        console.log("Error: " + err);
      }
    };
    AppActions.getDeviceIdentity(device.id, callback);
  },


  _handlePageChange: function(pageNo) {
    var self = this;
    self.setState({pageLoading: true, selectedRows:[], currentPage: pageNo, authLoading:true, expandRow: null, pageNo: pageNo}, () => {self._getDevices()});
  },

  _onRowSelection: function(selectedRows) {

    if (selectedRows === "all") {
      var rows = Array.apply(null, {length: this.state.devices.length}).map(Number.call, Number);
      this.setState({selectedRows: rows});
    } else if (selectedRows === "none") {
      this.setState({selectedRows: []});
    } else {
      this.setState({selectedRows: selectedRows});
    }
    
  },

  _isSelected: function(index) {
    return this.state.selectedRows.indexOf(index) !== -1;
  },

  _getDevicesFromSelectedRows: function() {
    // use selected rows to get device from corresponding position in devices array
    var devices = [];
    for (var i=0; i<this.state.selectedRows.length; i++) {
      devices.push(this.state.devices[this.state.selectedRows[i]]);
    }
    return devices;
  },

  _dialogToggle: function (ref) {
    console.log("this will open add to group in parent, with list of devices");
  },

  render: function() {

    var pluralized = pluralize("devices", this.state.selectedRows.length); 

    var addLabel = this.props.selectedGroup ? "Move selected " + pluralized +" to another group" : "Add selected " + pluralized +" to a group";
    var removeLabel =  "Remove selected " + pluralized +" from this group";
    var groupLabel = this.props.selectedGroup ? decodeURIComponent(this.props.selectedGroup) : "Accepted devices";

    var styles = {
      exampleFlatButtonIcon: {
        height: '100%',
        display: 'inline-block',
        verticalAlign: 'middle',
        float: 'left',
        paddingLeft: '12px',
        lineHeight: '36px',
        marginRight: "-6px",
        color:"#679BA5",
        fontSize:'16px'
      },
      exampleFlatButton: {
        fontSize:'12px',
        marginLeft:"10px",
        float:"right",
        marginRight:"130px"
      },
      editButton: {
        color: "rgba(0, 0, 0, 0.54)",
        fontSize: "20px" 
      },
      buttonIcon: {
        height: '100%',
        display: 'inline-block',
        verticalAlign: 'middle',
        float: 'left',
        paddingLeft: '12px',
        lineHeight: '36px',
        marginRight: "-6px",
        color: "rgb(0, 188, 212)"
      },
      raisedButtonIcon: {
        height: '100%',
        display: 'inline-block',
        verticalAlign: 'middle',
        float: 'left',
        paddingLeft: '12px',
        lineHeight: '36px',
        marginRight: "-6px",
        color: "#fff"
      },
      sortIcon: {
        verticalAlign: 'middle',
        marginLeft: "10px",
        color: "#8c8c8d",
        cursor: "pointer",
      },
      paddedCell: {
        height: "100%",
        padding: "16px 24px",
        width: "100%"
      }
    };


    var devices = this.state.devices.map(function(device, index) {
      var self = this;
      var expanded = '';
      
      var attrs = {
        device_type: "",
        artifact_name: ""
      };
      var attributesLength = device.attributes ? device.attributes.length : 0; 
      for (var i=0;i<attributesLength;i++) {
        attrs[device.attributes[i].name] = device.attributes[i].value;
      }
      
      if ( self.state.expandRow === index ) {
        expanded = <ExpandedDevice rejectOrDecomm={this.props.rejectOrDecomm} device_type={attrs.device_type} styles={this.props.styles} block={this.props.block} accept={this.props.accept} redirect={this.props.redirect} artifacts={this.props.artifacts} device={device} selectedGroup={this.props.selectedGroup} groups={this.props.groups} />
      }
     
      return (
        <TableRow 
          hoverable={!expanded}
          className={expanded ? "expand" : null}
          key={device.device_id || device.id}
          selected={this._isSelected(index)}>
          <TableRowColumn style={expanded ? {height: this.state.divHeight, padding: 0} : {padding: 0}}>
            <div style={styles.paddedCell} onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this._expandRow(index,0);
            }}>
            {device.device_id || device.id}
            </div>
          </TableRowColumn>
          <TableRowColumn style={{padding: 0}}>
            <div style={styles.paddedCell} onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this._expandRow(index,1);
            }}>
            {attrs.device_type || "-"}
            </div>
          </TableRowColumn>
          <TableRowColumn style={{padding: 0}}>
            <div style={styles.paddedCell} onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this._expandRow(index,2);
            }}>
            {attrs.artifact_name || "-"}
            </div>
          </TableRowColumn>
          <TableRowColumn style={{padding: 0}}>
            <div style={styles.paddedCell} onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this._expandRow(index,3);
            }}>
              {device.updated_ts ? <Time value={device.updated_ts} format="YYYY-MM-DD HH:mm" /> : "-" }
            </div>
          </TableRowColumn>
          <TableRowColumn style={{width:"55px", paddingRight:"0", paddingLeft:"12px"}} className="expandButton">
             <div onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this._expandRow(index,4);
            }}>
              <IconButton className="float-right"><FontIcon className="material-icons">{ expanded ? "arrow_drop_up" : "arrow_drop_down"}</FontIcon></IconButton>
            </div>
          </TableRowColumn>
          <TableRowColumn style={{width:"0", padding:"0", overflow:"visible"}}>
           
            <Collapse springConfig={{stiffness: 210, damping: 20}} onHeightReady={this._adjustCellHeight} className="expanded" isOpened={expanded ? true : false}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}>
              {expanded}
            </Collapse>
         
          </TableRowColumn>
        </TableRow>
      )
    }, this);


    var groupNameInputs = (
      <TextField 
        id="groupNameInput"
        ref="editGroupName"
        value={groupLabel}
        onChange={this._handleGroupNameChange}
        onKeyDown={this._handleGroupNameSave}
        className={this.state.nameEdit ? "hoverText" : "hidden"}
        underlineStyle={{borderBottom:"none"}}
        underlineFocusStyle={{borderColor:"#e0e0e0"}}
        errorStyle={{color: "rgb(171, 16, 0)"}}
        errorText={this.state.errorText} />
    );

    var correctIcon = this.state.nameEdit ? "check" : "edit";
    if (this.state.errorText1) {
      correctIcon = "close";
    }



    return (
      <Collapse springConfig={{stiffness: 190, damping: 20}} style={{minHeight:this.state.minHeight, width:"100%"}} isOpened={true}>
        
      <Loader show={this.state.loading} />

        <div style={{marginLeft:"26px"}}>
          <h2 style={{marginTop:"15px"}}>
           
              {groupNameInputs}
              <span className={this.state.nameEdit ? "hidden" : null}>{groupLabel}</span>
              <span className={this.props.selectedGroup ? "hidden" : 'hidden'}>
                <IconButton iconStyle={styles.editButton} onClick={this._nameEdit} iconClassName="material-icons" className={this.state.errorText1 ? "align-top" : null}>
                  {correctIcon}
                </IconButton>
              </span>

              <FlatButton onClick={this._removeCurrentGroup} style={styles.exampleFlatButton} className={this.props.selectedGroup ? null : 'hidden' } secondary={true} label="Remove group" labelPosition="after">
                <FontIcon style={styles.exampleFlatButtonIcon} className="material-icons">delete</FontIcon>
              </FlatButton>
          </h2>
        </div>

        { this.state.devices.length ?

          <div className="padding-bottom">


            <Table
              multiSelectable={true}
              onRowSelection={this._onRowSelection}>
              <TableHeader
                className="clickable"
                enableSelectAll={true}>
                <TableRow>
                  <TableHeaderColumn className="columnHeader" tooltip="ID">ID</TableHeaderColumn>
                  <TableHeaderColumn className="columnHeader" tooltip="Device type">Device type</TableHeaderColumn>
                  <TableHeaderColumn className="columnHeader" tooltip="Current software">Current software</TableHeaderColumn>
                  <TableHeaderColumn className="columnHeader" tooltip="Last heartbeat">Last heartbeat</TableHeaderColumn>
                  <TableHeaderColumn className="columnHeader" style={{width:"55px", paddingRight:"12px", paddingLeft:"0"}}></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody
                showRowHover={true}
                deselectOnClickaway={false}
                className="clickable">
                {devices}
              </TableBody>
            </Table>

            <div className="margin-top">
              <Pagination locale={_en_US} simple pageSize={20} current={this.state.currentPage || 1} total={this.props.groupCount} onChange={this._handlePageChange} />
               {this.state.pageLoading ?  <div className="smallLoaderContainer"><Loader show={true} /></div> : null}
            </div>
          </div>

          :

       
          <div className={(this.state.devices.length || this.state.loading) ? 'hidden' : 'dashboard-placeholder'}>
            <p>
              No devices found
            </p>
          </div>
        }


        { this.props.showHelptips && this.state.devices.length ?
          <div>
            <div 
              id="onboard-3"
              className="tooltip help"
              data-tip
              data-for='expand-auth-tip'
              data-event='click focus'
              style={{left:"10%"}}>
              <FontIcon className="material-icons">help</FontIcon>
            </div>
            <ReactTooltip
              id="expand-auth-tip"
              globalEventOff='click'
              place="bottom"
              type="light"
              effect="solid"
              className="react-tooltip">
              <ExpandAuth />
            </ReactTooltip>
          </div>
        : null }

        <div>

        { this.state.selectedRows.length ? 
          
          <div className="fixedButtons">
            <div className="float-right">
              <span className="margin-right">{this.state.selectedRows.length} {pluralize("devices", this.state.selectedRows.length)} selected</span>
              <RaisedButton disabled={!this.state.selectedRows.length} label={addLabel} secondary={true} onClick={this._dialogToggle.bind(null, 'addGroup')}>
                <FontIcon style={styles.raisedButtonIcon} className="material-icons">add_circle</FontIcon>
              </RaisedButton>
              <FlatButton disabled={!this.state.selectedRows.length} style={{marginLeft: "4px"}} className={this.props.selectedGroup ? null : 'hidden'} label={removeLabel} secondary={true} onClick={this._removeSelectedDevices}>
                <FontIcon style={styles.buttonIcon} className="material-icons">remove_circle_outline</FontIcon>
              </FlatButton>
            </div>
          </div>

        : null }

          { this.props.showHelptips && this.state.devices.length ?
            <div>
              <div 
                id="onboard-4"
                className={this.props.highlightHelp ? "tooltip help highlight" : "tooltip help"}
                data-tip
                data-for='auth-button-tip'
                data-event='click focus'>
                <FontIcon className="material-icons">help</FontIcon>
              </div>
              <ReactTooltip
                id="auth-button-tip"
                globalEventOff='click'
                place="bottom"
                type="light"
                effect="solid"
                className="react-tooltip">
                <AuthButton devices={this.state.devices.length} />
              </ReactTooltip>
            </div>
          : null }
        </div>


      </Collapse>
    );
  }
});


module.exports = Authorized;