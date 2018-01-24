import React from 'react';
import ReactDOM from 'react-dom';
import Time from 'react-time';
import { Motion, spring } from 'react-motion';
import Collapse from 'react-collapse';
import ReactHeight from 'react-height';
import { fullyDecodeURI } from '../../helpers';
import ReactTooltip from 'react-tooltip';
import { ExpandDevice } from '../helptips/helptooltips';
var createReactClass = require('create-react-class');

var ExpandedDevice = require('./expanded-device');
var GroupSelector = require('./groupselector');

var pluralize = require('pluralize');

// material ui
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table';
import RaisedButton from 'material-ui/RaisedButton';

import FlatButton from 'material-ui/FlatButton';
import FontIcon from 'material-ui/FontIcon';
import IconButton from 'material-ui/IconButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';

var DeviceList = createReactClass({
  getInitialState: function() {
    return {
      errorText1: null,
      autoHideDuration: 8000,
      snackMessage: 'Group has been removed',
      openSnack: false,
      nameEdit: false,
      groupName: this.props.selectedGroup,
      divHeight: 148,
    };
  },
  componentDidUpdate: function(prevProps, prevState) {

    if (prevProps.selectedGroup !== this.props.selectedGroup) {
      this.setState({
        expanded: null,
        groupName: this.props.selectedGroup,
        nameEdit: false
      });
    }
    if (prevProps.page !== this.props.page) {
      // close expanded details when pagination changes
      this.setState({expanded: null});
    }
    if (this.state.nameEdit) {
      this.refs.editGroupName.focus();
    }
  },

  _isSelected: function (index) {
    return this.props.selectedRows.indexOf(index) !== -1;
  },
  
  _onRowSelection: function(selected) {
    var self = this;
    if (selected === "all" || selected === "none") {
      var deviceArray = (selected === "all") ? Array.from(Array(this.props.devices.length).keys()) : [];
      self.props.updateSelected(deviceArray);
    } else {
      self.props.updateSelected(selected);
    }
  },
 
  _expandRow: function(rowNumber, columnId) {
    if (columnId>-1 && columnId<5) {
      var clickedDevice = this.props.devices[rowNumber];
      this.props.expandRow(clickedDevice, rowNumber);
    }
  },
  _addGroupHandler: function() {
    var i;
    var group = this.state.tmpGroup || this.props.selectedField;
    for (i=0; i<this.props.selectedRows.length; i++) {
      this._addSingleDevice(i, this.props.selectedRows.length, this.props.devices[this.props.selectedRows[i]].id, group);
    }
    this.dialogToggle('addGroup');
  },


  _removeSelectedDevices: function() {
    this.props.removeDevicesFromGroup();
  },
  

  dialogToggle: function (ref) {
    var state = {};
    state[ref] = !this.state[ref];
    state.tmpGroup = "";
    state.willBeEmpty = false;
    this.props.pauseRefresh(state[ref]);
    this.setState(state);

    if (ref === "addGroup" && this.props.selectedGroup) {
       // check if group will be left empty after moving devices
      this._checkWillBeEmpty(this.state.groupName);
    }
  },
  

  handleRequestClose: function() {
    this.setState({
      openSnack: false,
    });
  },

  _nameEdit: function() {
    if (this.state.nameEdit) {
      this._handleGroupNameSave();
    }
    this.setState({
      nameEdit: !this.state.nameEdit,
      errorText1: null
    });
  },

  _adjustCellHeight: function(height) {
    this.setState({divHeight: height+60});
  },

  _cancelAdd: function() {
    this.dialogToggle('addGroup');
  },

  _validate: function(invalid, group) {
    var name = invalid ? "" : group;
    this.setState({groupInvalid: invalid, tmpGroup: name});
  },

  _sortColumn: function(key) {
    console.log("sort by key: " +key);
  },


  render: function() {
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
    }

    var devices = this.props.devices.map(function(device, index) {
      var expanded = '';

      var attrs = {
        device_type: "",
        artifact_name: ""
      };
      var attributesLength = device.attributes ? device.attributes.length : 0; 
      for (var i=0;i<attributesLength;i++) {
        attrs[device.attributes[i].name] = device.attributes[i].value;
      }
      if ( this.props.expandedRow === index ) {
        expanded = <ExpendedDevice device_type={attrs.device_type} styles={this.props.styles} block={this.props.block} accept={this.props.accept} redirect={this.props.redirect} artifacts={this.props.artifacts} device={this.props.expandedDevice} selectedGroup={this.props.selectedGroup} groups={this.props.groups} />
      }
      return (
        <TableRow 
          hoverable={!expanded}
          className={expanded ? "expand" : null}
          key={device.id}
          selected={this._isSelected(index)}>
          <TableRowColumn style={expanded ? {height: this.state.divHeight, padding: 0} : {padding: 0}}>
            <div style={styles.paddedCell} onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this._expandRow(index,0);
            }}>
            {device.id}
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
              <Time value={device.updated_ts} format="YYYY-MM-DD HH:mm" />
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

    var disableAction = this.props.selectedRows.length ? false : true;

    var groupNameInputs = (
      <TextField 
        id="groupNameInput"
        ref="editGroupName"
        value={this.state.groupName || ""}
        onChange={this._handleGroupNameChange}
        onKeyDown={this._handleGroupNameSave}
        className={this.state.nameEdit ? "hoverText" : "hidden"}
        underlineStyle={{borderBottom:"none"}}
        underlineFocusStyle={{borderColor:"#e0e0e0"}}
        errorStyle={{color: "rgb(171, 16, 0)"}}
        errorText={this.state.errorText1} />
    );

    var correctIcon = this.state.nameEdit ? "check" : "edit";
    if (this.state.errorText1) {
      correctIcon = "close";
    }

    var pluralized = pluralize("devices", this.props.selectedRows.length); 
    var addLabel = this.props.selectedGroup ? "Move selected " + pluralized +" to another group" : "Add selected " + pluralized +" to a group";
    var removeLabel =  "Remove selected " + pluralized +" from this group";
    var groupLabel = this.props.selectedGroup ? decodeURIComponent(this.props.selectedGroup) : "All devices";

    return (
      <div>

        <div className="margin-top-small">
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
          <div className="margin-bottom">
            <Table
              onCellClick={this._expandRow}
              multiSelectable={true}
              className={devices.length ? null : 'hidden'}
              onRowSelection={this._onRowSelection} >
              <TableHeader
              className="clickable"
              enableSelectAll={true}>
                <TableRow>
                  <TableHeaderColumn className="columnHeader" tooltip="ID">ID<FontIcon ref="id" style={styles.sortIcon} onClick={this._sortColumn.bind(null, "id")} className="sortIcon material-icons">sort</FontIcon></TableHeaderColumn>
                  <TableHeaderColumn className="columnHeader" tooltip="Device type">Device type<FontIcon ref="device_type" style={styles.sortIcon} onClick={this._sortColumn.bind(null, "device_type")} className="sortIcon material-icons">sort</FontIcon></TableHeaderColumn>
                  <TableHeaderColumn className="columnHeader" tooltip="Current software">Current software<FontIcon ref="artifact_name" style={styles.sortIcon} onClick={this._sortColumn.bind(null, "artifact_version")} className="sortIcon material-icons">sort</FontIcon></TableHeaderColumn>
                  <TableHeaderColumn className="columnHeader" tooltip="Last heartbeat">Last heartbeat<FontIcon ref="last_heartbeat" style={styles.sortIcon} onClick={this._sortColumn.bind(null, "last_heartbeat")} className="sortIcon material-icons">sort</FontIcon></TableHeaderColumn>
                  <TableHeaderColumn className="columnHeader" style={{width:"55px", paddingRight:"12px", paddingLeft:"0"}}></TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody
                deselectOnClickaway={false}
                preScanRows={false}
                showRowHover={true}
                className="clickable">
                {devices}
              </TableBody>
            </Table>



            { this.props.showHelptips && devices.length ?
              <div>
                <div 
                  id="onboard-6"
                  className="tooltip help"
                  data-tip
                  data-for='expand-device-tip'
                  data-event='click focus'
                  style={{left: "inherit", right:"45px", bottom: "132px"}}>
                  <FontIcon className="material-icons">help</FontIcon>
                </div>
                <ReactTooltip
                  id="expand-device-tip"
                  globalEventOff='click'
                  place="left"
                  type="light"
                  effect="solid"
                  className="react-tooltip">
                  <ExpandDevice />
                </ReactTooltip>
              </div>
            : null }



            <div className={(devices.length || this.props.loading) ? 'hidden' : 'dashboard-placeholder'}>
              <p>
                No devices found
              </p>
            </div>
          </div>

          <div className={this.props.selectedRows.length ? "fixedButtons" : "hidden"}>
            <span className="margin-right">{this.props.selectedRows.length} {pluralized} selected</span>
            <RaisedButton disabled={disableAction} label={addLabel} secondary={true} onClick={this.dialogToggle.bind(null, 'addGroup')}>
              <FontIcon style={styles.raisedButtonIcon} className="material-icons">add_circle</FontIcon>
            </RaisedButton>
            <FlatButton disabled={disableAction} style={{marginLeft: "4px"}} className={this.props.selectedGroup ? null : 'hidden'} label={removeLabel} secondary={true} onClick={this._removeSelectedDevices}>
              <FontIcon style={styles.buttonIcon} className="material-icons">remove_circle_outline</FontIcon>
            </FlatButton>
          </div>

        </div>


      </div>
    );
  }
});

module.exports = DeviceList;
