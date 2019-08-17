import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';

// Import fade styling
import "./index.css"

// Import router and transition utilities
import { Switch, Route, BrowserRouter, withRouter, Link } from "react-router-dom";

// Import our board and help components
import Board from './Components/Board.jsx';
import Help from './Components/Help.jsx';

// Our router switches between help and board
const Game = withRouter(({location}) => {
    return (
        <React.Fragment>
            <Route exact path="/" component={() => <Link className="link" to="/help">Help</Link>} />
            <Route path="/help" component={() => <Link className="link" to="/">Play</Link>} />
            <section className="route-section">
                <Switch>
                    <Route exact path="/" component={Board} />
                    <Route path="/help" component={Help} />
                </Switch>
            </section>
        </React.Fragment>
    )
})

ReactDOM.render((
    <BrowserRouter>
        <Game />
    </BrowserRouter>
), document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
