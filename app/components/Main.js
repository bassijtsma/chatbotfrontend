require("../styles/bootstrap.min.css");
require("../styles/style.css");

var React = require('react');
var Header = require('./Header');
var HeaderStore = require('../stores/HeaderStore');
var ConversationStore = require('../stores/ConversationStore');
var Conversations = require('./Conversations');
var ConversationItemActions = require('../actions/ConversationItemActions');
var ConversationsHeader = require('./ConversationsHeader')
var Messages = require('./Messages');
var MessageStore = require('../stores/MessageStore');
var MessageActions = require('../actions/MessageActions');
var MessagesHeader = require('./MessagesHeader');
var NewMessage = require('./NewMessage');

var Main = React.createClass({

  getInitialState: function() {
    return {
      activeConvId: 1,
      highestM_NrForActiveConv: 0,
      conversations: [],
      messages: [],
      questionsEditState: {},
      responsesEditState: {},
      headerVisibility: false,
      alertsVisibilities: {},
    }
  },

  componentDidMount: function() {
    HeaderStore.addChangeListener(this._onChange);
    ConversationStore.addChangeListener(this._onChange);
    MessageStore.addChangeListener(this._onChange);
    ConversationItemActions.getConversations();
    MessageActions.getMessages();
  },

  render: function() {
    return (
      <div className='app-wrapper container'>
        <Header headerVisibility={this.state.headerVisibility} />
        <div className="row">
          <div className="col-xs-12 col-md-3 conversations boxshadow">
            <ConversationsHeader />
            <Conversations conversations={this.state.conversations} />
          </div>
          <div className="col-xs-12 col-md-9 messages-container boxshadow">
            <MessagesHeader />
            <Messages
              activeConversation={this.state.activeConvId}
              messages={this.state.messages}
              questionsEditState={this.state.questionsEditState}
              responsesEditState={this.state.responsesEditState}
              messagesDeleteState={this.state.messagesDeleteState}
              />
            <NewMessage
              activeConversation={this.state.activeConvId}
              highestm_nr={this.state.highestM_NrForActiveConv}
              />
          </div>
        </div>

      </div>
    )
  },

  _onChange: function() {
    this.setState({
      activeConvId : ConversationStore.getActiveConversation(),
      conversations: ConversationStore.getAllConversations(),
      messages: MessageStore.getAllMessages(),
      questionsEditState: MessageStore.getQuestionsEditState(),
      responsesEditState: MessageStore.getResponsesEditState(),
      messagesDeleteState: MessageStore.getMessagesDeleteState(),
      headerVisibility: HeaderStore.getHeaderVisibility(),
      highestM_NrForActiveConv: MessageStore.getHighestM_NrForActiveConv()
    })
  },

});

module.exports = Main;
