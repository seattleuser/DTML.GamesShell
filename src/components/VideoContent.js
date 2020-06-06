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
import ReactGA from "react-ga";
import Rater from "react-rater";
import { isEmpty } from "lodash";
import arrayShuffle from "array-shuffle";
import "babel-polyfill";
import * as utils from './utils.js'; 
import Confetti from 'react-dom-confetti';

const rankingURL = `https://dtml.org/api/RatingService/Rank`;


class VideoContent extends Component {
    constructor(props) {
        super(props);
        var min = 0;
        var max = 11;
        var rand = Number(min + (Math.random() * (max - min))).toFixed(0);
        this.state = {
            isOpen: false
        }
    

    console.log(props);
    this.state = {
      rating: 0,
	  loggedin: false,
	  completed : false,
	  loading:true,
	  image: 'https://dtml.org/images/avatars/a'+rand+".png",
	  config: props.config,
      videoContent: props.videoContent,
      frameText: ``,
      startTime: new Date().getTime()
    };
  }

  componentDidMount() {
      document.title = `${this.state.videoContent.Title} | DTML.org Educational Games and Videos`;
      document.getElementsByTagName('meta')["description"].content = `${this.state.videoContent.Description}`;
    ReactGA.event({
      category: `Videos`,
        action: `Video__${this.state.videoContent.VideoID}`
    });
    ReactGA.pageview(window.location.hash);
    }


  componentWillMount() {
     if (isEmpty(this.state.videoContent)) {
      const urlpath = window.location.pathname;
      const baseurl = urlpath.split(`?`)[0].split(`#`)[0];
      const videoID = baseurl.substr(baseurl.lastIndexOf(`/`) + 1);
      if (isEmpty(this.props.config) || isEmpty(this.props.config.videos)) {
        window.location.href = `https://dtml.org/esl`;
        return;
      }
 
         const videoContent = this.props.config.videos.find(
             video => video.VideoID === videoID
      );

         if (typeof videoContent === `undefined` || isEmpty(videoContent)) {
        window.location.href = `https://dtml.org/esl`;
        return;
      }

         this.setState({ videoContent });
	 }
  
      const userLang = navigator.language || navigator.userLanguage;
      this.setState({ userLanguage: userLang });
      this.setState({ customization: this.props.config.customization });
	  this.setState({ loggedin: this.props.config.userData !== null });
   }

  handleRate({ rating, type }) {
    if (type === `click`) {
	  this.setState({ rating: rating });
	  this.setState({ completed: true });
      const url = `${rankingURL}/?key=${
        this.state.gameContent.VideoID
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
	  
   const recordclick = (value) => {
	   
 	  try
	  {
      ReactGA.event({
        category: `click`,
        action: value, 
	    label:this.state.image
      });
	  }
	  catch(e) {}
    };
	
	let titleStyle = {};
	if (this.state.customization) {	  	
	titleStyle = {color: utils.invertColor(this.state.customization.BackgroundColor)};
    }	  

    let instruction = null;
    const today = new Date();
    const date = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
	
    const min = 1;
    const max = 7;
  
   return (
      <div>
        <div className="contentsection gamecontent">
          <div className="contentsection-main">
            <div className="gamesection">
              <div className="gamesection01">
		        <h1 style={titleStyle} className="gameTitle">{this.state.videoContent.Title}</h1>
                           <p style={titleStyle}>{this.state.videoContent.Description}</p>
                <div className="clr" />
              </div>

              <div className="gamesection01-top">
                <div id="framecontainer">
                </div>
              </div>
              <div className="ratesection">
                <div className="ratesection-top">
                  <div className="ratesection-top-left">
                    <div>
                      <Rater
                        total={5}
                        rating={this.state.rating && this.state.rating > 0 ? this.state.rating : 3}
                        onRate={this.handleRate.bind(this)}
                      />					   
					  <Confetti active={ this.state.completed } />
                    </div>

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
			
			
			{(this.state.loggedin && (this.props.config.userData.isStudent == true)) && (
              <div className="game-relatedGames game-sidebar-box">
                <h3>
                  {this.props.config.profile}
                </h3>
				<div>
				   <img  className="game-profile-image" src="https://dtml.org/images/trophy.png" alt={this.props.config.profile} />
			    </div>
				<p className="game-profile">
                  {this.props.config.trophies} 
				  {this.props.config.playmore}
				   <a
                    className="game-registerButton"
                    href="https://dtml.org/Student/PersonalProfile"
					onClick={() => recordclick('studentProfile')}
                  >
                    {this.props.config.yourProfile}
                  </a>
				</p>
              </div>
)}

	{(!this.state.loggedin) && (
              <div className="game-relatedGames game-sidebar-box">
			  <h3>{this.props.config.register}</h3>	
                <p className="game-registerExplainer">
				    <img  className="game-profile-image" src={this.state.image} alt={this.props.config.register} />
                  <p className='TextCenter'>{this.props.config.registerMessage} </p>
                </p>
                <p className='TextCenter'>
                  <a
                    className="game-registerButton"
                    href="https://dtml.org/Registration/Student"
					onClick={() => recordclick('registerStudent')}
                  >
                    {this.props.config.register}
                  </a>
                </p>
              </div>
)}
                                                                                                       
{this.props.config.games && (
                <div className="game-relatedGames game-sidebar-box">
                  <h3>{this.props.config.morevideos || 'More videos'}</h3>

                  {// shuffle all games, remove our current game, trim to 3 games, then display them
                                   arrayShuffle(this.props.config.videos || [])
                                       .filter(video => video.VideoID !== this.state.videoContent.VideoID)
                    .slice(0, 3)
                    .map((video, i) => {
                      const j = i + 1;
                      return (
                        <div key={`game-${j}`} className="related-game">
                              <a href={`/video/details/${video.VideoID}`}>{video.Title}</a>
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
					onClick={() => recordclick('registerSchoolButton')}
                  >
                    {this.props.config.registerSchoolButton}
                  </a>
                </p>
              </div>)}
            </aside>
          </div>
        </div>
      </div>
    );
  }
}

export default VideoContent;
