import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route } from 'react-router';
import HelpTopics from './helptopics';
import LeftNav from './left-nav';
import ConnectingDevices from './connecting-devices';
import ProvisionDemo from './connecting-devices/provision-a-demo';
import VirtualDevice from './connecting-devices/virtual-device';

var createReactClass = require('create-react-class');
var AppStore = require('../../stores/app-store');
var AppActions = require('../../actions/app-actions');

var Help =  createReactClass({
  getInitialState: function() {
    return {
      snackbar: AppStore.getSnackbar(),
      hasMultitenancy: AppStore.hasMultitenancy(),
      pages: {
        "connecting-devices": {
          title: "Connecting devices",
          component: <ConnectingDevices />,
          "provision-a-demo": {
            title: "Provision a demo",
            component: <ProvisionDemo />,
            "virtual-device": {
              title: "Virtual device",
              component: <VirtualDevice />,
            },
          },
        },
      },
    };
  },
  componentDidMount: function() {
    this._getUserOrganization();
  },
  _getUserOrganization: function() {
    var self = this;
    var callback = {
      success: function(org) {
        self.setState({org: org});
      },
      error: function(err) {
        console.log("Error: " +err);
      }
    };
    AppActions.getUserOrganization(callback);
  },

  componentWillMount: function() {
    AppStore.changeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState(this.getInitialState());
  },

  render: function() {
 

    if (this.props.params.splat) {
      var splitsplat = this.props.params.splat.split("/");
      var urlToReference = this.state.pages;
      for (var i=0;i<splitsplat.length; i++) {

        if (i === splitsplat.length-1) {
          urlToReference = urlToReference[splitsplat[i]].component
        } else {
          urlToReference = urlToReference[splitsplat[i]];
        }
      }
    }


    return (
      <div className="margin-top">
        <div className="leftFixed">
          <LeftNav pages={this.state.pages} />
        </div>
        <div className="rightFluid padding-right">
          <div className="margin-top-small">
            {urlToReference || <HelpTopics />}
          </div>
        </div>
      </div>
    )
  }

});

Help.contextTypes = {
  router: PropTypes.object,
};

module.exports = Help;