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
  Dimensions
} from 'react-native';

var ProclivityActions = require('../Actions/ProclivityActions');
var ProclivityStore = require('../Stores/ProclivityStore');

var Question = React.createClass({
  render: function() {
    return (
      <View style={styles.questionWrapper} >

      <Text style={styles.question}>
        Did you get in any arguments today?
      </Text>
      <TriangleCorner style={{}}/>
      </View>
    )
  }
});

var TriangleCorner = React.createClass({
  render: function() {
    return (
      <View style={[styles.triangleCorner, this.props.style]} />
    )
  }
});

const styles = StyleSheet.create({
  questionWrapper: {
    flexDirection: 'column',
  },
  question: {
    textAlign:'center',
    fontSize: 24,
    padding: 30,
    paddingTop:20,
    lineHeight:35,
    color:'#fff',
    backgroundColor: '#40EFD4',
    flexDirection: 'row',
    width: Dimensions.get('window').width
  },
  triangleCorner: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightWidth: 20,
    borderTopWidth: 20,
    borderRightColor: 'transparent',
    borderTopColor: '40EFD4',
    flexDirection: 'row',
    marginLeft:50
  },
});

module.exports = Question;
