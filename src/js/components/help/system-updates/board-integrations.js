import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class ApplicationUpdates extends React.Component {
  static contextTypes = {
    router: PropTypes.object
  };

  render() {

    return (
      <div>
        <h2>Application Updates</h2>
        <hr className="help-hr"/>
        <p></p>

       
        <p>The <Link to={`getting-started/`}>System updates section</Link> has several help pages to get you started enabling and connecting your devices for system updates.</p>
   
      
      </div>
    );
  }
}
