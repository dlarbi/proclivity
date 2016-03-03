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
var { Icon } = require('react-native-icons');
var SQLite = require('react-native-sqlite-storage');

var Account = React.createClass({
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


  render: function() {
    return (
      <View>
        <Text onPress={ProclivityActions.initialize}>
          Reset Application
        </Text>
        <TouchableWithoutFeedback onPress={this.resetDb}>
          <Icon
            name='fontawesome|remove'
            size={30}
            color='#f00'
            style={{width:30, height:30, alignSelf:'flex-end'}}
          />
        </TouchableWithoutFeedback>
      </View>
    )
  }
});

const styles = StyleSheet.create({

});

module.exports = Account;
