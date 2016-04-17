var React = require('react');
var PropTypes = React.PropTypes;
var MessageStore = require('../stores/MessageStore');
var MessageItem = require('./MessageItem');
var MessageOptions = require('./MessageOptions');
var ReactCSSTransitionGroup = require('react-addons-css-transition-group');

var Messages = React.createClass({

  propTypes: {
    activeConversation: PropTypes.number.isRequired,
    messages: PropTypes.array.isRequired
  },

  componentDidMount: function() {
    MessageStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    MessageStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var activeConversation = this.props.activeConversation;

    var messageItems = this.props.messages.map(function (message) {
      if (message.conv_id === activeConversation) {
        return (
            <div className='row' key={message._id}>
              <div className='col-xs-6'>
                <div className='message question'>
                  <MessageItem
                    objectId={message._id}
                    m_nr={message.m_nr}
                    text={message.qtext}
                    is_alternative={message.is_alternative}
                    messageType='question'
                    editState={this.props.questionsEditState[message._id]}
                     />

                <MessageOptions
                    objectId={message._id}
                    messageType='question'
                    editState={this.props.questionsEditState[message._id]}
                    messagesDeleteState={this.props.messagesDeleteState[message._id]}
                    m_nr={message.m_nr}
                    convId={activeConversation} />
                </div>
              </div>

              <div className='col-xs-6'>
                <div className='message response'>
                  <MessageItem
                    objectId={message._id}
                    m_nr={message.m_nr}
                    text={message.rtext}
                    is_alternative={message.is_alternative}
                    messageType='response'
                    editState={this.props.responsesEditState[message._id]}
                     />

                  <MessageOptions
                    objectId={message._id}
                    m_nr={message.m_nr}
                    messageType='response'
                    editState={this.props.responsesEditState[message._id]}
                    messagesDeleteState={this.props.messagesDeleteState[message._id]}
                    messagenr={message.m_nr}
                    convId={activeConversation} />
                  </div>
              </div>
            </div>

         )}
    }.bind(this));

    return (
        <div className="row">
            {messageItems}
        </div>
    )
  },

  _onChange(){
    return;
  }

})



module.exports = Messages;
