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

import React, { Component } from "react";
import Rater from "react-rater";
import ReactGA from "react-ga";
import { isEmpty } from "lodash";
import arrayShuffle from "array-shuffle";
import "babel-polyfill";
import * as utils from './utils.js'; 
import Share from "./Share";

const rankingURL = `https://dtml.org/api/RatingService/Rank`;
const loginURL = `https://dtml.org/api/UserService/User/`;

class Gamecontent extends Component {
  constructor(props) {
    super(props);
    console.log(props);
    this.state = {
      rating: 0,
	  loggedin: false,
          username: ``,
	  config: props.config,
      gameContent: props.gameContent,
      frameText: ``,
      startTime: new Date().getTime()
    };
  }

  componentDidMount() {
    document.title = `${this.state.gameContent.title} | DTML.org Educational Games`;
    document.getElementsByTagName('meta')["description"].content =`${this.state.gameContent.instruction}`;
    ReactGA.event({
      category: `Games`,
      action: `Game__${this.state.gameContent.id}`
    });
    ReactGA.pageview(window.location.hash);

const script = document.createElement('script');
    script.setAttribute(
      'src', 
      '//z-na.amazon-adsystem.com/widgets/onejs?MarketPlace=US&adInstanceId=a13d96fc-d7d1-40d2-a1c8-0b8945bd5b3c');
    document.body.appendChild(script);
   }

  componentWillMount() {
     if (isEmpty(this.state.gameContent)) {
      const urlpath = window.location.pathname;
      const baseurl = urlpath.split(`?`)[0].split(`#`)[0];
      const gameID = baseurl.substr(baseurl.lastIndexOf(`/`) + 1);
      if (isEmpty(this.props.config) || isEmpty(this.props.config.games)) {
        window.location.href = `https://dtml.org/esl`;
        return;
      }
 
      const gameContent = this.props.config.games.find(
        game => game.id === gameID
      );

      if (typeof gameContent === `undefined` || isEmpty(gameContent)) {
        window.location.href = `https://dtml.org/esl`;
        return;
      }

      this.setState({ gameContent });
	 }

      const that = this;	 
      that.setState({ loggedin: true});

       fetch(loginURL, { credentials: `include`, cache: "no-store" })
       .then(response => {
        if (response.status >= 300) {
          console.log(`Bad response from server`);
          that.setState({ loggedin: false });
          window.store.loggedin = false;
        }
        return response.json();
      })
      .then(data => {
        that.setState({ user: data });
        if (data !== `` && data.userName) {
         that.setState({ loggedin: true });
        }
		 else
		 {
		 that.setState({ loggedin: false });
		 }
      })
      .catch(error => {
        console.log(`Request failed ${error}`);
        that.setState({ loggedin: false });
        });

    


      const userLang = navigator.language || navigator.userLanguage;
      this.setState({ userLanguage: userLang });
      this.setState({ customization: this.props.config.customization });

      that.setState({ rating: this.state.gameContent.rating });
   }

  handleRate({ rating, type }) {
    if (type === `click`) {
      const url = `${rankingURL}/?key=${
        this.state.gameContent.id
      }&rank=${rating}`;

       fetch(url, {
        method: `post`,
	credentials: `include`,
        headers: {
          "Content-Type": `application/json`,
           Accept: `application/json, text/plain, */*`
        }
      });
    }
  }

  render() {
	
	let titleStyle = {};
	if (this.state.customization) {	  	
	titleStyle = {color: utils.invertColor(this.state.customization.BackgroundColor)};
    }	  

    let instruction = null;
    const today = new Date();
    const date = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
    instruction = (
      <div>
        <div className="howtoplay"><p  style={titleStyle}>{this.props.config.howtoplay}</p></div>
        <p  style={titleStyle}>{this.state.gameContent.instruction}</p>
      </div>
    );
	
    const min = 1;
    const max = 7;
    const rand = Math.round(min + Math.random() * (max - min));
   
   return (
      <div>
        <div className="contentsection gamecontent">
          <div className="contentsection-main">
            <div className="gamesection">
              <div className="gamesection01">
		<h1 style={titleStyle} className="gameTitle">{this.state.gameContent.title}</h1>
                <p style={titleStyle}>{this.state.gameContent.description}</p>
                {instruction}
                <div className="clr" />
              </div>

              <div className="gamesection01-top">
                <div id="framecontainer">
                  <iframe
                    className="gameframe"
                    allowtransparency="true"
                    title={this.state.gameContent.title}
                    scrolling="no"
	             src = {(this.state.gameContent.url.indexOf('?')>0) ? `${this.state.gameContent.url}&tic=${date}&mkt=${this.state.userLanguage}`:`${this.state.gameContent.url}?tic=${date}&mkt=${this.state.userLanguage}`}
                    frameBorder="0"
                  />
                </div>
              </div>
              <div className="ratesection">
                <div className="ratesection-top">
                  <div className="ratesection-top-left">
                    <div>
                      <Rater
                        total={5}
                        rating={this.state.rating}
                        onRate={this.handleRate.bind(this)}
                      />
                    </div>

                    <div className="clr" />
                  </div>

                  <div className="ratesection-top-right">
                    <h6>
                      <a
                        target="blank"
                        href={this.state.gameContent.url.indexOf('?')>0 ? `${this.state.gameContent.url}&tic=${date}&mkt=${this.state.userLanguage}`:`${this.state.gameContent.url}?tic=${date}&mkt=${this.state.userLanguage}`}
                      >
                        {` `}
                        <i className="fa fa-arrows-alt" aria-hidden="true" />
                        <span className="fullscreen">
                          {this.props.config.fullscreen}
                        </span>
                      </a>
                    </h6>
                    <h6>
                      <a target="blank" href="/esl/">
                        {this.props.config.back}
                      </a>
                    </h6>
                    <div className="clr" />
                  </div>
                  <div className="clr" />
                </div>

                <div className="ratesection-bottom">
                  <div className="ratesection-bottom01" />
                  <div className="clr" />
                </div>
              </div>
	     </div>

            <aside className="game-sidebar">
                  <div className="game-login game-sidebar-box">
<h3>SPONSORED LINKS</h3>

<div id="amzn-assoc-ad-a13d96fc-d7d1-40d2-a1c8-0b8945bd5b3c"></div>
  </div>

              {this.state.gameContent.leaderboard &&
                this.state.gameContent.leaderboard.length > 0 && (
                  <div className="game-leaderboard game-sidebar-box">
                    <h3>{this.props.config.topScore}</h3>
                    {this.state.gameContent.leaderboard.map((leader, i) => {
                      const j = i + 1;
                      return (
                        <div key={`leader-${j}`} className="leader-score">
                          <span className="leader-name">
                            {`${leader.UserName}`}
                          </span>
                          <br />
                          <span className="leader-points">
                            {`${leader.Score}`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}


{this.props.config.games && (
                <div className="game-relatedGames game-sidebar-box">
                  <h3>{this.props.config.more}</h3>

                  {// shuffle all games, remove our current game, trim to 3 games, then display them
                  arrayShuffle(this.props.config.games || [])
                    .filter(game => game.id !== this.state.gameContent.id)
                    .slice(0, 3)
                    .map((game, i) => {
                      const j = i + 1;
                      return (
                        <div key={`game-${j}`} className="related-game">
                          <a href={`/esl/${game.id}`}>{game.title}</a>
                        </div>
                      );
                    })}
                </div>
              )}

{!this.state.loggedin && (
              <div className="game-register game-sidebar-box">
                <p className="game-registerExplainer">
                  {this.props.config.registerSchoolText}
                </p>
                <p>
                  <a
                    className="game-registerButton"
                    href="https://dtml.org/Registration/Organization"
                  >
                    {this.props.config.registerSchoolButton}
                  </a>
                </p>
              </div>
)}

            </aside>
          </div>
        </div>
      </div>
    );
  }
}

export default Gamecontent;
