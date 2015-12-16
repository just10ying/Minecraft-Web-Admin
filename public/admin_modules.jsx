var CommentBox = React.createClass({
	render: function() {
		return (
			<div className="commentBox">
				<h1>Comments</h1>
				<CommentList data={this.props.data} />
				<CommentForm />
			</div>
		);
	}
});

var CommentList = React.createClass({
	render: function() {
		var commentNodes = this.props.data.map(function(comment) {
			return (
				<Comment author={comment.author} key={comment.id}>
					{comment.text}
				</Comment>
			);
		});
		return (
			<div className="commentList">
				{commentNodes}
			</div>
		);
	}
});

var CommentForm = React.createClass({
	render: function() {
		return (
			<div className="commentForm">Hello world!  I'm a comment form?</div>
		);
	}
});

var Comment = React.createClass({
	rawMarkup: function() {
		return {__html: this.props.children.toString() };
	},
	render: function() {
		return (
			<div className="comment">
				<h2 className="commentAuthor">
					{this.props.author}
				</h2>
				<span dangerouslySetInnerHTML={this.rawMarkup()} />
			</div>
		);
	}
});

var data = [
	{id: 1, author: "Joey Sadecky", text: "Believe it or not"},
	{id: 2, author: "John Lee", text: "noooooOOOOOOOOOOOOOOO"}
];

ReactDOM.render(<CommentBox data={data} />, 
				document.getElementById('admin-container'));