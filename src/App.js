/* The Distance Teaching and Mobile learning licenses this file
to you under the Apache License, Version 2.0 (the "License"); 
you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing,
software distributed under the License is distributed on an
"AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied.  See the License for the
specific language governing permissions and limitations
under the License.
*/

import "babel-polyfill";
import 'core-js/es6/map';
import 'core-js/es6/set';

import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ReactGA from "react-ga";
import ReactPixel from "react-facebook-pixel";

import Header from "./components/Header";
import NotSupported from "./components/NotSupported";
import Footer from "./components/Footer";
import Gamelist from "./components/Gamelist";
import Gamecontent from "./components/Gamecontent";
import "./css/style.css";
import "./css/font-awesome.min.css";
import "./css/responsive.css";

ReactGA.initialize(`UA-80531313-1`);
ReactPixel.init(`1648707511827840`);

const imageurl = `https://games.dtml.org/games/`;
const url = `https://dtml.org/api/ConfigurationService/GetGamesList?mkt=`;
const errorurl = `https://dtml.org/Activity/JavaScriptLog?type=error&data=`;
const queryString = require(`query-string`);

const isNoSupported = (window.attachEvent && !window.addEventListener) || !window.atob;

window.store = window.store || {};

class App extends Component {
  constructor() {
    super();
    this.state = {
      done: true,
      gameContent: []
    };
    ReactGA.pageview(window.location.hash);
  }

startErrorLog()
{
    window.onerror = (message,file,line,column,errorObject) =>
    {
        column = column || (window.event && window.event.errorCharacter);
        var stack = errorObject ? errorObject.stack : null;
        var data = {
            message:message,
            file:file,
            line:line,
            column:column,
            errorStack:stack,
        };

        const logURL = errorurl +JSON.stringify(data);
        fetch(logURL);
 	console.log(data);
        return false;
    }
}
  
  componentWillMount() {
    this.startErrorLog();
    document.title = `Educational Games for Kids - DTML`;
    const userLang = navigator.language || navigator.userLanguage;
    this.setState({ userLanguage: userLang });
    const that = this;
    const parsed = queryString.parse(window.location.search);
    const fullURL = `${url + userLang}&orgid=${parsed.school}`;

    fetch(fullURL)
      .then(response => {
        if (response.status >= 400) {
          throw new Error(`Bad response from server`);
        }
        return response.json();
      })
      .then(data => {
		if (data && data.customization && parsed.school)
		{
		localStorage.setItem(`customization`,JSON.stringify(data.customization));
		}
		
		if (!parsed.school && !data.customization)
		{
		data.customization = JSON.parse(localStorage.getItem(`customization`));
		}
		
		that.setState({ config: data });
      });
	  
  }

  onSelectedGame(newdone, newContent) {
    this.setState({ done: newdone });
    this.setState({ gameContent: newContent });
    window.scrollTo(0, 0);
    ReactGA.event({
      category: `Navigation`,
      action: `Game selected`
    });
  }
  
  

  render() {
   	
    if (isNoSupported)
    { 
	return(<NotSupported />)	
    }
    else
    if (this.state.config != null) {
      return (
        <Router basename="/games">
          <div>
            <Header config={this.state.config} />
            <Route
              exact
              path="/"
              component={() => (
                <Gamelist
                  config={this.state.config}
                  Selected={this.onSelectedGame.bind(this)}
                />
              )}
            />
            <Route
              exact
              path="/:gameId"
              component={() => (
                <Gamecontent
                  gameContent={this.state.gameContent}
                  config={this.state.config}
                />
              )}
            />
            <Footer config={this.state.config} />
          </div>
        </Router>
      );
    }
    return null;
  }
}


export default App;
