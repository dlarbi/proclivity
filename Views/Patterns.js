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
  TouchableWithoutFeedback
} from 'react-native';

var ProclivityActions = require('../Actions/ProclivityActions');
var ProclivityStore = require('../Stores/ProclivityStore');
var PatternList = require('../components/PatternList');

var Patterns = React.createClass({
  componentDidMount: function() {
  },
  createPattern: function() {

  },
  getPatterns: function() {

  },
  render: function() {
    /*
    <View style={styles.welcome} onPress={ProclivityActions.initialize}>
      <Text style={styles.welcomeHeader}>Patterns</Text>
      <Text style={styles.welcomeBlurb}>See details about your habits.</Text>
    </View>
    */
    return (
      <View>

        <PatternList patterns={this.props.patterns} entries={this.props.entries}/>
      </View>
    )
  }
});

const styles = StyleSheet.create({

  welcome: {
    padding:15,
    backgroundColor: '#1F3233',
  },
  welcomeHeader: {fontSize:18, color:'#fff', alignSelf:'stretch'},
  welcomeBlurb: {fontSize:14, color:'#fff',lineHeight:20,  alignSelf:'stretch'},

});

module.exports = Patterns;
