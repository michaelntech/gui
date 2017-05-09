import React from 'react';
var AppActions = require('../../actions/app-actions');

// material ui
import { List, ListItem } from 'material-ui/List';
import FontIcon from 'material-ui/FontIcon';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Subheader from 'material-ui/Subheader';
require('../common/prototype/Array.prototype.equals');

var Groups = React.createClass({
  componentDidMount: function() {
    this.props.addTooltip({
      text: 'You can organise your devices into custom <b>groups</b> to control which devices will receive which updates. <p>Note: each device can only belong to <b>one</b> custom group at a time. You can create and remove as many groups as you like.</p>',
      selector: '#groupHelp',
      trigger: '#groupHelp',
      position: 'bottom-left'
    });
  },

  _changeGroup: function(group) {
    this.props.changeGroup(group);
  },

  dialogToggle: function() {
    this.props.openGroupDialog();
  },

  render: function() {
    var createBtn = (
      <FontIcon className="material-icons">add</FontIcon>
    );
   
    var allLabel = (
      <span>All devices<span className='float-right length'>{this.props.totalDevices}</span></span>
    );

    return (
      <div>
        <List style={{position:"relative"}}>
          <Subheader>Groups</Subheader>
            <ListItem 
              key="All" 
              primaryText={allLabel}
              style={!this.props.selectedGroup ? {backgroundColor: "#e7e7e7"} : {backgroundColor: "transparent"}}
              onClick={this._changeGroup.bind(null, "")} />
   
          {this.props.groupList.map(function(group, index) {
            var isSelected = group===this.props.selectedGroup ? {backgroundColor: "#e7e7e7"} : {backgroundColor: "transparent"};
            var boundClick = this._changeGroup.bind(null, group);
            var numDevs;
            if (this.props.groupDevices) {
              numDevs = this.props.groupDevices[group] || null;
            }
            var groupLabel = (
                <span>{decodeURIComponent(group)}<span className='float-right length'>{numDevs}</span></span>
            );
            return (
              <ListItem 
                key={group} 
                primaryText={groupLabel}
                style={isSelected}
                onClick={boundClick} />
            )
          }, this)}
          <ListItem 
            leftIcon={createBtn}
            primaryText="Create a group"
            onClick={this.dialogToggle} />

            {(this.props.showHelpTooltips && !this.props.openedTips["#groupHelp"])
              ? <FontIcon id="groupHelp" className="material-icons help-tooltip" style={{right:"10px", bottom:"10px"}}>help</FontIcon> 
              : null
            }
        </List>

      </div>
    );
  }
});


module.exports = Groups;