import React from 'react';
import PropTypes from 'prop-types';
import { Router, Route } from 'react-router';
import HelpTopics from './helptopics';
import ConnectingDevices from './connecting-devices';
import ProvisionDemo from './connecting-devices/provision-a-demo';

var createReactClass = require('create-react-class');
var AppStore = require('../../stores/app-store');
var AppActions = require('../../actions/app-actions');

// material ui

var Help =  createReactClass({
  getInitialState: function() {
    return {
      snackbar: AppStore.getSnackbar(),
      hasMultitenancy: AppStore.hasMultitenancy(),
    };
  },

  componentWillMount: function() {
    AppStore.changeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AppStore.removeChangeListener(this._onChange);
  },

  componentDidMount: function() {
    console.log(this.props.params.splat);
  },

  _onChange: function() {
    this.setState(this.getInitialState());
  },

  render: function() {
    var routes = {
      "connecting-devices": {
        component: <ConnectingDevices />,
        "provision-a-demo": {
          component: <ProvisionDemo />,
       
        },
      },
    };

    var splitsplat = this.props.params.splat.split("/");
    var urlToReference = routes;
    for (var i=0;i<splitsplat.length; i++) {

      if (i === splitsplat.length-1) {
        urlToReference = urlToReference[splitsplat[i]].component
      } else {
        urlToReference = urlToReference[splitsplat[i]];
      }
    }

    return (
      <div className="margin-top">
        <div className="leftFixed">
          Sidebar nav
        </div>
        <div className="rightFluid padding-right">
          {urlToReference || <HelpTopics />}
        </div>
      </div>
    )
  }

});

Help.contextTypes = {
  router: PropTypes.object,
};

module.exports = Help;