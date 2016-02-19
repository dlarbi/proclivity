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
  View
} from 'react-native';

var ProclivityActions = require('../Actions/ProclivityActions');
var ProclivityStore = require('../Stores/ProclivityStore');

var Connections = React.createClass({
  render: function() {
    return (
      <View style={styles.welcome} onPress={ProclivityActions.initialize}>
        <Text style={styles.welcomeHeader}>Discover and Analyze</Text>
        <Text style={styles.welcomeBlurb}>Connections between your habits.</Text>
      </View>
    )
  }
});

const styles = StyleSheet.create({
  welcome: {
    padding:15,
    backgroundColor: '#333',
    shadowColor: "#000000",
    shadowOpacity: 0.8,
    shadowRadius: 2,
    shadowOffset: {
      height: 1,
      width: 0
    }
  },
  welcomeHeader: {fontSize:18, color:'#fff', alignSelf:'stretch'},
  welcomeBlurb: {fontSize:14, color:'#fff',lineHeight:20,  alignSelf:'stretch'},
});

module.exports = Connections;
