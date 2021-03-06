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
  TouchableWithoutFeedback,
  TextInput,
  Dimensions,
  ScrollView
} from 'react-native';

var moment = require('moment');
var Modal = require('react-native-modalbox');
var { Icon } = require('react-native-icons');
var ProclivityActions = require('../Actions/ProclivityActions');
var ProclivityStore = require('../Stores/ProclivityStore');
var Question = require('../components/Question');
var Avatar = require('../components/Avatar');
var ActivityGrid = require('../components/ActivityGrid');
var Dashboard = React.createClass({
  getInitialState: function() {
    return {
      createEntryName: null,
      createEntryType: null,
      createEntryValue: null,
      createEntryUnit: null,
    }
  },
  componentDidMount: function() {
    ProclivityStore.addChangeListener(this._onChange);
  },
  _onChange: function() {

  },
  createEntry: function() {
    ProclivityActions.createEntry(this.state.createEntryName, "negative", parseInt(this.state.createEntryValue), this.state.createEntryUnit, this.props.calendarDate);
    ProclivityActions.addEntryToPattern(this.state.createEntryName, "negative");
    this.refs.createEntryModal.close()
  },
  getEntries: function() {
    ProclivityActions.getEntries();
  },
  openCreateEntryModal: function() {
    this.refs.createEntryModal.open();
  },
  closeCreateEntryModal: function() {
    this.refs.createEntryModal.close()
  },
  changeDaysBy: function(int) {
    ProclivityActions.changeDaysBy(int);
  },

  render: function() {

    /*
    <View style={styles.welcome} onPress={ProclivityActions.initialize}>
      <Text style={styles.welcomeHeader}>Track yourself.</Text>
      <Text style={styles.welcomeBlurb}>Help Proclivity find connections between habits.</Text>
    </View>
    <View style={styles.imageAndSummaryWrapper}>
      <View style={{marginRight:20}}>
        <Avatar width={40} height={40} source={{uri: "http://www.sheffield.com/wp-content/uploads/2013/06/placeholder.png"}}/>
      </View>
      <View style={styles.profileSummaryWrapper}>
        <Text style={styles.profileSummaryHeader}>
          krelwani
        </Text>
        <Text style={styles.profileSummarySubHeader}>
          {this.props.entries.length} things you did
        </Text>
      </View>
    </View>
    */
    return (
      <View>




        <Question />

        <View style={styles.dateSelectorWrapper}>
          <TouchableWithoutFeedback onPress={this.changeDaysBy.bind(this, 1)}>
              <Icon
                name='fontawesome|caret-left'
                size={25}
                color='#999'
                style={{width:25,height:25, position:'absolute', left:0,top:10}}
              />
          </TouchableWithoutFeedback>
          <Text>{this.props.calendarDate.fullDate}</Text>
          <TouchableWithoutFeedback onPress={this.changeDaysBy.bind(this, -1)}>
              <Icon
                name='fontawesome|caret-right'
                size={25}
                color='#999'
                style={{width:25,height:25, position:'absolute', right:0, top:10}}
              />
          </TouchableWithoutFeedback>
        </View>


        <ActivityGrid openCreateEntryModal={this.openCreateEntryModal} entries={this.props.entries} patterns={this.props.patterns} calendarDate={this.props.calendarDate}/>

        <Modal ref="createEntryModal" style={[styles.modal, styles.createEntryModal]} swipeToClose={true} swipeThreshold={10}>
          <View style={{flexDirection:'column'}} >
            <Text style={styles.createEntryModalHeader}>
              Start tracking an activity.
            </Text>
            <Text style={styles.createEntryInputLabel}>Activity Name</Text>
            <Text style={styles.createEntryInputSubLabel}>Proclivity uses this name to categorize your behavior.</Text>
            <TextInput style={styles.createEntryInput}
              onChangeText={(text) => this.setState({createEntryName: text})}
              value={this.state.createEntryName}
              placeholder="(i.e. Sleeping, Smoking, Driving..)"/>


            <Text style={styles.createEntryInputLabel}>Of What?</Text>
            <Text style={styles.createEntryInputSubLabel}>For Example, 10 hours of sleep. 2 cigarettes.</Text>
            <TextInput style={styles.createEntryInput}
              onChangeText={(text) => this.setState({createEntryUnit: text})}
              value={this.state.createEntryUnit}
              placeholder="(i.e. number of cigarettes, hours, conflicts)"/>

            <TouchableWithoutFeedback onPress={this.createEntry}>
                <Icon
                  name='fontawesome|plus'
                  size={20}
                  color='#fff'
                  style={styles.createEntryModalSubmitButton}
                />
            </TouchableWithoutFeedback>
          </View>
          <TouchableWithoutFeedback onPress={this.closeCreateEntryModal}>
            <Icon
              name='fontawesome|close'
              size={25}
              color='#fff'
              style={styles.closeEntryModalButton}
            />
          </TouchableWithoutFeedback>
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
  profileSummaryWrapper: {width:50, flex:1},
  imageAndSummaryWrapper: {flexDirection:'row', padding:15},
  profileSummaryHeader: {fontSize:14},
  profileSummarySubHeader: {fontSize:12, color:'#bbb'},
  createEntryModalSubmitButton: {height:40, width:40, borderRadius:20, marginRight:15, backgroundColor:'#66DE59', alignSelf:'flex-end'},
  createEntryModal: {},
  modal: {
   justifyContent: 'center',
   flexDirection:'row'
  },
  closeEntryModalButton: {position:'absolute',width:25, height:25, top:5, right:5},
  createEntryInput: {marginBottom:10, fontSize:12,paddingLeft:10, width: Dimensions.get('window').width-30, borderRadius:6, marginLeft:15, borderColor:'#ddd', height:35, borderWidth:1},
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
  createEntryInputLabel: {marginLeft:15, fontSize:16},
  createEntryInputSubLabel: {marginLeft:15, fontSize:12, color:'#ccc', marginBottom:10, width: Dimensions.get('window').width-30},
  dateSelectorWrapper: {backgroundColor:'#fff', flexDirection:'row', padding:15, borderBottomColor:'#eee', borderBottomWidth:1, marginTop:15, justifyContent:'center'}
});

module.exports = Dashboard;
