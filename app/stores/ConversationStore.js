var Dispatcher = require('../dispatcher/Dispatcher');
var Constants = require('../utils/Constants');
var EventEmitter = require('events').EventEmitter;
var assign = require('object-assign');


var CHANGE_EVENT = 'change';
var _conversations = [];
var _activeConversation = 1;
var _conversationsEditState = {};
var _conversationsDeleteState = {};
// object to store backup of conversations for rollbacks in case of API failure
var _conversationsBackup = {};

var ConversationStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getAllConversations: function() {
    return _conversations;
  },

  getActiveConversation: function() {
    return _activeConversation;
  },

  getConversationEditState: function() {
    return _conversationsEditState;
  },

  isActiveConversation: function(conv_id) {
    return conv_id === _activeConversation;
  },

  getConversationsDeleteState: function() {
    return _conversationsDeleteState;
  }

});


Dispatcher.register(function(action) {
  switch (action.actionType) {

    case Constants.CONV_CREATE:
      // do create
      ConversationStore.emitChange();
      break;

    case Constants.CONV_TOGGLEEDIT:
      toggleConversationsEditState(action.conv_id);
      ConversationStore.emitChange();
      break;

    case Constants.CONV_DELETE:
      setConversationsBackup(action.recoverykey);
      deleteConversation(action.conv_id);
      ConversationStore.emitChange();
      break;

    case Constants.CONV_DELETE_SUCCESS:
      deleteConversationsBackup(action.recoverykey);
      break;

    case Constants.CONV_DELETE_FAIL:
      restoreConversationsBackup(action.recoverykey);
      ConversationStore.emitChange();
      break;

    case Constants.CONV_ALERTDELETETOGGLE:
      toggleConversationDeleteState(action.conv_id);
      ConversationStore.emitChange();
      break;


    case Constants.CONV_UPDATE:
      setConversationsBackup(action.recoverykey);
      updateConversation(action.conv_id, action.newConvName);
      ConversationStore.emitChange();
      break;

    case Constants.CONV_UPDATE_SUCCESS:
      deleteConversationsBackup(action.recoverykey);
      ConversationStore.emitChange();
      break;

    case Constants.CONV_UPDATE_FAIL:
      restoreConversationsBackup(action.recoverykey);
      deleteConversationsBackup(action.recoverykey);
      ConversationStore.emitChange();
      break;

    case Constants.CONV_RECEIVED:
      setConversations(action.conversations);
      setInitialConversationsState(action.conversations);
      ConversationStore.emitChange();
      break;

    case Constants.CONV_CLICKED:
      setActiveConversation(action.conv_id);
      ConversationStore.emitChange();
      break;


    default:
      // none
  }
});


function setConversations(conversations) {
  _conversations = conversations;
}


function setInitialConversationsState(conversations) {
  conversations.map(function (conv) {
    _conversationsEditState[conv.conv_id] = false;
    _conversationsDeleteState[conv.conv_id] = false;
  });
}


function toggleConversationsEditState(conv_id) {
  _conversationsEditState[conv_id] = !_conversationsEditState[conv_id];
}


function setActiveConversation(conv_id) {
  _activeConversation = conv_id;
}


// TODO
function createConversation(conv_id) {
  _conversationsEditState[conv_id] = false;
  _conversationsDeleteState[conv_id] = false;
}


function toggleConversationDeleteState(conv_id) {
  _conversationsDeleteState[conv_id] = !_conversationsDeleteState[conv_id];
}


function updateConversation(conv_id, newConvName) {
  _conversations.every(function(conv) {
    if (conv.conv_id === conv_id) {
      conv.conv_name = newConvName;
      return false;
    } else {
      return true;
    }
  });
}


function setConversationsBackup(recoverykey) {
  _conversationsBackup.recoverykey = _conversations;
}


function deleteConversationsBackup(recoverykey) {
  delete _conversationsBackup.recoverykey;
}


function restoreConversationsBackup(recoverykey) {
  _conversations = _conversationsBackup.recoverykey;
}


function deleteConversation(conv_id) {
  _conversations.every(function (conv, index){
    if (conv.conv_id === conv_id) {
      _conversations.splice(index, 1);
      delete _conversationsEditState.conv_id;
      delete _conversationsDeleteState.conv_id;
    }
  });
}


module.exports = ConversationStore;
