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

var ProclivityActions = require('../Actions/ProclivityActions');
var ProclivityStore = require('../Stores/ProclivityStore');

var Account = React.createClass({
  render: function() {
    return (
      <Text onPress={ProclivityActions.initialize}>
        Welcome to Proclivity, Account.
      </Text>
    )
  }
});

const styles = StyleSheet.create({

});

module.exports = Account;
