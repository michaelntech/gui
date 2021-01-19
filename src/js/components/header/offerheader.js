import React from 'react';
import LocalOfferIcon from '@material-ui/icons/LocalOffer';

const OfferHeader = () => (
  <div id="offerHeader" className="offerBox">
    <LocalOfferIcon style={{ marginRight: '2px', height: '16px', verticalAlign: 'bottom' }} />
    <span>
      If you are on a paid plan you can enable <b>Remote terminal</b> for free with your current subscription until March 31st.{' '}
      <a href="https://docs.mender.io/add-ons/remote-terminal" target="_blank">
        Read the documentation to learn how to enable it
      </a>
    </span>
  </div>
);

export default OfferHeader;
