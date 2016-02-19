/**
 * Proclivity
 * By: Dean Larbi
 */
var EventEmitter = require('EventEmitter');
var assign = require('object-assign');
var moment = require('moment');

var AppDispatcher = require('../Dispatcher/AppDispatcher.js');
var ProclivityConstants = require('../Constants/ProclivityConstants');

var CHANGE_EVENT = 'change';
var _view = 'Dashboard';
var _entries = [];
var _patterns = [];
var _calendarDate = {
  fullDate: moment(Date.now()).format('dddd MMMM DD, YYYY'),
  dayOfWeek: moment(Date.now()).format('dddd'),
  dayDigit: moment(Date.now()).format('DD'),
  month: moment(Date.now()).format('MMMM'),
  year: moment(Date.now()).format('YYYY')
}

function setView(view) {
  _view = view;
}

function setEntries(entries) {
  _entries = entries;
}

function createEntry(entry) {
  _entries.push(entry);
}


function increaseEntryValue(entryId) {
  _entries.forEach(function(entry, index, entries) {
    if(entry.EntryID == entryId) {
      entry.EntryValue++;
    }
  })
}

function decreaseEntryValue(entryId) {
  _entries.forEach(function(entry, index, entries) {
    if(entry.EntryID == entryId) {
      entry.EntryValue--;
    }
  })
}

function setPatterns(patterns) {
  _patterns = patterns;
}


function createPattern(pattern) {
  var updated = 0;
  for(var i=0;i<_patterns.length;i++) {
    console.log('PATTERNNAME', _patterns[i].PatternName, pattern.PatternName)
    if(_patterns[i].PatternName == pattern.PatternName) {
      _patterns[i].EntryCount++;
      updated = 1;
      break;
    }
  }
  if(!updated) {
    _patterns.push(pattern);
  }
}

function deleteEntry(EntryID) {
  for(var i=0;i<_entries.length;i++) {
    if(_entries[i].EntryID == EntryID) {
      _entries.splice(i,1);
    }
  }
}

function deletePatternEntry(patternName) {
  for(var i=0;i<_patterns.length;i++) {
    if(_patterns[i].PatternName === patternName) {
      _patterns[i].EntryCount--;
    }
  }
}

function setCalendarDate(date) {
  _calendarDate = {
    fullDate: moment(date).format('dddd MMMM DD, YYYY'),
    dayOfWeek: moment(date).format('dddd'),
    dayDigit: moment(date).format('DD'),
    month: moment(date).format('MMMM'),
    year: moment(date).format('YYYY')
  }
}

var ProclivityStore = assign({}, EventEmitter.prototype, {
  eventEmitter: new EventEmitter(),

  getView: function() {
    return _view;
  },

  getEntries: function() {
    return _entries;
  },

  getPatterns: function() {
    return _patterns;
  },

  getCalendarDate: function() {
    return _calendarDate;
  },

  emitChange: function() {
    this.eventEmitter.emit(CHANGE_EVENT);
  },

  /**
   * @param {function} callback
   */
  addChangeListener: function(callback) {
    this.eventEmitter.addListener(CHANGE_EVENT, callback);
  },

  /**
   * @param {function} callback
   */
  removeChangeListener: function(callback) {
    this.eventEmitter.removeListener(CHANGE_EVENT, callback);
  },

  dispatcherIndex: AppDispatcher.register(function(payload) {
    var displayLength, text, icon, type;
    switch(payload.actionType) {
      case ProclivityConstants.INITIALIZE:
        ProclivityStore.emitChange();
        break;
      case ProclivityConstants.SET_VIEW:
        setView(payload.view);
        ProclivityStore.emitChange();
        break;
      case ProclivityConstants.LOAD_ENTRIES:
        setEntries(payload.entries);
        ProclivityStore.emitChange();
        break;
      case ProclivityConstants.CREATE_ENTRY:
        createEntry(payload.entry);
        ProclivityStore.emitChange();
        break;
      case ProclivityConstants.DELETE_ENTRY:
        deleteEntry(payload.entryId);
        ProclivityStore.emitChange();
        break;
      case ProclivityConstants.INCREASE_ENTRY_VALUE:
        increaseEntryValue(payload.entryId);
        ProclivityStore.emitChange();
        break;
      case ProclivityConstants.DECREASE_ENTRY_VALUE:
        decreaseEntryValue(payload.entryId);
        ProclivityStore.emitChange();
        break;
      case ProclivityConstants.CREATE_PATTERN:
        createPattern(payload.pattern);
        ProclivityStore.emitChange();
        break;
      case ProclivityConstants.LOAD_PATTERNS:
        setPatterns(payload.patterns);
        ProclivityStore.emitChange();
        break;
      case ProclivityConstants.DELETE_PATTERN_ENTRY:
        deletePatternEntry(payload.patternName);
        ProclivityStore.emitChange();
        break;
      case ProclivityConstants.SET_CALENDAR_DATE:
        setCalendarDate(payload.date);
        ProclivityStore.emitChange();
        break;
    }

    return true; // No errors. Needed by promise in Dispatcher.
  })

});

module.exports = ProclivityStore;
