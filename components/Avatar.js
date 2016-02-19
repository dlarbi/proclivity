/**
 * Proclivity
 * By: Dean Larbi
 */
'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Image
} from 'react-native';

var ProclivityActions = require('../Actions/ProclivityActions');
var ProclivityStore = require('../Stores/ProclivityStore');

var Avatar = React.createClass({
  render: function() {
    var styles = StyleSheet.create({
      avatar: {
        height: this.props.height,
        width: this.props.width,
        borderRadius: this.props.width/2
      },
    });
    return (
      <Image style={styles.avatar} source={this.props.source}>

      </Image>
    )
  }
});



module.exports = Avatar;
