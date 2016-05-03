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
  TouchableWithoutFeedback,
  Dimensions
} from 'react-native';
var moment = require('moment');
var { Icon } = require('react-native-icons');
var Modal = require('react-native-modalbox');
var ss = require('simple-statistics');
var ProclivityActions = require('../Actions/ProclivityActions');
var ProclivityStore = require('../Stores/ProclivityStore');

var Connections = React.createClass({
  getInitialState: function() {
    return {
      comparisonPatternName1: ProclivityStore.getPatterns()[0].PatternName,
      comparisonPatternName2: ProclivityStore.getPatterns()[1].PatternName,
      patterns: [],
      selectingPattern: null,
      comparisonData1: [],
      comparisonData2: []
    }
  },
  componentDidMount: function() {
    var trendBarItems1 = [];
    var trendBarItems = [];
    var entries = [];
    this.compareData([this.state.comparisonPatternName1, this.state.comparisonPatternName2]);
    ProclivityActions.getPatterns();
    ProclivityStore.addChangeListener(this._onChange);
  },

  _onChange: function() {
    this.setState({
      patterns: ProclivityStore.getPatterns()
    })
  },
  setComparisonPatternName1: function(value) {
    this.setState({
      comparisonPatternName1:value
    })
    this.refs.createEntryModal.close()
  },
  setComparisonPatternName2: function(value) {
    this.setState({
      comparisonPatternName2:value
    })
    this.refs.createEntryModal.close()
  },
  componentDidUpdate: function(prevProps, prevState) {
    if(this.state.comparisonPatternName1 != prevState.comparisonPatternName1 || this.state.comparisonPatternName2 != prevState.comparisonPatternName2) {
      this.compareData([this.state.comparisonPatternName1, this.state.comparisonPatternName2]);
    }
  },
  componentWillUnmount: function() {
    //ProclivityStore.removeChangeListener(this._onChange);
  },

  compareData: function(patternNames) {
    var entriesByDay = ProclivityStore.getDayByDayEntryDataByPattern(patternNames[0]);
    var entriesByDay2 = ProclivityStore.getDayByDayEntryDataByPattern(patternNames[1]);
    if(!entriesByDay.length || !entriesByDay2.length) {
      return false;
    }
    console.log('entries1', entriesByDay, 'entries2', entriesByDay2)
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

  openCreateEntryModal: function(patternNumber) {
    this.refs.createEntryModal.open()
    this.setState({
      selectingPattern: patternNumber
    })
    console.log('open', this.state.patterns)
  },
  render: function() {
    var covariance, correlation;
    var self = this;
    if(this.state.comparisonData1.length) {
      var samples = [this.state.comparisonData1, this.state.comparisonData2];
      covariance = ss.sampleCovariance(samples[0], samples[1])
      correlation = ss.sampleCorrelation(samples[0], samples[1]);
    }

    /*
    * Decide the message to show, based on the covariance and correlation values.
    */
    var insightBlock = Math.abs(correlation) < .5 ?
      <View style={styles.insightBlock}>
        <View style={{alignItems:'center'}}>
          <Icon
            name='fontawesome|adjust'
            size={25}
            color='#777'
            style={{width:25,height:25, margin:10}}
          />
        </View>
        <View>
          <Text style={styles.connectionsHeader}>Moderately Connected</Text>
          <Text style={styles.connectionsBlurb}>Changes in {this.state.comparisonPatternName1} appear related to changes in {this.state.comparisonPatternName2}.</Text>
        </View>
      </View> : Math.abs(correlation) > .5 ?
      <View style={styles.insightBlock}>
        <View style={{alignItems:'center'}}>
          <Icon
            name='fontawesome|anchor'
            size={25}
            color='#777'
            style={{width:25,height:25, margin:10}}
          />
        </View>
        <View>
        <Text style={styles.connectionsHeader}>Strongly Connected</Text>
        <Text style={styles.connectionsBlurb}>Changes in {this.state.comparisonPatternName1} appear closely related to changes in {this.state.comparisonPatternName2}.</Text>
        </View>
      </View> : null;

    var insightBlock2 = covariance > 0 ?
    <View style={styles.insightBlock}>
      <View>
        <View style={{alignItems:'center'}}>
          <View style={{alignItems:'center', flexDirection:'row'}}>
            <Icon
              name='fontawesome|long-arrow-up'
              size={25}
              color='#9bc34b'
              style={{width:25,height:25, margin:2, marginTop:10, marginBottom:10}}
            />
            <Icon
              name='fontawesome|long-arrow-up'
              size={25}
              color='#9bc34b'
              style={{width:25,height:25, margin:2,marginTop:10, marginBottom:10}}
            />
          </View>
        </View>
        <Text style={styles.connectionsHeader}>Positive relationship</Text>
        <Text style={styles.connectionsBlurb}>Increases in {this.state.comparisonPatternName1} appear related to increases in {this.state.comparisonPatternName2}.</Text>
      </View>
    </View> :
    <View style={styles.insightBlock}>
      <View style={{alignItems:'center'}}>
        <View style={{alignItems:'center', flexDirection:'row'}}>
          <Icon
            name='fontawesome|long-arrow-up'
            size={25}
            color='#9bc34b'
            style={{width:25,height:25, margin:2, marginTop:10, marginBottom:10}}
          />
          <Icon
            name='fontawesome|long-arrow-down'
            size={25}
            color='#FB3258'
            style={{width:25,height:25, margin:2,marginTop:10, marginBottom:10}}
          />
        </View>
      </View>
      <Text style={styles.connectionsHeader}>Negative relationship</Text>
      <Text style={styles.connectionsBlurb}>Increases in {this.state.comparisonPatternName1} appear related to decreases in {this.state.comparisonPatternName2}.</Text>
    </View>;

    /*
    * Build the list of selectable patterns, so the user can choose 2 patterns to compare
    */
    var patternOptions = [];
    this.state.patterns.forEach(function(pattern, index, patterns) {
      var onPress = self.state.selectingPattern == 1 ? self.setComparisonPatternName1.bind(self, pattern.PatternName) : self.setComparisonPatternName2.bind(self, pattern.PatternName);
      patternOptions.push(
        <TouchableWithoutFeedback onPress={onPress}>
          <View style={{alignSelf:'stretch', padding:15}}>
            <Text>{pattern.PatternName}</Text>
          </View>
        </TouchableWithoutFeedback>
      )
    });
    var buttonWidth = (Dimensions.get('window').width/2);

    console.log('CO COV VALUES', correlation, covariance)
    return (
      <View>
        <View style={{flexDirection:'column', flexWrap:'wrap', justifyContent:'flex-start'}}>
          <View style={{padding:15, paddingBottom:0}}>
            <Text style={[styles.connectionsHeader, {marginBottom:15}]}>Choose two activities to discover connections</Text>
          </View>
          <View style={{flexDirection:'row'}}>

          <TouchableWithoutFeedback onPress={this.openCreateEntryModal.bind(this, 1)}>
            <View style={[styles.selectPatternButton,{width:buttonWidth}]}>
            <Text style={{color:'#fff'}}>{this.state.comparisonPatternName1}</Text>
            <Icon
              name='fontawesome|edit'
              size={14}
              color='#fff'
              style={{width:14,height:14, margin:2,position:'absolute', top:16, right:15, }}
            />
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback onPress={this.openCreateEntryModal.bind(this, 2)}>
            <View style={[styles.selectPatternButton,{width:buttonWidth}]}>
            <Text style={{color:'#fff'}}>{this.state.comparisonPatternName2}</Text>
            <Icon
              name='fontawesome|edit'
              size={14}
              color='#fff'
              style={{width:14,height:14, margin:2,position:'absolute', top:16, right:15}}
            />
            </View>
          </TouchableWithoutFeedback>
          </View>


        </View>
        <View>
          {insightBlock}
          {insightBlock2}

          <Text>Correlation: {correlation}</Text>
          <Text>Covariance: {covariance}</Text>
        </View>
        <Modal ref="createEntryModal" style={[styles.modal, styles.createEntryModal]} swipeToClose={true} swipeThreshold={10}>
          <View style={{flexDirection:'column'}} >
            <Text style={styles.createEntryModalHeader}>
              Choose a pattern to analyze
            </Text>
            {patternOptions}
          </View>
        </Modal>

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
  insightBlock: {padding:15, borderTopColor:'#ddd', borderTopWidth:1},
  createEntryModal: {},
  modal: {
   justifyContent: 'center',
   flexDirection:'row'
  },
  selectPatternButton: {padding:15, backgroundColor:'#40EFD4',flexDirection:'row',borderRightWidth:1, borderRightColor:'#79efd4'},
  createEntryModalHeader: {
    textAlign:'center',
    fontSize: 18,
    padding: 30,
    color:'#fff',
    backgroundColor: '#40EFD4',
    width: Dimensions.get('window').width,
    flexDirection:'row',
    marginBottom:10
  },
});

module.exports = Connections;
