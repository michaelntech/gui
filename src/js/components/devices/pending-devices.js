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
import FontIcon from 'material-ui/FontIcon';
import InfoIcon from 'react-material-icons/icons/action/info-outline';
import Snackbar from 'material-ui/Snackbar';

var Authorized =  createReactClass({
  getInitialState: function() {
    return {
      minHeight: 200,
      divHeight: 178,
      devices: [],
      pageNo: 1,
      pageLength: 20,
      selectedRows: [],
      authLoading: "all",
    }
  },

  componentDidMount() {
    this._getDevices();
  },

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.count !== this.props.count) {
      this._getDevices();
      this.setState({selectedRows:[]});
    }
  },
  /*
  * Devices to show
  */ 
  _getDevices: function() {
    var self = this;
    self.setState({pageLoading: true, authLoading: "all"});
    var callback =  {
      success: function(devices) {
        self.setState({devices: devices, pageLoading: false, authLoading: null});
        if (!devices.length && self.props.count) {
          //if devices empty but count not, put back to first page
          self._handlePageChange(1);
        }
        self._adjustHeight();
      },
      error: function(error) {
        console.log(err);
        var errormsg = err.error || "Please check your connection.";
        self.setState({pageLoading: false, authLoading: null});
        setRetryTimer(err, "devices", "Devices couldn't be loaded. " + errormsg, self.state.refreshDeviceLength);
      }
    };
    AppActions.getDevicesByStatus(callback, "pending", this.state.pageNo, this.state.pageLength);
  },


  _adjustHeight: function () {
    // do this when number of devices changes
    var h = this.state.devices.length * 55;
    h += 100;
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
    device.id_data = device.attributes;
    this.setState({expandedDevice: device, expandRow: rowNumber});
    
  },
  _adjustCellHeight: function(height) {
    this.setState({divHeight: height+65});
  },


  _handlePageChange: function(pageNo) {
    var self = this;
    self.setState({selectedRows:[], currentPage: pageNo, authLoading:true, expandRow: null, pageNo: pageNo}, () => {self._getDevices()});
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

  _authorizeDevices: function(devices, index) {
    if (Array.isArray(devices)) {
      this.props.authorizeDevices(devices);
    } else if (this.state.selectedRows) {
      this.props.authorizeDevices(this._getDevicesFromSelectedRows());
    }
   
    if (index) {
      this.setState({authLoading: index});
    } else {
      this.setState({authLoading: "all"});
    }
  },

  _blockDevice: function(device, index) {
    this.props.rejectDevice(device);
    this.setState({blockLoading: index});
  },

  render: function() {
    var limitMaxed = this.props.deviceLimit && (this.props.deviceLimit <= this.props.totalDevices);
    var limitNear = this.props.deviceLimit && (this.props.deviceLimit < this.props.totalDevices + this.state.devices.length );

    var styles = {
      listStyle: {
        fontSize: "12px",
        paddingTop: "10px",
        paddingBottom: "10px",
        display: "inline"
      },
    };

    var devices = this.state.devices.map(function(device, index) {
      var self = this;
      var expanded = '';
      if ( self.state.expandRow === index ) {
        expanded = <ExpandedDevice disabled={limitMaxed} styles={styles} attributes={device.attributes} deviceId={self.state.deviceId} device={self.state.expandedDevice} unauthorized={true} selected={[device]}  />
      }
      var checkIcon = (self.state.authLoading === index && self.props.disabled) ?
        (
          <div className="inline-block">
            <Loader table={true} waiting={true} show={true} />
          </div>
        ) : 
        (
          <IconButton disabled={self.props.disabled || limitMaxed} onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              self._authorizeDevices([device], index);
            }}>
              <FontIcon className="material-icons green">check_circle</FontIcon>
          </IconButton>
        )
      ;
      var deleteIcon = (self.state.blockLoading === index && self.props.disabled) ?
        (
          <div className="inline-block">
            <Loader table={true} waiting={true} show={true} />
          </div>
        ) : 
        (
          <IconButton disabled={self.props.disabled} onClick={this._blockDevice.bind(null, device, index)}>
            <FontIcon className="material-icons red">cancel</FontIcon>
          </IconButton>
        )
      ;
      return (
        <TableRow selected={this._isSelected(index)} style={{"backgroundColor": "#e9f4f3"}} className={expanded ? "expand" : null} hoverable={true} key={index}>
          <TableRowColumn className="no-click-cell" style={expanded ? {height: this.state.divHeight} : null}>
             <div onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              self._expandRow(index);
            }}>
              {device.id}
            </div>
          </TableRowColumn>
          <TableRowColumn className="no-click-cell">
              <div onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              self._expandRow(index);
            }}>
            <Time value={device.request_time} format="YYYY-MM-DD HH:mm" />
            </div>
          </TableRowColumn>
          <TableRowColumn className="no-click-cell capitalized">
            <div onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              self._expandRow(index);
            }}>{device.status}
            </div>
          </TableRowColumn>
          <TableRowColumn className="expandButton" style={{"paddingLeft": "12px", width: "140px"}}>
            <div onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}>
              {checkIcon}
              {deleteIcon}
            </div>
          </TableRowColumn>
          <TableRowColumn style={{width:"55px", paddingRight:"0", paddingLeft:"12px"}} className="expandButton">
             <div onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this._expandRow(index);
            }}>
              <IconButton className="float-right"><FontIcon className="material-icons">{ expanded ? "arrow_drop_up" : "arrow_drop_down"}</FontIcon></IconButton>
            </div>
          </TableRowColumn>
          <TableRowColumn style={{width:"0", padding:"0", overflow:"visible"}}>
            <div onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this._expandRow(index);
            }}>
            <Collapse springConfig={{stiffness: 210, damping: 20}} onHeightReady={this._adjustCellHeight} className="expanded" isOpened={expanded ? true : false}>
              {expanded}
            </Collapse>
            </div>
          </TableRowColumn>
        </TableRow>
      )
    }, this);
    
    var deviceLimitWarning = (limitMaxed || limitNear) ?
      (
        <p className="warning">
          <InfoIcon style={{marginRight:"2px", height:"16px", verticalAlign:"bottom"}} />
          <span className={limitMaxed ? null : "hidden"}>You have reached</span><span className={limitNear&&!limitMaxed ? null : "hidden"}>You are nearing</span> your limit of authorized devices: {this.props.totalDevices} of {this.props.deviceLimit}
        </p>
    ) : null;

    var minHeight = deviceLimitWarning ? this.state.minHeight + 20 : this.state.minHeight;


    return (
      <Collapse springConfig={{stiffness: 190, damping: 20}} style={{minHeight:minHeight, width:"100%"}} isOpened={true} id="authorize" className="absolute authorize">
        
      <Loader show={this.state.authLoading==="all"} />

        { this.props.showHelptips ?
          <div>
            <div 
              id="onboard-2"
              className={this.props.highlightHelp ? "tooltip help highlight" : "tooltip help"}
              data-tip
              data-for='review-devices-tip'
              data-event='click focus'>
              <FontIcon className="material-icons">help</FontIcon>
            </div>
            <ReactTooltip
              id="review-devices-tip"
              globalEventOff='click'
              place="bottom"
              type="light"
              effect="solid"
              className="react-tooltip">
              <AuthDevices devices={devices.length} />
            </ReactTooltip>
          </div>
        : null }


        { this.state.devices.length ?

          <div className="padding-bottom">

            {deviceLimitWarning}

            <h3 className="align-center">{this.props.count} {pluralize("devices", this.props.count)} pending authorization</h3>

            <Table
              multiSelectable={true}
              onRowSelection={this._onRowSelection}>
              <TableHeader
                className="clickable"
                enableSelectAll={true}>
                <TableRow>
                  <TableHeaderColumn className="columnHeader" tooltip="ID">ID</TableHeaderColumn>
                  <TableHeaderColumn className="columnHeader" tooltip="Request time">Request time</TableHeaderColumn>
                  <TableHeaderColumn className="columnHeader" tooltip="Status">Status</TableHeaderColumn>
                  <TableHeaderColumn className="columnHeader" tooltip="Authorize device?" style={{width:"140px"}}>Authorize?</TableHeaderColumn>
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
              <Pagination locale={_en_US} simple pageSize={20} current={this.state.currentPage || 1} total={this.props.count} onChange={this._handlePageChange} />
               {this.state.pageLoading ?  <div className="smallLoaderContainer"><Loader show={true} /></div> : null}
            </div>
          </div>

          :

          <div className={this.state.authLoading ? "hidden" : "dashboard-placeholder"}>
            No devices pending (add help link for connecting devices)
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
          {
            (this.state.authLoading === "all" && this.props.disabled) ?
                 <div style={{width:"150px", position: "absolute", left: "-150px", top: "15px"}} className="inline-block">
                    <Loader table={true} waiting={true} show={true} />
                </div>
            :
            null
          }
     

        { this.state.selectedRows.length ? 
          <div className="fixedButtons">
            <div className="float-right">
              <span className="margin-right">{this.state.selectedRows.length} {pluralize("devices", this.state.selectedRows.length)} selected</span>
              <RaisedButton disabled={this.props.disabled || limitMaxed || limitNear} onClick={this._authorizeDevices} primary={true} label={"Authorize " + this.state.selectedRows.length +" " + pluralize("devices", this.state.selectedRows.length)} />
              {deviceLimitWarning}
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

        <Snackbar
          open={this.props.snackbar.open}
          message={this.props.snackbar.message}
          autoHideDuration={8000}
        />
      </Collapse>
    );
  }
});


module.exports = Authorized;