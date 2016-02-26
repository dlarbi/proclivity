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
  TextInput,
  Dimensions
} from 'react-native';
var moment = require('moment');
var ss = require('simple-statistics');
var ProclivityActions = require('../Actions/ProclivityActions');
var ProclivityStore = require('../Stores/ProclivityStore');

var Connections = React.createClass({
  getInitialState: function() {
    return {
      comparisonPatternName1: 'Sleep',
      comparisonPatternName2: 'Drinking',
      comparisonData1: [],
      comparisonData2: []
    }
  },
  componentDidMount: function() {
    var trendBarItems1 = [];
    var trendBarItems = [];
    var entries = [];
    this.compareData([this.state.comparisonPatternName1, this.state.comparisonPatternName2]);
  },

  componentDidUpdate: function(prevProps, prevState) {
    if(this.state.comparisonPatternName1 != prevState.comparisonPatternName1 || this.state.comparisonPatternName2 != prevState.comparisonPatternName2) {
      this.compareData([this.state.comparisonPatternName1, this.state.comparisonPatternName2]);
    }
  },

  compareData: function(patternNames) {
    var entriesByDay = ProclivityStore.getDayByDayEntryDataByPattern(patternNames[0]);
    var entriesByDay2 = ProclivityStore.getDayByDayEntryDataByPattern(patternNames[1]);
    if(!entriesByDay.length || !entriesByDay2.length) {
      return false;
    }
    console.log('sleeplength', entriesByDay, 'drinkingLenght', entriesByDay2)
    var longerEntries = entriesByDay2.length >= entriesByDay.length ? entriesByDay2 : entriesByDay.length > entriesByDay2.length ? entriesByDay : null;
    var shorterEntries = longerEntries == entriesByDay2 ? entriesByDay : entriesByDay2;
    /*
    * Data sets we will format so we can use in statistics library
    */
    var comparisonData = [];
    var comparisonData2 = [];
    /*
    * If the shorter list of entries starts after the longer list
    */

    if(new Date(shorterEntries[0].EntryDate).getTime() >= new Date(longerEntries[0].EntryDate).getTime()) {

      shorterEntries.forEach(function(shorterEntry, index, shorterEntries) {
        /*
        * If the current interation over the short list is still within the range of the long list
        */
        if(new Date(shorterEntry.EntryDate).getTime() <= new Date(longerEntries[longerEntries.length-1].EntryDate).getTime()) {
          /*
          * Then we know this short list entry will be used, so we add it to the first comparison data
          */
          comparisonData.push(shorterEntry.EntryValue);
        }
      }); //end shorterEntries forEach

      longerEntries.forEach(function(longerEntry, index, longerEntries) {
        /*
        * If the current interation over the long list, has reached the beginning of the short list
        */
        if(new Date(longerEntry.EntryDate).getTime() >= new Date(shorterEntries[0].EntryDate).getTime()) {
          /*
          * And if the current interation over the long list hasn't reached the end of the short list
          */
          if(new Date(longerEntry.EntryDate).getTime() <= new Date(shorterEntries[shorterEntries.length-1].EntryDate).getTime()) {
            /*
            * Then we know this will be used, and we add it to the second comparison data
            */
            comparisonData2.push(longerEntry.EntryValue)
          }
        }
      }); //end longerEntries forEach
    } else {
      console.log('meeeep',longerEntries[0].EntryDate)

      /*
      * else The shorter list starts before the longer list
      */
      shorterEntries.forEach(function(shorterEntry, index, shorterEntries) {
        /*
        * If the current interation over the short list, has reached the beginning of the long list
        */
        console.log('moop', new Date(shorterEntry.EntryDate).getTime(), new Date(longerEntries[0].EntryDate).getTime())
        if(new Date(shorterEntry.EntryDate).getTime() >= new Date(longerEntries[0].EntryDate).getTime()) {
          comparisonData.push(shorterEntry.EntryValue);
        }

      }); //end shorterEntries forEach

      longerEntries.forEach(function(longerEntry, index, longerEntries) {
        /*
        * If the current interation of the long list is within the range of the short list
        */
        if(new Date(longerEntry.EntryDate).getTime() <= new Date(shorterEntries[shorterEntries.length-1].EntryDate).getTime()) {
          comparisonData2.push(longerEntry.EntryValue);
        }

      }); //end shorterEntries forEach
    }
    console.log('Comparison data!', comparisonData, comparisonData2)
    this.setState({
      comparisonData1: comparisonData,
      comparisonData2: comparisonData2
    });

  },


  render: function() {
    var covariance, correlation;

    if(this.state.comparisonData1.length) {
      var samples = [this.state.comparisonData1, this.state.comparisonData2];
      covariance = ss.sampleCovariance(samples[0], samples[1])
      correlation = ss.sampleCorrelation(samples[0], samples[1]);
    }
    console.log(Math.abs(correlation), correlation)
    var insightBlock = Math.abs(correlation) < .5 ?
      <View style={styles.insightBlock}>
        <Text style={styles.connectionsHeader}>Moderately Connected</Text>
        <Text style={styles.connectionsBlurb}>Changes in {this.state.comparisonPatternName1} appear related to changes in {this.state.comparisonPatternName2}.</Text>
      </View> : Math.abs(correlation) > .5 ?
      <View style={styles.insightBlock}>
        <Text style={styles.connectionsHeader}>Strongly Connected</Text>
        <Text style={styles.connectionsBlurb}>Changes in {this.state.comparisonPatternName1} appear closely related to changes in {this.state.comparisonPatternName2}.</Text>
      </View> : null;

    var insightBlock2 = covariance > 0 ?
    <View style={styles.insightBlock}>
      <Text style={styles.connectionsHeader}>Positive relationship</Text>
      <Text style={styles.connectionsBlurb}>Increases in {this.state.comparisonPatternName1} appear related to increases in {this.state.comparisonPatternName2}.</Text>
    </View> :
    <View style={styles.insightBlock}>
      <Text style={styles.connectionsHeader}>Negative relationship</Text>
      <Text style={styles.connectionsBlurb}>Increases in {this.state.comparisonPatternName1} appear related to decreases in {this.state.comparisonPatternName2}.</Text>
    </View>;
    /*
    <View style={styles.welcome} onPress={ProclivityActions.initialize}>
      <Text style={styles.welcomeHeader}>Discover and Analyze</Text>
      <Text style={styles.welcomeBlurb}>Connections between your habits.</Text>
    </View>
    */
    return (
      <View>
        <View style={{padding:15}}>
          <Text style={[styles.connectionsHeader, {marginBottom:15}]}>Choose two activities to discover connections</Text>

          <TextInput style={{width:Dimensions.get('window').width-30, marginBottom:15,padding:10,height:35, backgroundColor:'#fff', borderRadius:6}}
                    placeholder={'Activity one'}
                    onChangeText={(text) => this.setState({comparisonPatternName1: text})}
                    value={this.state.comparisonPatternName1}/>
          <TextInput style={{width:Dimensions.get('window').width-30, marginBottom:15, height:35, padding:10, backgroundColor:'#fff', borderRadius:6}}
                      placeholder={'Activity two'}
                      onChangeText={(text) => this.setState({comparisonPatternName2: text})}
                      value={this.state.comparisonPatternName2}/>

        </View>
        <View>
          {insightBlock}
          {insightBlock2}

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
  connectionsHeader: {fontSize:18, color:'#555'},
  connectionsBlurb: {fontSize:14, color:'#999'},
  insightBlock: {padding:15, borderTopColor:'#ddd', borderTopWidth:1}
});

module.exports = Connections;
