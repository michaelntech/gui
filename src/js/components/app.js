import React from 'react';
import Header from './header/header';
import Joyride from 'react-joyride';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import RawTheme from '../themes/mender-theme.js';

import Welcome from './joyride/welcome';
import AuthRequest from './joyride/authrequest';
import VirtualDevice from './joyride/virtualdevice';
import UploadArtifact from './joyride/uploadartifact';
import CreateDeployment from './joyride/createdeployment';

var isDemoMode = false;

function getState() {
  return {
    isReady: false,
    isRunning: false,
    steps: [],
    selector: '',
    showOverlay: true,
    autoStart: true,
    disableOverlay: true,
    locale: {
      back: 'Back',
      close: 'Close',
      last: 'Finish',
      next: 'Next',
      skip: 'Skip tutorial'
    },
    holePadding: 0,
    showHelpTooltips: false,
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
  componentDidMount: function() {
    var steps = [{
        title: 'Welcome to Mender!',
        text: <Welcome joyrideSkip={this.setSkip} joyrideStep={this.setStep} startJoyride={this.startJoyride} />,
        selector: '#joyrideStart',
        position: 'bottom',
        type: 'hover',
        isFixed: false
      },
      {
        title: 'Authorize your first virtual device',
        text: <AuthRequest joyrideSkip={this.setSkip} joyrideStep={this.setStep} />,
        selector: '.review-devices',
        position: 'bottom',
        type: 'hover',
        isFixed: false,
        allowClicksThruHole: true
      },
      {
        title: 'Authorize your virtual device',
        text: <VirtualDevice joyrideSkip={this.setSkip} clicked={false} />,
        selector: "#auth0",
        position: 'bottom',
        type: 'hover',
        isFixed: false,
        allowClicksThruHole: true
      },
      {
        title: 'Authorize your virtual device',
        text: <VirtualDevice joyrideSkip={this.setSkip} clicked={true} />,
        selector: ".joyride-accept",
        position: 'right',
        type: 'hover',
        isFixed: false,
        allowClicksThruHole: true
      },
      {
        title: 'Your device is now authorized!',
        text: <VirtualDevice joyrideStep={this.setStep} joyrideSkip={this.setSkip} clicked={true} accepted={true} />,
        selector: "#deviceList",
        position: 'bottom',
        type: 'hover',
        isFixed: false,
        allowClicksThruHole: true
      },
      {
        title: 'Upload a Mender Artifact',
        text: <UploadArtifact joyrideSkip={this.setSkip} />,
        selector: "#Artifacts",
        position: 'bottom',
        type: 'hover',
        isFixed: false,
        allowClicksThruHole: true
      },
      {
        title: 'Upload a Mender Artifact',
        text: <UploadArtifact joyrideSkip={this.setSkip} loaded={true} />,
        selector: "#dropzoneContainer",
        position: 'bottom',
        type: 'hover',
        isFixed: false,
        allowClicksThruHole: true
      },
      {
        title: 'Deploy the Artifact to the device',
        text: <UploadArtifact joyrideSkip={this.setSkip} uploaded={true} />,
        selector: "#Deployments",
        position: 'bottom',
        type: 'hover',
        isFixed: false,
        allowClicksThruHole: true
      },
      {
        title: 'Create a deployment',
        text: <CreateDeployment joyrideSkip={this.setSkip} />,
        selector: "#deploymentButton",
        position: 'bottom',
        type: 'hover',
        isFixed: false,
        allowClicksThruHole: true
      },
      {
        title: 'Create a deployment',
        text: <CreateDeployment joyrideSkip={this.setSkip} clicked={true} />,
        selector: "#selectArtifact",
        position: 'right',
        type: 'hover',
        isFixed: false,
        allowClicksThruHole: true
      },
      {
        title: 'Create a deployment',
        text: <CreateDeployment joyrideSkip={this.setSkip} artifact={true} />,
        selector: "#selectGroup",
        position: 'right',
        type: 'hover',
        isFixed: false,
        allowClicksThruHole: true
      },
      {
        title: 'Create a deployment',
        text: <CreateDeployment joyrideSkip={this.setSkip} ready={true} />,
        selector: "#submitButton",
        position: 'top',
        type: 'hover',
        isFixed: false,
        allowClicksThruHole: true
      },
      {
        title: 'You\'re all set!',
        text: <CreateDeployment joyrideSkip={this.setSkip} created={true} />,
        selector: "#tutorialEnd",
        position: 'top',
        type: 'hover',
        isFixed: false,
        allowClicksThruHole: true
      },
    ];
    this.addSteps(steps);

    setTimeout(() => {
      this.setState({
        isReady: true
      });
    }, 100);
  },
  componentDidUpdate (prevProps, prevState) {
  
  },
  addSteps: function(steps) {
    var joyride = this.refs.joyride;

    if (!Array.isArray(steps)) {
        steps = [steps];
    }

    if (!steps.length) {
        return false;
    }

    this.setState(function(currentState) {
        currentState.steps = currentState.steps.concat(steps);
        return currentState;
    });
  },
  clearSteps: function() {
    this.setState({steps: []});
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

    } else {
      this.setState({
        joyrideCurrent: data.index,
        showOverlay: (data.step || {}).selector === "#logo" ? false : true
      });
    }
   
    
  },
  resetJoyride: function() {
    this.clearSteps();
    this.refs.joyride.reset(true);
  },
  runJoyride: function(val) {
    this.setState({isRunning: val});
  },
  next: function() {
    this.refs.joyride.next();
  },
  setStep: function(i) {
    this.setState({
      joyrideStepIndex: i,
      holePadding: (i>0 && i<12) ? 3 : 0 
    });
  },
  setSkip: function() {
    this.resetJoyride();
    this.runJoyride(false);
    this.setHelpTooltips(true);
  },
  startJoyride: function() {
    this.setState({startedJoyride: true});
  },
  setHelpTooltips: function(val) {
    this.setState({showHelpTooltips: val});
  },
  render: function() {

    if (this.state.isReady) {
      var html = (
        <div className="wrapper fadeIn">
          <Joyride 
            ref="joyride"
            stepIndex={this.state.joyrideStepIndex}
            steps={this.state.steps} 
            run={this.state.isRunning} 
            callback={this.joyrideCallback} 
            showOverlay={this.state.showOverlay}
            showSkipButton={true}
            autoStart={this.state.autoStart}
            type="single"
            disableOverlay={this.state.disableOverlay}
            locale={this.state.locale}
            holePadding={this.state.holePadding}
            tooltipOffset={10} />
          <div className="header">
            <Header demo={isDemoMode} history={this.props.history} joyrideStep={this.setStep} joyrideRun={this.runJoyride} joyrideCurrent={this.state.joyrideCurrent} showHelpTooltips={this.state.showHelpTooltips} setHelpTooltips={this.setHelpTooltips} addTooltip={this.addTooltip} openedTips={this.state.openedTips} />
          </div>
          <div className="container">
            {React.cloneElement(this.props.children, {resetJoyride: this.resetJoyride, joyrideRun:this.runJoyride, joyrideStep: this.setStep, joyrideSkip: this.setSkip, joyrideCurrent: this.state.joyrideCurrent, showHelpTooltips: this.state.showHelpTooltips, setHelpTooltips: this.setHelpTooltips, addTooltip: this.addTooltip, openedTips:this.state.openedTips})}
          </div>
        </div> 
      )
    } else {
      var html = ''
    }
    return (
      <div>{html}</div>
    )
  }
});

module.exports = App;