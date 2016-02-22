/**
 * Proclivity
 * By: Dean Larbi
 */
var ProclivityConstants = require('../Constants/ProclivityConstants');
var AppDispatcher = require('../Dispatcher/AppDispatcher.js');
var SQLite = require('react-native-sqlite-storage');
function errorCB(err) {
  console.log("SQL Error: " + err);
}

function successCB() {
  console.log("SQL executed fine");

}

function openCB() {
  console.log("Database OPENED");
}

var ProclivityActions = {
  initialize: function() {
    AppDispatcher.dispatch({
      actionType: ProclivityConstants.INITIALIZE
    });
  },
  setView: function(view) {
    AppDispatcher.dispatch({
      actionType: ProclivityConstants.SET_VIEW,
      view: view
    });
  },
  getEntries: function() {
    var db = SQLite.openDatabase("proclivity.db", "1.0", "Test Database", 200000, openCB, errorCB);
    db.transaction(function(tx) {
      tx.executeSql('SELECT * from  Entry', [], function(tx, results) {
        var entries = [];
        for(var i=0;i<results.rows.length;i++) {
          entries.push(results.rows.item(i))
        }
        AppDispatcher.dispatch({
          actionType: ProclivityConstants.LOAD_ENTRIES,
          entries: entries
        });

      });
    }, function(error) {
      // OK to close here:
      console.log('transaction error: ' + error.message);
      //db.close();
    }, function() {
      // OK to close here:
      console.log('transaction ok');
      //db.close(function() {
        console.log('database is closed ok');
      //});
    });

  },
  createEntry: function(EntryName, EntryType, EntryValue, EntryUnit, calendarDate) {

    var db = SQLite.openDatabase("proclivity.db", "1.0", "Test Database", 200000, openCB, errorCB);
    var entryId = (Math.floor(Math.random() * (100000 - 0)) + 0);
    var entryCreated = Date.now();
    db.transaction(function(tx) {

      tx.executeSql('INSERT INTO Entry( EntryID , EntryName, EntryType, EntryValue, EntryUnit, EntryDate, EntryCreated ) values('+entryId+', "'+EntryName+'", "'+EntryType+'", '+EntryValue+', "'+EntryUnit+'", "'+calendarDate.fullDate+'","'+entryCreated+'")', [], function(tx, results) {
        ProclivityActions.getEntries();
      });
    }, function(error) {
      // OK to close here:
      console.log('transaction error: ' + error.message);
      //db.close();
    }, function() {
      // OK to close here:
      console.log('transaction ok');
      //db.close(function() {
        console.log('database is closed ok');
      //});
    });
  },
  deleteEntry: function(EntryID) {
    var db = SQLite.openDatabase("proclivity.db", "1.0", "Test Database", 200000, openCB, errorCB);
    db.transaction(function(tx) {

      tx.executeSql('DELETE from Entry WHERE EntryID = '+EntryID+'', [], function(tx, results) {
        AppDispatcher.dispatch({
          actionType: ProclivityConstants.DELETE_ENTRY,
          entryId: EntryID
        });
      });
    }, function(error) {
      // OK to close here:
      console.log('transaction error: ' + error.message);
      //db.close();
    }, function() {
      // OK to close here:
      console.log('transaction ok');
      //db.close(function() {
        console.log('database is closed ok');
      //});
    });
  },
  increaseEntryValue: function(entryId) {
    var db = SQLite.openDatabase("proclivity.db", "1.0", "Test Database", 200000, openCB, errorCB);

    db.transaction(function(tx) {
      tx.executeSql('UPDATE Entry SET EntryValue = EntryValue + 1 WHERE EntryId = \''+entryId+'\'', [],  function(tx, results) {
        AppDispatcher.dispatch({
          actionType: ProclivityConstants.INCREASE_ENTRY_VALUE,
          entryId: entryId
        });
      });
    }, function(error) {
      // OK to close here:
      console.log('transaction error: ' + error.message);
      //db.close();
    }, function() {
      // OK to close here:
      console.log('transaction ok');
      //db.close(function() {
        console.log('database is closed ok');
      //});
    });

  },
  decreaseEntryValue: function(entryId) {
    var db = SQLite.openDatabase("proclivity.db", "1.0", "Test Database", 200000, openCB, errorCB);


    db.transaction(function(tx) {
      tx.executeSql('UPDATE Entry SET EntryValue = EntryValue - 1 WHERE EntryId = \''+entryId+'\'', [],  function(tx, results) {
        AppDispatcher.dispatch({
          actionType: ProclivityConstants.DECREASE_ENTRY_VALUE,
          entryId: entryId
        });
      });
    }, function(error) {
      // OK to close here:
      console.log('transaction error: ' + error.message);
      //db.close();
    }, function() {
      // OK to close here:
      console.log('transaction ok');
      //db.close(function() {
        console.log('database is closed ok');
      //});
    });

  },
  getPatterns: function() {

    var db = SQLite.openDatabase("proclivity.db", "1.0", "Test Database", 200000, openCB, errorCB);
    db.transaction(function(tx) {

      tx.executeSql('SELECT * from Patterns', [], function(tx, results) {
        var patterns = [];

        for(var i=0;i<results.rows.length;i++) {
          patterns.push(results.rows.item(i))
        }
        AppDispatcher.dispatch({
          actionType: ProclivityConstants.LOAD_PATTERNS,
          patterns: patterns
        });
      });
    }, function(error) {
      // OK to close here:
      console.log('transaction error: ' + error.message);
      //db.close();
    }, function() {
      // OK to close here:
      console.log('transaction ok');
      //db.close(function() {
        console.log('database is closed ok');
      //});
    });

  },

  createPattern: function(PatternName, PatternType, EntryCount) {
    var db = SQLite.openDatabase("proclivity.db", "1.0", "Test Database", 200000, openCB, errorCB);
    var patternId = (Math.floor(Math.random() * (100000 - 0)) + 0);
    db.transaction(function(tx) {
      tx.executeSql('INSERT INTO Patterns( PatternID , PatternName, PatternType, EntryCount ) values('+patternId+', "'+PatternName+'", "'+PatternType+'", '+EntryCount+')', [], function(tx, results) {

        var pattern = {
          PatternID: patternId,
          PatternName: PatternName,
          PatternType: PatternType,
          EntryCount:1
        }
        AppDispatcher.dispatch({
          actionType: ProclivityConstants.CREATE_PATTERN,
          pattern: pattern
        });
      });
    }, function(error) {
      // OK to close here:
      console.log('transaction error: ' + error.message);
      //db.close();
    }, function() {
      // OK to close here:
      console.log('transaction ok');
      //db.close(function() {
        console.log('database is closed ok');
      //});
    });
  },

  addEntryToPattern: function(PatternName, PatternType) {
    var db = SQLite.openDatabase("proclivity.db", "1.0", "Test Database", 200000, openCB, errorCB);
    db.transaction(function(tx) {
      tx.executeSql('UPDATE Patterns SET EntryCount = EntryCount + 1 WHERE PatternName = \''+PatternName+'\'', [],  function(tx, results) {
        var pattern = {
          PatternID: (Math.floor(Math.random() * (100000 - 0)) + 0),
          PatternName: PatternName,
          PatternType: PatternType,
          EntryCount: 1
        }

        AppDispatcher.dispatch({
          actionType: ProclivityConstants.CREATE_PATTERN,
          pattern: pattern
        });

        if(results.rowsAffected == 0) {
          ProclivityActions.createPattern(PatternName, PatternType, 1)
        }
      });
    }, function(error) {
      // OK to close here:
      console.log('transaction error: ' + error.message);
      //db.close();
    }, function() {
      // OK to close here:
      console.log('transaction ok');
      //db.close(function() {
        console.log('database is closed ok');
      //});
    });
  },

  deletePatternEntry: function(PatternName) {
    var db = SQLite.openDatabase("proclivity.db", "1.0", "Test Database", 200000, openCB, errorCB);
    db.transaction(function(tx) {
      console.log(PatternName, 'NAAAME')
      tx.executeSql('UPDATE Patterns SET EntryCount = EntryCount - 1 WHERE PatternName = \''+PatternName+'\'', [], function(tx, results) {
        console.log('Complete transaction', tx, results)
        AppDispatcher.dispatch({
          actionType: ProclivityConstants.DELETE_PATTERN_ENTRY,
          patternName: PatternName
        });
      });
    }, function(error) {
      // OK to close here:
      console.log('transaction error: ' + error.message);
      //db.close();
    }, function() {
      // OK to close here:
      console.log('transaction ok');
      //db.close(function() {
        console.log('database is closed ok');
      //});
    });
  },
  setCalendarDate: function(date) {
    AppDispatcher.dispatch({
      actionType: ProclivityConstants.SET_CALENDAR_DATE,
      date: date
    });
  },
  changeDaysBy: function(int) {
    AppDispatcher.dispatch({
      actionType: ProclivityConstants.CHANGE_DAYS_BY,
      days: int
    });
  }
}

module.exports = ProclivityActions;
