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
import "core-js/es6/map";
import "core-js/es6/set";

import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import ReactGA from "react-ga";

import Header from "./components/Header";
import NotSupported from "./components/NotSupported";
import Footer from "./components/Footer";
import LeaderBoard from "./components/LeaderBoard";
import Gamelist from "./components/Gamelist";
import VideoList from "./components/Videolist";
import CacheFill from "./components/CacheFill";
import Gamecontent from "./components/Gamecontent";
import VideoContent from "./components/VideoContent";
import BugReporterContainer from "./components/BugReporter";
import "./css/style.css";
import "./css/font-awesome.min.css";
import "./css/responsive.css";

ReactGA.initialize(`UA-80531313-1`);

const url = `https://dtml.org/api/ConfigurationService/GetGamesList?mkt=`;
const errorurl = `https://dtml.org/Activity/JavaScriptLog?type=error&data=`;
const queryString = require(`query-string`);

window.store = window.store || {};

class App extends Component {
  constructor() {
    super();
    this.state = {
        done: true,
        gameContent: [],
        videoContent: [],
        videos: null
    };
  }

  startErrorLog() {
    window.onerror = (message, file, line, column, errorObject) => {
      column = column || (window.event && window.event.errorCharacter);
      var stack = errorObject ? errorObject.stack : null;
      var data = {
        message: message,
        userLang: navigator.language || navigator.userLanguage,
        file: file,
        line: line,
        column: column,
        userAgent: navigator.userAgent,
        errorStack: stack
      };

      const logURL = errorurl + JSON.stringify(data);
      fetch(logURL, { credentials: `include`, cache: "no-store" });
      return false;
    };
  }

  componentWillMount() {
    this.startErrorLog();
    ReactGA.pageview(window.location.pathname + window.location.hash); 
    this.isNoSupported = (window.attachEvent && !window.addEventListener) || !window.atob;
    console.log("Supported browser: "+!this.isNoSupported);
    document.title = `Educational Games for Kids - DTML`;
    let userLang = navigator.language || navigator.userLanguage;
    this.setState({ isNoSupported : this.isNoSupported });
    const that = this;
    const parsed = queryString.parse(window.location.search);
    var date = new Date();
    var ticks = ((date.getTime() * 10000) + 621355968000000000);
    let orgParams =  parsed.school?`&orgid=${parsed.school}&tic=${ticks}`:``;
    if (parsed.mkt)
    {
      userLang = parsed.mkt; 
    }

    this.setState({ userLanguage: userLang });    
    const fullURL = `${url + userLang + orgParams}`;
    fetch(fullURL, { credentials: `include`, cache: "no-store" })
      .then(response => {
	 if (response.ok) {
          return response.json();
        }
	 else
	{
	 this.setState({ isNoSupported : true});
	}
      })
      .then(data => {   that.setState({ config: data })})
       .catch(err => { this.setState({ isNoSupported: true }); });
  }

  onSelectedGame(newdone, newContent) {
    this.setState({ done: newdone });
    this.setState({ gameContent: newContent });
    window.scrollTo(0, 0);
    ReactGA.event({
      category: `Navigation`,
      action: `GameSelected`
    });
    }

    onSelectedVideo(newdone, newContent) {
        this.setState({ done: newdone });
        this.setState({ videoContent: newContent });
        window.scrollTo(0, 0);
        ReactGA.event({
            category: `Navigation`,
            action: `VideoSelected`
        });
    }

  render() {
    if (this.state.isNoSupported) {
      return <NotSupported />;
    } else if (this.state.config != null) {
      return (
        <Router basename="/esl">
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
              path="/leaderboard/scores"
              component={() => (
                <LeaderBoard
                  config={this.state.config}
                />
              )}
                  />
                  <Route
                      exact
                      path="/videos/view"
                      component={() => (
                          <VideoList
                              config={this.state.config}       
                              Selected={this.onSelectedVideo.bind(this)}
                          />
                      )}
                  />
            <Route
              exact
              path="/cache/fill"
              component={() => (
                <CacheFill
                  config={this.state.config}
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
                  <Route
                      exact
                      path="/videos/details/:videoId"
                      component={() => (
                          <VideoContent
                              videoContent={this.state.videoContent}
                              config={this.state.config}
                          />
                      )}
                  />
            <BugReporterContainer config={this.state.config} />
            <Footer config={this.state.config} />
          </div>
        </Router>
      );
    }
    return null;
  }
}

export default App;
