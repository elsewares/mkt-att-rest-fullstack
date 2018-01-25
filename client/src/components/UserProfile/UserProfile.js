import React from 'react';
import axios from 'axios';
import '../../services/axios-configured';
import './UserProfile.css';

class UserProfile extends React.Component {

  constructor (props) {
    super(props);

    this.state = {
      repositories: [],
      new_repo: '',
      newRepoError: ''
    }

    this.fetchReposForUser = this.fetchReposForUser.bind(this);
    this.handleNewRepoChange = this.handleNewRepoChange.bind(this);
    this.submitNewRepo = this.submitNewRepo.bind(this);
    this.displayTitle = this.displayTitle.bind(this);
  }

  fetchReposForUser (username) {
    let _this = this;

    axios.get(`repositories/?username=${username}`)
      .then(repos => {
        repos = repos.data === null ? [] : repos.data.repositories;
        _this.setState({repositories: repos});
      });
  }

  handleNewRepoChange (event) {
    this.setState({new_repo: event.target.value});
  }

  submitNewRepo () {
    let _this = this;

    axios.post(`repositories/?username=${this.props.user.username}&repository=${this.state.new_repo}`)
      .then(repo => {
        this.fetchReposForUser();
        _this.setState({new_repo: ''});
      })
      .catch(error => {
        _this.setState({newRepoError: error});
      });
  }

  componentWillReceiveProps (nextProps) {
    if (!this.props.user || this.props.user.username !== nextProps.user.username) {
      this.fetchReposForUser(nextProps.user.username);
    }
  }

  componentDidMount () {
    this.fetchReposForUser(this.props.user.username);
  }

  displayTitle () {
    const username = this.state.user && this.state.user.username ? this.state.user.username : this.props.user.username;
    return `Repositories for ${username}`;
  }

  render () {
    return (
      <div className="profile-container">
        <div className="info-container">
          <p className="info-name">{this.displayTitle()}</p>
          {this.state.repositories.length > 0 ? (
            <ul className="info-repos">
              {this.state.repositories.map(repo =>
                  <li key={repo}>{repo}</li>
              )}
            </ul>
          ) : (
            <h4>No repositories for this user.</h4>
          )}
          <div className="new-repo-form">
            { this.state.newRepoError !== '' && <div className="alert alert-danger">There has been an error with adding this repo.</div> }
            <input id="new_repo" value={this.state.new_repo}  onChange={this.handleNewRepoChange}/>
            <button className="btn btn-warning" onClick={this.submitNewRepo}>Add New Repo</button>
          </div>
        </div>
      </div>
    );
  }
}

export default UserProfile;
