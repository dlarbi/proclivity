'use strict';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Dimensions,
  Image,
  TouchableWithoutFeedback
} from 'react-native';
var { Icon } = require('react-native-icons');

var ProclivityActions = require('../Actions/ProclivityActions');
var ProclivityStore = require('../Stores/ProclivityStore');

var ActivityCategoryBlock = React.createClass({

  createEntryFromPattern: function(pattern) {
    if(!this.props.hasEntries) {
      ProclivityActions.createEntry(pattern.PatternName, pattern.PatternType, 1, 'Hours', this.props.calendarDate);
      ProclivityActions.addEntryToPattern(pattern.PatternName, pattern.PatternType);
    }

    this.props.toggleActivity(pattern.PatternName);
  },

  render: function() {
    var glyphiconType = !this.props.hasEntries ? 'plus' : this.props.expanded > -1 ? 'chevron-down' : 'chevron-right'
    return (
      <View style={styles.activityBox}>
        <View>
          <View style={styles.activityBoxInner}>
            <Text style={styles.entryHeader}>{this.props.pattern.PatternName}</Text>
            <TouchableWithoutFeedback style={{width:25, height:25, position:'absolute', right:15}} onPress={this.createEntryFromPattern.bind(this, this.props.pattern)}>
              <Icon
                name={'fontawesome|' + glyphiconType}
                size={25}
                color='#bbb'
                style={styles.deleteEntryButton}
              />
            </TouchableWithoutFeedback>
          </View>
        </View>
        {this.props.children}
      </View>
    )
  }
});

const styles = StyleSheet.create({
  entryHeader: {backgroundColor:'transparent', fontSize:16},
  activityBox: { width:Dimensions.get('window').width, padding:0,paddingLeft:15, paddingRight:15, backgroundColor:'#fff'},
  activityBoxInner: { borderBottomColor:'#eee', borderBottomWidth:1, paddingTop:15, paddingBottom:15, flexDirection:'row' },
  deleteEntryButton: {width:25, height:25,position:'absolute',top:15, right:0},
});

module.exports = ActivityCategoryBlock;
