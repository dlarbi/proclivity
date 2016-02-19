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
  Image,
  ScrollView,
  TouchableWithoutFeedback
} from 'react-native';

var SQLite = require('react-native-sqlite-storage');

var { Icon } = require('react-native-icons');
var ProclivityActions = require('../ProclivityApp/Actions/ProclivityActions');
var ProclivityStore = require('../ProclivityApp/Stores/ProclivityStore');

var Dashboard = require('../ProclivityApp/Views/Dashboard');
var Patterns = require('../ProclivityApp/Views/Patterns');
var Connections = require('../ProclivityApp/Views/Connections');
var Account = require('../ProclivityApp/Views/Account');
var Proclivity = React.createClass({

  getInitialState: function() {
    return {
      view: ProclivityStore.getView(),
      entries: ProclivityStore.getEntries(),
      patterns: ProclivityStore.getPatterns(),
      calendarDate: ProclivityStore.getCalendarDate()
    }
  },

  componentDidMount: function() {
    ProclivityStore.addChangeListener(this._onChange);
    ProclivityActions.getEntries();
    ProclivityActions.getPatterns();
  },

  _onChange: function() {
    this.setState({
      view: ProclivityStore.getView(),
      entries: ProclivityStore.getEntries(),
      patterns: ProclivityStore.getPatterns(),
      calendarDate: ProclivityStore.getCalendarDate()
    });
  },

  navButtonPress: function(data) {
    ProclivityActions.setView(data);
  },
  resetDb: function() {
    var db = SQLite.openDatabase("proclivity.db", "1.0", "Test Database", 200000, null, null);
    db.transaction(function(tx) {
      tx.executeSql('DELETE from Patterns', [], function(tx, results) {

      });
    });
    db.transaction(function(tx) {
      tx.executeSql('DELETE from Entry', [], function(tx, results) {

      });
    });
  },

  render:function() {
    var view = this.state.view == 'Dashboard' ?
                <Dashboard entries={this.state.entries}
                            patterns={this.state.patterns}
                            calendarDate={this.state.calendarDate}/> : this.state.view == 'Patterns' ?
                <Patterns patterns={this.state.patterns} entries={this.state.entries}/> : this.state.view == 'Connections' ?
                <Connections /> : this.state.view == 'Account' ?
                <Account /> :
                 null;

    return (
      <View style={styles.container}>

        <View style={styles.topBar}>
          <Image style={{width:128, height:40, marginTop:25}} source={{uri: "http://i.imgur.com/o5jdB4D.png"}}></Image>
            <TouchableWithoutFeedback onPress={this.resetDb}>
              <Icon
                name='fontawesome|remove'
                size={30}
                color='#f00'
                style={{width:30, height:30, alignSelf:'flex-end'}}
              />
            </TouchableWithoutFeedback>
        </View>

        <ScrollView style={{marginBottom:60}}
                    showsVerticalScrollIndicator={false}>
          {view}
        </ScrollView>

        <View style={styles.bottomNavMenu}>
          <View style={styles.navButton}>
            <TouchableWithoutFeedback onPress={this.navButtonPress.bind(this, 'Dashboard')}>
              <Icon
                name='fontawesome|area-chart'
                size={30}
                color='#fff'
                style={{width:30, height:30, alignSelf:'center'}}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.navButton}>
            <TouchableWithoutFeedback onPress={this.navButtonPress.bind(this, 'Patterns')}>
              <Icon
                name='fontawesome|th'
                size={30}
                color='#fff'
                style={{width:30, height:30, alignSelf:'center'}}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.navButton}>
            <TouchableWithoutFeedback onPress={this.navButtonPress.bind(this, 'Connections')}>
              <Icon
                name='fontawesome|gears'
                size={30}
                color='#fff'
                style={{width:30, height:30, alignSelf:'center'}}
              />
            </TouchableWithoutFeedback>
          </View>
        </View>

      </View>
    )
  }
});

var dashboardRoute = {
  name: 'Dashboard',
  component: Proclivity
}

var App = React.createClass({
  render: function() {
    return (
      <Router dashboardRoute={dashboardRoute} />
    )
  }
})


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EBFFFA',
  },

  topBar: {
    backgroundColor:'#eee',
    height:70,
    flexDirection: 'row',

    justifyContent:'center'
  },

  bottomNavMenu: {flexDirection:'row', flex:1, left:0, right:0, position:'absolute', bottom:0, backgroundColor:'#333'},
  navButton: {flex:1, padding:15},
  navButtonText: { textAlign:'center',color:'#fff',marginTop:5}
});

AppRegistry.registerComponent('ProclivityApp', () => Proclivity);
