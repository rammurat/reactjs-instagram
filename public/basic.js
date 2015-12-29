//liked users template
var LikedUserName = React.createClass({
	render: function() {
		return (
			<li> <a href="#"> {this.props.username} </a> </li>
		);
	}
});

//commented users template
var Comment = React.createClass({
	render: function() {
		return (
			<li><a href="#">{this.props.username}</a> {this.props.comment}</li>
		);
	}
});

//returns current item
var ThumbnailBody = React.createClass({
	render: function() {

		//local variables
		var image = INSTAGRAM.imagePath + this.props.data.image,
		comments = [],
		likes = [];

		//prepare comment list
		this.props.data.comments.forEach(function(row) {
            comments.push(
            	<Comment username={row.username} comment={row.comment} key={row.id}/>
        	);
        }.bind(this));

		//prepare liked users list
        this.props.data.likes.map(function(row, i){
        	likes.push(
        		<LikedUserName username={row} key={i} />
        	);
    	});
        
		return (
			<div className="row">
				<div className="col-sm-12 col-md-12">
					<div className="thumbnail-img">
				      <img src={image} alt="..."/>
				    </div>

				    <div className="row">
				  		<div className="col-sm-12 col-md-12">
					  		<p className="likes"><strong>{this.props.data.likes_count}</strong> likes</p>
					  		<ul className="list">
					 			{likes} 			
					  		</ul>
				  		</div>
					</div>

					<div className="row">
				  		<div className="col-sm-12 col-md-12">
					  		<p className="comments"><strong>{this.props.data.comments_count}</strong> comments</p>
					  		<ul className="list-group padding-left-20">
					  			{comments}
					  		</ul>
				  		</div>
					</div>
				</div>
			</div>
		);
	}
});

//prepare current item share/liked content area
var ThumbnailFooter = React.createClass({
	render: function() {

		return (
			<div className="row">
				<div className="col-sm-11 col-md-11">
					<div className="thumbnail col-sm-1 col-md-1 avatar">
				      <img src="images/heart-inactive.png" alt="..."/>
				    </div>
				    <div className="col-sm-11 col-md-11 padding-left-20">
			  			<form>
			          		<input type="search" placeholder="Add comment..." className="form-control full-width"/>
			          	</form>
		          	</div>
				</div>
			    <div className="col-sm-1 col-md-1">
			  		<p className="pull-right share">...</p>
			    </div>
			</div>
		);
	}
});

//prepare current item heading and time
var ThumbnailHeader = React.createClass({
	render: function() {

		//local variable
		var image = INSTAGRAM.imagePath + this.props.user_profile_image;

		return (
			<div className="row">
				<div className="col-sm-6 col-md-6">
					<div className="thumbnail pull-left avatar">
				      <img src={image} alt="..."/>
				    </div>
		  			<a href="#" className="pull-left padding-left-20">{this.props.username}</a>
				</div>

			    <div className="col-sm-6 col-md-6">
			  		<p className="pull-right">{this.props.time}</p>
			    </div>
			</div>
		);
	}
});

//get updates from server and prepare list
var Thumbnail = React.createClass({
	getInitialState: function() {
		return {list: []}; //default data
	},
	loadCommentsFromServer : function(){
		//get updated data from server
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {
				//update newly received data from server 
				this.setState({list: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	componentDidMount: function() {
		this.loadCommentsFromServer();
	},
	render: function() {
		var rows = []; //local variable

		//prepare current item with heading/content and share tools
		this.state.list.forEach(function(data) {
            
            //add row
            rows.push(
            	<div className="thumbnail" key={data.id}>
	            	<ThumbnailHeader time={data.time} username={data.username} user_profile_image={data.user_profile_image} />
	            	<ThumbnailBody data={data}  />
	            	<ThumbnailFooter  />
            	</div>
        	);
        }.bind(this));


		return (
			<div>
	        	{rows}
	        </div>
		);
	}
});

//prepare main page header
var Header = React.createClass({
	render: function() {
		return (
			<div className="header clearfix">
		        <nav className="pull-right">
		          <a href="#">{this.props.username}</a>
		        </nav>
		        <nav className="pull-right search-cnt">
		          <form>
		          	<input type="search" placeholder="Search..." className="form-control"/>
		          </form>
		        </nav>
		        <h3 className="text-muted">Instagram</h3>
		    </div>
		);
	}
});

//prepare main page body
var ListContainer = React.createClass({
	render: function() {
		return (
			<div className="row">
				<Thumbnail url="http://localhost:3000/api/list"/>
			</div>
		);
	}
});

//prepare main page footer
var Footer = React.createClass({
	render: function() {
		return (
			<footer className="footer">
	        	<p>&copy; 2015 Company, Inc.</p>
	        </footer>
		);
	}
});

//get user profile data on first element creation on the page 
var PageContent = React.createClass({
	getInitialState: function() {
		return {userProfile: []}; //default profile data
	},
	loadCommentsFromServer : function(){

		//get user profile data from server
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
			success: function(data) {

				//update user profile data
				this.setState({userProfile: data});
			}.bind(this),
			error: function(xhr, status, err) {
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},
	componentDidMount: function() {
		this.loadCommentsFromServer();
	},
	render: function() {
		return (
			<div className="pageContent">
				<Header username={this.state.userProfile.username}/>
				<ListContainer/>
				<Footer/>
			</div>
		);
	}
});

//get user profile data and render main container
ReactDOM.render(
	<PageContent url="http://localhost:3000/api/userProfile"/>,
	document.getElementById('container')
);