// converts markdown to raw html
var converter = new Showdown.converter();

var Message = React.createClass({
	render: function() {
		var rawMarkup = converter.makeHtml(this.props.children.toString());
		return(
			<div className='message'>
				<UserPic />
				<h5 className='message-author'>
					{this.props.firstName}
				</h5>
				<span dangerouslySetInnerHTML={{__html: rawMarkup}} />
			</div>
		);
	}
});

// JSX syntax
var Conversation = React.createClass({
	loadMsgsFromServer: function() {
		// console.log(user);
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			succcess: function(data) {
				// replace the old array of comments with the new one 
				// from the server and the UI automatically updates 
				// itself
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				// console.log('user? ', this.props.user);
				console.error('error setting the state for a Conversation: ', this.props.url, status, ' | err.toString: ', err.toString, ' | the actual err: ', err());
			}.bind(this)
		});
	},
	handleMsgSubmit: function(msg) {
		var msgs = this.state.data;
		var newMsgs = msgs.concat([msg]);
		this.setState({data : newMsgs});
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			type: 'POST',
			data: msg,
			success: function(data) {
				this.setState({data: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	getInitialState: function () {
	    return {
	    	// this is the state of the Conversation
	      data: []  
	    };
	},
	componentDidMount: function () {
		this.loadMsgsFromServer();
		// simple polling here but could easily use websockets
		setInterval(this.loadMsgsFromServer, this.props.pollInterval);
	},
	render: function() {
		return (
			<div className='conversation'>
				<RecentMessages data={this.state.data} />
				<MessageForm onMsgSubmit={this.handleMsgSubmit} />
			</div>
		);
	}
});

var RecentMessages = React.createClass({
	render: function() {
		// renders the messages dynamically
		var messageNodes = this.props.data.map(function(msg) {
			return (
				<Message firstName={msg.firstName}>
					{msg.msg}
				</Message>
			);
		});
		return (
			<div className='current-message-thread'>
				{messageNodes}
			</div>
		);
	}
});

var MessageForm = React.createClass({
	handleSubmit: function(e) {
		e.preventDefault();
		console.log('someone just submitted the message form');
		// defers from tutorial in that they take first name from 
		// the form and not the signed in user
		var sender = this.props.firstName;
		var msg = React.findDOMNode(this.refs.msg).value.trim();
		if(!msg || !sender) {
			return;
		}
		this.props.onMsgSubmit({sender: sender, msg: msg});
		// TODO: send req to server
		React.findDOMNode(this.refs.msg).value = '';
		return;
	},
	render: function() {
		return(
			<form className='message-form' onSubmit={this.handleSubmit}>
				<textarea className='message-input-body' name='newMessage' rows='4' placeholder='Write your message...' ref='msg' />
				<input className='message-input-submit btn btn-primary' type='submit' value='Send' />
			</form>
		);
	}
});

var UserPic = React.createClass({
	render: function() {
		return (
			<img src={'this.props.profilePic'} />
		);
	}
});

var sampleMsgs = [];

React.render(
	<Conversation url={sampleMsgs} pollInterval={2000} />,
	document.getElementById('current-message-thread')
);

// might scrap RecentMsg for Conversation
/*var RecentMsg = React.createClass({
	getInitialState: function () {
	    return {
	        data: []  
	    };
	},
	componentDidMount: function () {
	    $.ajax({
	    	// not sure what this url needs to be for me
	    	url: this.props.url,
	    	dataType: 'json',
	    	success: function(data) {
	    		this.setState({data: data});
	    	}.bind(this),
	    	error: function(xhr, status, err) {
	    		console.log(this.props.url, status, err.toString());
	    	}.bind(this)
	    });  
	},
  render: function() {
    var rawMarkup = converter.makeHtml(this.props.children.toString());
    return (
      <div className='recent-msg'>
      	<UserPic />
        <h5 className='msg-recipient'>
          {this.props.author}
        </h5>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});


var Message = React.createClass({
	render: function() {
		return (
			<div className='message'>
				<h5 className='message-author'>
					{this.props.firstName}
				</h5>
				{this.props.children}
			</div>
		)
	}
});*/