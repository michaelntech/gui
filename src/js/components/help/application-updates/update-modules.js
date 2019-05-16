import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class UpdateModules extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {
   
    return (
      <div>
        <h2>Provision a demo device</h2>
        <p>
          For demo and testing purposes, we provide pre-built demo images for the Raspberry Pi 3 and BeagleBone Black devices with the latest version of Mender.
        </p>
        <p>
          We also include a virtual device for you to test with, which is handy because it means that you can test Mender without having to configure any
          hardware.
        </p>

      </div>
    );
  }
}
