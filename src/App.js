import React, {Component} from 'react';
import {connect} from 'react-redux';
import logo from './logo.svg';
import './App.css';
import {simpleAction, changeSetting} from './actions/simpleAction'

class App extends Component {
    onClick = (event) => {
        this.props.simpleAction();
    };
    onKeyUp = (event) => {
        this.props.changeSetting(event.target.value);
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
                    <h1 className="App-title">Welcome to React</h1>
                </header>
                <pre>{JSON.stringify(this.props)}</pre>
                <button onClick={this.onClick}>Test redux action</button>
                <input onKeyUp={this.onKeyUp}></input>
                <p className="App-intro">
                    To get started, edit <code>src/App.js</code> and save to reload
                </p>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    hello: state.simpleReducer
});

const mapDispatchToProps = dispatch => ({
    simpleAction: () => dispatch(simpleAction()),
    changeSetting: (setting) => dispatch(changeSetting(setting))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
