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
  Dimensions,
  ScrollView
} from 'react-native';


var ProclivityActions = require('../Actions/ProclivityActions');
var ProclivityStore = require('../Stores/ProclivityStore');


import BarChart from '../components/BarChart';

var PatternList = React.createClass({
  render: function() {
    var patternList = [];
    if(this.props.patterns) {
      for(var i=0;i<this.props.patterns.length;i++) {
        var entries = [];

        for(var j=0;j<this.props.entries.length;j++) {
          if(this.props.entries[j].EntryName == this.props.patterns[i].PatternName) {
            entries.push(this.props.entries[j]);
          }
        }
        patternList.push(
          <View style={styles.patternBox} key={i}>
            <Text style={styles.patternBoxTitle}>{this.props.patterns[i].PatternName}</Text>
            <Text style={styles.patternBoxSubTitle}>{this.props.patterns[i].EntryCount} entries</Text>
            <BarChart entries={entries} width={(Dimensions.get('window').width/2)-20}/>
          </View>)
      }
    }

    return (
      <View style={styles.patternListWrapper}>
        {patternList}
      </View>
    )
  }
});

const styles = StyleSheet.create({
  patternListWrapper: {flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-start' },
  patternBox: { padding:10,
    width:Dimensions.get('window').width/2,
    borderBottomColor:'#ddd',
    borderBottomWidth:1,
  },
  patternBoxTitle: {
    fontSize:16
  },
  patternBoxSubTitle: {
    color:'#ccc',
    fontSize:12
  }
});

module.exports = PatternList;
