import React from 'react';
import './ContributorProfile.css';

class ContributorProfile extends React.Component {

    render () {
        if (this.props.contributor.avatar_url) {
            return (
                <div className="profile-container">
                    <div className="avatar-container">
                        <img className="avatar" src={this.props.contributor.avatar_url} alt="avatar" />
                    </div>
                    <div className="info-container">
                        <p className="info-name">{this.props.contributor.login}</p>
                        <p className="info-github-link">
                            <a href={this.props.contributor.html_url} target="_new">Github Profile</a>
                        </p>
                    </div>
                </div>
            );
        } else {
            return (<h2 className="no-contributor">No contributor selected.</h2>);
        }

    }
}

export default ContributorProfile;
