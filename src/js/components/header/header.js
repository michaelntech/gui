import React from 'react';
import { Router, Route, Link } from 'react-router';
import cookie from 'react-cookie';
import Welcome from '../joyride/welcome';
var AppActions = require('../../actions/app-actions');

import { Tabs, Tab } from 'material-ui/Tabs';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import FontIcon from 'material-ui/FontIcon';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';
import InfoIcon from 'react-material-icons/icons/action/info-outline';


var menuItems = [
  {route:"/", text:"Dashboard"},
  {route:"/devices", text:"Devices"},
  {route:"/artifacts", text:"Artifacts"},
  {route:"/deployments", text:"Deployments"},
];

var styles = {
  tabs: {
    backgroundColor: "#f7f7f7",
    color: "#414141",
  },
  inkbar: {
    backgroundColor: "#7D3F69"
  }
};

var tab = 0;

var Header = React.createClass({
  getInitialState: function() {
    return {
      tabIndex: this._updateActive()
    };
  },
  componentWillMount: function() {
    this.setState({tabIndex: this._updateActive()});
  },
  componentWillReceiveProps: function(nextProps) {
    this.setState({tabIndex: this._updateActive()});
  },
  componentDidUpdate: function(prevProps, prevState) {
    var self = this;
    // joyride
    if (prevState.tabIndex !== self.state.tabIndex) {
      if (!self.props.joyrideCurrent && self.context.router.isActive({ pathname: '/' }, true)) {
        self.props.joyrideStep(0);
        setTimeout(function() {
          self.props.joyrideRun(true);
        }, 200);
      } else if (!self.props.joyrideCurrent && !(self.context.router.isActive({ pathname: '/' }, true))) {
        self.props.joyrideRun(false);
      }
    }
  },
  componentDidMount: function() {
    // joyride
    if (!this.props.joyrideCurrent && this.context.router.isActive({ pathname: '/' }, true)) {
      this.props.joyrideStep(0);
      this.props.joyrideRun(true);
    }
    this._addTooltips();
  },
  _addTooltips: function() {
    // joyride
    this.props.addTooltip({
      text: 'The dashboard gives you an at-a-glance overview of your ongoing and most recent deployments.',
      selector: '#Dashboard',
      trigger: '#DashboardHelp',
      position: 'bottom'
    })
  },
  _updateActive: function() {
    return this.context.router.isActive({ pathname: '/' }, true) ? '/' :
      this.context.router.isActive('/devices') ? '/devices' :
      this.context.router.isActive('/artifacts') ? '/artifacts' : 
      this.context.router.isActive('/deployments') ? '/deployments' : '/';
  },
  _handleTabActive: function(tab) {
    this.context.router.push(tab.props.value);
  },
  changeTab: function() {
    AppActions.setSnackbar("");
  },
  _logOut: function() {
    cookie.remove('JWT');
    this.context.router.push("/login");
  },
  render: function() {
    var tabHandler = this._handleTabActive;
    var self = this;
   
    var menu = menuItems.map(function(item, index) { 
      return (
        <Tab key={index}
          style={styles.tabs}
          label={item.text}
          value={item.route}
          onActive={tabHandler}
          id={item.text} />
      )
    });
    var iconButtonElement = (
      <IconMenu style={{marginTop: "5px"}}
        iconButtonElement={<IconButton><FontIcon className="material-icons">settings</FontIcon></IconButton>}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem primaryText="Log out" onClick={this._logOut} />
      </IconMenu>
    );
    return (
      <div className={this.context.router.isActive('/login') ? "hidden" : null}>
        <Toolbar style={{backgroundColor: "#fff"}}>
          <ToolbarGroup key={0} className="float-left">
              <Link to="/" id="logo"></Link>
          </ToolbarGroup>

          {this.props.demo ? <div id="demoBox"><InfoIcon style={{marginRight:"6px", height:"16px", verticalAlign:"bottom"}} />Mender is currently running in <b>demo mode</b>. <a href="https://docs.mender.io/Administration/Production-installation" target="_blank">See the documentation</a> for help switching to production mode</div> : null }


          <ToolbarGroup key={1} className="float-right">
            {iconButtonElement}
          </ToolbarGroup>
        </Toolbar>
        <div id="joyrideStart" style={{width:"100%", height:"0"}}></div>
        
        <div id="header-nav">
          <Tabs
            value={this.state.tabIndex}
            inkBarStyle={styles.inkbar}
            onChange={this.changeTab}
            tabItemContainerStyle={{backgroundColor:"inherit"}}>
            {menu}
          </Tabs>
        { !self.props.openedTips["#Dashboard"]
          ? 
          <FontIcon id="DashboardHelp" className={self.props.showHelpTooltips ? "material-icons help-tooltip" : "hidden"} style={{left:"20px", top:"10px"}}>help</FontIcon>
          :
          null
        }
        </div>

      </div>
    );
  }
});

Header.contextTypes = {
  router: React.PropTypes.object,
};

module.exports = Header;