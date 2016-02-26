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
  Image,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
var { Icon } = require('react-native-icons');

var ProclivityActions = require('../Actions/ProclivityActions');
var ProclivityStore = require('../Stores/ProclivityStore');
var ActivityCategoryBlock = require('./ActivityCategoryBlock');
var moment = require('moment');

var ActivityGrid = React.createClass({

  getInitialState: function() {
    return {
      activitiesFilter: ''
    }
  },

  deleteEntry: function(EntryID, EntryName) {
    ProclivityActions.deleteEntry(EntryID);
    ProclivityActions.deletePatternEntry(EntryName);
  },

  increaseEntryValue: function(EntryID) {
    ProclivityActions.increaseEntryValue(EntryID);
  },

  decreaseEntryValue: function(EntryID) {
    ProclivityActions.decreaseEntryValue(EntryID);
  },

  render: function() {
    var activityCategoryBlocks = []

    if(this.props.entries && this.props.patterns) {
      for(var j=0;j<this.props.patterns.length;j++) {
        if(this.props.patterns[j].PatternName.indexOf(this.state.activitiesFilter) > -1) {
          var activityList = [];

          for(var i=0;i<this.props.entries.length;i++) {
            if(this.props.entries[i].EntryName == this.props.patterns[j].PatternName) {
              activityList.push(
              <View style={styles.activityBox} key={i}>
                <View style={styles.activityBoxInner}>
                  <View style={{flexDirection:'row'}}>
                    <View style={{flexDirection:'row', width:Dimensions.get('window').width-60}}>
                      <TouchableWithoutFeedback style={{width:25, height:25}} onPress={this.increaseEntryValue.bind(this, this.props.entries[i].EntryID)}>
                        <Icon
                          name='fontawesome|caret-up'
                          size={25}
                          color='#888'
                          style={{height:25, width:25}}
                        />
                      </TouchableWithoutFeedback>
                      <Text style={{fontSize:30, lineHeight:28}}>{this.props.entries[i].EntryValue}</Text>
                      <TouchableWithoutFeedback style={{width:25, height:25}} onPress={this.decreaseEntryValue.bind(this, this.props.entries[i].EntryID)}>
                        <Icon
                          name='fontawesome|caret-down'
                          size={25}
                          color='#888'
                          style={{height:25,width:25}}
                        />
                      </TouchableWithoutFeedback>
                      <Text>{this.props.entries[i].EntryUnit}</Text>
                      <TouchableWithoutFeedback style={{width:25, height:25, position:'absolute', right:15}} onPress={this.deleteEntry.bind(this, this.props.entries[i].EntryID, this.props.entries[i].EntryName)}>
                        <Icon
                          name='fontawesome|close'
                          size={25}
                          color='#ddd'
                          style={styles.deleteEntryButton}
                        />
                      </TouchableWithoutFeedback>
                    </View>

                  </View>
                </View>
              </View>)
            } //end if
          } //end for i
          var activityCategoryBlock = <ActivityCategoryBlock pattern={this.props.patterns[j]} calendarDate={this.props.calendarDate} key={j}>
                                        {activityList}
                                      </ActivityCategoryBlock>

          activityCategoryBlocks.push(activityCategoryBlock);
        } //end if filter match

      } //end for j
    } //end if


    return (
      <View style={styles.activityGridWrapper}>

        <View>
          <TextInput style={styles.filterActivitiesInput}
            onChangeText={(text) => this.setState({activitiesFilter: text})}
            value={this.state.activitiesFilter}
            placeholder="Activities" />
          <Icon
            name='fontawesome|search'
            size={25}
            color='#40EFD4'
            style={styles.searchIconStyle}
          />
          <TouchableWithoutFeedback onPress={this.props.openCreateEntryModal}>
              <Icon
                name='fontawesome|plus'
                size={20}
                color='#fff'
                style={styles.addEntryButton}
              />
          </TouchableWithoutFeedback>
        </View>
        {activityCategoryBlocks}
      </View>
    )
  }
});

const styles = StyleSheet.create({
  activityGridWrapper: {flexDirection:'row', flexWrap:'wrap', justifyContent:'flex-start'},
  activityBox: { width:Dimensions.get('window').width, padding:0,paddingLeft:15, paddingRight:15, backgroundColor:'#fff'},
  activityBoxHeader: { width:Dimensions.get('window').width, padding:0,paddingLeft:15, paddingRight:15,
                        backgroundColor:'#efefef'},
  activityBoxInner: { borderBottomColor:'#eee', borderBottomWidth:1, paddingTop:15, paddingBottom:15, flexDirection:'row' },
  deleteEntryButton: {width:25, height:25, position:'absolute', right:0, top:0},
  filterActivitiesInput: {width:Dimensions.get('window').width, padding:15, paddingLeft:50, height:65, backgroundColor:'#fff'},
  entryHeader: {},
  searchIconStyle: {width:25, height:25, position:'absolute', left:15, top:20},
  addEntryButton: {height:40, width:40, borderRadius:20, position:'absolute', right:15, top:15,  backgroundColor:'#40EFD4',},

});

module.exports = ActivityGrid;
