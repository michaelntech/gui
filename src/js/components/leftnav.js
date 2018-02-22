import React from 'react';
var createReactClass = require('create-react-class');

// material ui
import { List, ListItem } from 'material-ui/List';

var listItems = [
  {route:"/", text:"Dashboard"},
  {route:"/devices", text:"Devices"},
  {route:"/artifacts", text:"Artifacts"},
  {route:"/deployments", text:"Deployments"},
];

var LeftNav = createReactClass({

	render: function() {
		var self = this;

		var tab = self.props.currentTab || "/";
	
    var list = listItems.map(function(item, index) {
    	var borderTop = index===0 ? "none !important" : "1px solid #eaf4f3"; 
      var style = tab===item.route ? {backgroundColor: "#ffffff", marginRight: "-2px", borderTop: borderTop, borderBottom: "1px solid #eaf4f3", transition: "all 100ms cubic-bezier(0.23, 1, 0.32, 1) 0ms"} : {transition: "all 100ms cubic-bezier(0.23, 1, 0.32, 1) 0ms"};
    
       return (
          <ListItem
            key={index}
            style={style}
            primaryText={item.text}
            onClick={self.props.changeTab.bind(null, item.route)}
            innerDivStyle={{padding:"22px 16px 22px 42px"}} />
       )
    });

		return (
			<List style={{padding:"0"}}>
        {list}
      </List>
		)
	}
});

module.exports = LeftNav;