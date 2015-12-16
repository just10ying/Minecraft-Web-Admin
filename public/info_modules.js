
var CommentBox = React.createClass({displayName: "CommentBox",
	render: function() {
		return (
			React.createElement("div", {className: "commentBox"}, 
				React.createElement("h1", null, "Comments"), 
				React.createElement(CommentList, {data: this.props.data}), 
				React.createElement(CommentForm, null)
			)
		);
	}
});

var CommentList = React.createClass({displayName: "CommentList",
	render: function() {
		var commentNodes = this.props.data.map(function(comment) {
			return (
				React.createElement(Comment, {author: comment.author, key: comment.id}, 
					comment.text
				)
			);
		});
		return (
			React.createElement("div", {className: "commentList"}, 
				commentNodes
			)
		);
	}
});

var CommentForm = React.createClass({displayName: "CommentForm",
	render: function() {
		return (
			React.createElement("div", {className: "commentForm"}, "Hello world!  I'm a comment form?")
		);
	}
});

var Comment = React.createClass({displayName: "Comment",
	rawMarkup: function() {
		return {__html: this.props.children.toString() };
	},
	render: function() {
		return (
			React.createElement("div", {className: "comment"}, 
				React.createElement("h2", {className: "commentAuthor"}, 
					this.props.author
				), 
				React.createElement("span", {dangerouslySetInnerHTML: this.rawMarkup()})
			)
		);
	}
});

var data = [
	{id: 1, author: "Joey Sadecky", text: "Believe it or not"},
	{id: 2, author: "John Lee", text: "noooooOOOOOOOOOOOOOOO"}
];

ReactDOM.render(React.createElement(CommentBox, {data: data}), 
				document.getElementById('info-container'));