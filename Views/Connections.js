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
var moment = require('moment');
var ss = require('simple-statistics');
var ProclivityActions = require('../Actions/ProclivityActions');
var ProclivityStore = require('../Stores/ProclivityStore');

var Connections = React.createClass({
  getInitialState: function() {
    return {
      comparisonData1: [],
      comparisonData2: []
    }
  },
  componentDidMount: function() {
    var trendBarItems1 = [];
    var trendBarItems = [];
    var entries = [];

    this.setComparisonData1('Sleep');
    this.setComparisonData2('Drinking');
    console.log('MEEP',ProclivityStore.getDayByDayEntryDataByPattern('Sleep'), ProclivityStore.getDayByDayEntryDataByPattern('Drinking'))
  },
  setComparisonData1: function(patternName) {
    this.setState({
      comparisonData1: ProclivityStore.getDayByDayEntryDataByPattern(patternName)
    });
  },
  setComparisonData2: function(patternName) {
    this.setState({
      comparisonData2: ProclivityStore.getDayByDayEntryDataByPattern(patternName)
    });
  },
  render: function() {
    var covariance, correlation;
    if(this.state.comparisonData1.length) {
      var samples = [this.state.comparisonData1, this.state.comparisonData2];
      covariance = ss.sampleCovariance(samples[0], samples[1])
      correlation = ss.sampleCorrelation(samples[0], samples[1]);
    }
    return (
      <View>
        <View style={styles.welcome} onPress={ProclivityActions.initialize}>
          <Text style={styles.welcomeHeader}>Discover and Analyze</Text>
          <Text style={styles.welcomeBlurb}>Connections between your habits.</Text>
        </View>
        <View>
          <Text>Correlation: {correlation}</Text>
          <Text>Covariance: {covariance}</Text>
        </View>
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

module.exports = Connections;
