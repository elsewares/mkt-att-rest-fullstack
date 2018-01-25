import React, {Component} from 'react';
import logo from './logo.png';
import axios from 'axios';
import './services/axios-configured';
import UserProfile from './components/UserProfile/UserProfile';
import './css/App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            currentUser: {},
            new_username: '',
            newUserError: ''
        };

        this.selectedUser = this.selectedUser.bind(this);
        this.setCurrentUser = this.setCurrentUser.bind(this);
        this.submitNewUser = this.submitNewUser.bind(this);
        this.handleNewUserChange = this.handleNewUserChange.bind(this);
        this.submitNewUser = this.submitNewUser.bind(this);
        this.showAddUser = this.showAddUser.bind(this);
    }

    showAddUser () {
      this.setCurrentUser({});
    }

    selectedUser () {
        return this.state.currentUser === {};
    }

    setCurrentUser (obj) {
        this.setState({'currentUser': obj});
    }

    handleNewUserChange (event) {
      this.setState({new_username: event.target.value});
    }

    submitNewUser () {
      let _this = this;

      axios.post(`user/${this.state.new_username}/`)
        .then(user => {
          let users = _this.state.users;
          users.push(user.data);
          _this.setState({'users': users});
          _this.setCurrentUser(user.data);
          _this.setState({new_username: ''});
        })
        .catch(error => {
          _this.setState({newUserError: error});
        });
    }

    componentDidMount() {
        let _this = this;

        axios.get('users/')
            .then(users => {
              users = users.data === null ? [] : users.data;
                _this.setState({users: users });
            })
            .catch(error => {
              console.log(error);
            });
    }

    render() {
        return (
            <div className="App">
                <header className="app-header">
                    <div className="app-logo">
                        <img src={logo} className="App-logo" alt="Marketing Acquisitions"/>
                        <p>Marketing Acquisitions Fullstack</p>
                    </div>
                </header>
                <aside className="nav-aside">
                  <div className="add-user-btn">
                    <button className="btn btn-primary" onClick={this.showAddUser}>Add New User</button>
                  </div>
                    {this.state.users.map(user =>
                        <div className={(this.state.currentUser.username === user.username) ? 'active' : ''} key={user.username}>
                            <a onClick={this.setCurrentUser.bind(this, user)}>{user.username}</a>
                        </div>
                    )}
                </aside>
                <div className="main">
                  {this.state.currentUser && this.state.currentUser.username ? (
                    <div className="profile-container">
                        <UserProfile user={this.state.currentUser} />
                    </div>
                  ) : (
                    <div className="new-user-form">
                      <h4>Add a new user.</h4>
                      <input id="new_username" value={this.state.new_username}  onChange={this.handleNewUserChange}/>
                      <button className="btn btn-warning" onClick={this.submitNewUser}>Add New User</button>
                    </div>
                  )}
                </div>
            </div>
        );
    }
}

export default App;
