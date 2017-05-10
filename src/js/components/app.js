import React from 'react';
import Header from './header/header';
import Joyride from 'react-joyride';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RawTheme from '../themes/mender-theme.js';

var isDemoMode = false;

function getState() {
  return {
    isReady: false,
    isRunning: false,
    showHelpTooltips: true,
    openedTips: {}
  }
}


var App = React.createClass({
  childContextTypes: {
    location: React.PropTypes.object,
    muiTheme: React.PropTypes.object
  },
  getChildContext() { 
    var theme = getMuiTheme(RawTheme);
    return {
      muiTheme: theme,
      location: this.props.location
    };
  },
  getInitialState: function() {
    return getState();
  },
  
  addTooltip: function(data) {
    this.refs.joyride.addTooltip(data);
  },
  joyrideCallback: function(data) {

    if (data.type.indexOf("standalone")!==-1) {
      if (data.type==="standalone:after") {
        // update state to mark as opened
        var openedTips = this.state.openedTips;
        openedTips[data.step.selector] = true;
        this.setState({openedTips: openedTips});
      }
    } 
  },
  setHelpTooltips: function(val) {
    this.setState({showHelpTooltips: val});
  },
  render: function() {
    var html = (
      <div className="wrapper fadeIn">
        <Joyride 
          ref="joyride"
          run={true}
          callback={this.joyrideCallback} 
          tooltipOffset={10} />
        <div className="header">
          <Header demo={isDemoMode} history={this.props.history} showHelpTooltips={this.state.showHelpTooltips} setHelpTooltips={this.setHelpTooltips} addTooltip={this.addTooltip} openedTips={this.state.openedTips} />
        </div>
        <div className="container">
          {React.cloneElement(this.props.children, {showHelpTooltips: this.state.showHelpTooltips, setHelpTooltips: this.setHelpTooltips, addTooltip: this.addTooltip, openedTips:this.state.openedTips})}
        </div>
      </div> 
    )
    return (
      <div>{html}</div>
    )
  }
});

module.exports = App;