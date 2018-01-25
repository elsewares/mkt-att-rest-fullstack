import React, {Component} from 'react';
import logo from './logo.png';
import ContributorProfile from './components/ContributorProfile/ContributorProfile';
import './css/App.css';

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            contributors: [],
            currentContributor: {}
        };

        this.selectedContributor = this.selectedContributor.bind(this);
        this.setCurrentContributor = this.setCurrentContributor.bind(this);
    }

    selectedContributor () {
        return this.state.currentContributor === {};
    }

    setCurrentContributor (obj) {
        this.setState({'currentContributor': obj});
    }

    componentDidMount() {
        let _this = this;
        fetch('/contributors')
            .then(res => res.json())
            .then(contributors => {
                contributors = JSON.parse(contributors);
                _this.setState({ contributors })
            });
    }

    render() {
        return (
            <div className="App">
                <header className="app-header">
                    <div className="app-logo">
                        <img src={logo} className="App-logo" alt="Marketing Acquisitions"/>
                        <p>Marketing Acquisitions React App</p>
                    </div>
                </header>
                <aside className="nav-aside">
                    {this.state.contributors.map(contributor =>
                        <div className={(this.state.currentContributor.id === contributor.id) ? 'active' : ''} key={contributor.id}>
                            <a onClick={this.setCurrentContributor.bind(this, contributor)}>{contributor.login}</a>
                        </div>
                    )}
                </aside>
                <div className="main">
                    <div className="profile-container">
                        <ContributorProfile contributor={this.state.currentContributor} />
                    </div>
                </div>
            </div>
        );
    }
}

export default App;
