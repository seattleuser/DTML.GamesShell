/* The Distance Teaching and Mobile learning licenses this file
to you under the Apache License, Version 2.0 (the "License"); 
you may not use this file except in compliance
with the License.  You may obtain a copy of the License at

  https://www.apache.org/licenses/LICENSE-2.0

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
import Button from 'react-bootstrap/Button';
import arrayShuffle from "array-shuffle";
import "babel-polyfill";
import * as utils from './utils.js';
import Confetti from 'react-dom-confetti';
import ReactPlayer from "react-player"
import Countdown from "react-countdown";

const rankingURL = `https://dtml.org/api/RatingService/Rank`;
const loadVideoActivityURL = `https://dtml.org/api/UserService/LoadVideoActivty`;
const recordVideoActivityURL = `https://dtml.org/api/UserService/VideoActivty`;
let usrAnswers = [];

let AllPoints = 0;
let VideosWatched = 0;

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
      completed: false,
      loading: true,
      image: 'https://dtml.org/images/avatars/a' + rand + ".png",
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

    AllPoints = 0;
    VideosWatched = 0;
    fetch(loadVideoActivityURL, { credentials: `include`, cache: "no-store" })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      else {
        this.setState({ userVideoStats: null });
      }
    })
    .then(data => {  console.log(data); this.setState({ userVideoStats: data }); })
    .catch(err => {  this.setState({ userVideoStats: null }); });

    const userLang = navigator.language || navigator.userLanguage;
    this.setState({ userLanguage: userLang });
    this.setState({ customization: this.props.config.customization });
    this.setState({ loggedin: this.props.config.userData !== null });
    this.setState({ answered:false});
  }

  recordVideoAnswers(videoID, points, correct, total){
    let url  = recordVideoActivityURL+"/?videoID="+videoID+"&points="+points+"&correct="+correct+"&total="+total;
    fetch(url, {
      method: `post`,
      credentials: `include`
    });
  }

  checkAnswers(sender) {
       let allAnswers = true;
       let correct = 0;
       let points = 0;
       for(let i=0;i<usrAnswers.length;i++)
       {
         if (usrAnswers[i] == -1) allAnswers=false;
         if (usrAnswers[i] > 0) { correct++; points+=parseInt(usrAnswers[i],10);}
       }

      if (!allAnswers)
      {
        let el = document.getElementById("answerLabel");
        el.innerText = this.state.config.answerall;     
        () => this.recordclick('Check_answers_Validation');  
      }
      else
      {
        this.setState({ answered:true});
        let el = document.getElementById("answerLabel");
        el.innerText = correct +' out of '+ usrAnswers.length+' answers are correct. Total points earned: '+points+".  You can try again in 1 hour";  
        this.recordVideoAnswers(this.state.videoContent.VideoID, points,correct,usrAnswers.length); 
        () => this.recordclick('Check_answers_All_selected');        
      }

      VideosWatched=VideosWatched+1;
      AllPoints+=points;
  }

  setAnswer(event)
  {
    let score = 0;
    let correct = JSON.parse(event.target.dataset.value.toLowerCase());
    if (correct) score=event.target.dataset.points;
    usrAnswers[event.target.dataset.index] =score; 
  }

  handleRate({ rating, type }) {
    if (type === `click`) {
      this.setState({ rating: rating });
      this.setState({ completed: true });
      const url = `${rankingURL}/?key=${
        this.state.videoContent.VideoID
        }&rank=${rating}&isVideo=true`;

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

    const Completionist = () => <span></span>;

    const renderer = ({ hours, minutes, seconds, completed }) => {
      if (completed) {
        // Render a complete state
        return <Completionist />;
      } else {
        // Render a countdown
        return (
          <span>
            {hours}:{minutes}:{seconds}
          </span>
        );
      }
    };

    const recordclick = (value) => {

      try {
        ReactGA.event({
          category: `click`,
          action: value,
          label: this.state.image
        });
      }
      catch (e) { }
    };

    let titleStyle = {};
    if (this.state.customization) {
      titleStyle = { color: utils.invertColor(this.state.customization.BackgroundColor) };
    }  

    let buttonStyle = {};
    let linkStyle = {};

    if (this.state.answered == true) {
      buttonStyle = { display: 'none' };
      linkStyle = { color: 'green' };
    } 

     let videoStats = this.state.userVideoStats;
     let now = Date.now();   
     let needToWait = null;
     let lastAttempt  = Date.now();
     let thisVideoRecord = null;

     if (videoStats !=undefined)
     {
      needToWait = false;
      console.log('--');
      console.log(AllPoints);
      console.log(VideosWatched);
      let shouldCalculate  = (AllPoints == 0 || VideosWatched == 0);
      videoStats.map(record =>{
        if (shouldCalculate)
        {
        AllPoints = AllPoints + parseInt(record.Value.EarnedPoints);
        VideosWatched++;
        }
       if (record.Key.toUpperCase() == this.state.videoContent.VideoID.toUpperCase())
       {
         let value = record.Value;        
         thisVideoRecord = value;
         let stringDate = value.LastAttempt.replace(/[^0-9 +]/g, ''); 
         lastAttempt = new Date(parseInt(stringDate));
         lastAttempt.setHours(lastAttempt.getHours() + 1); 
         console.log(lastAttempt);
         if (lastAttempt > now)
        {
          needToWait  = true;
        }
       }
      })     
     }
     
     let checkColor = "red";

     if (thisVideoRecord)
     {
     if ((thisVideoRecord.Correct > 0) && (thisVideoRecord.Correct < thisVideoRecord.Total)) checkColor = "yellow";
     if  ((thisVideoRecord.Correct > 0) && (thisVideoRecord.Correct == thisVideoRecord.Total)) checkColor = "green";
     }

    let instruction = null;
    const today = new Date();
    const date = `${today.getFullYear()}${today.getMonth()}${today.getDate()}`;
    const url = "https://www.youtube.com/watch?v=" + this.state.videoContent.VideoID + "&modestbranding=1&loop=1&playlist=" + this.state.videoContent.VideoID;
    let counter = 0;
    usrAnswers = [];

    let questions = this.state.videoContent.Questions.map(question => {
      counter += 1;
      let answerCounter = 0;
      usrAnswers.push(-1);
      let qArr = arrayShuffle(question.Answers);
      let answers = qArr.map(answer => {     
      let groupName = 'answerGroup_' + counter;
        let id = groupName + "_" + answerCounter;
        if (answer.Answer != '') {
          answerCounter++;
          return (
            <div className="custom-control custom-radio" > 
                <div className="input-group-radio" onChange={this.setAnswer.bind(this)}>
                      <input id={id} type="radio" className="custom-control-input"  data-index={counter-1} data-value={answer.isCorrect} data-points={question.Points} aria-label="Radio button for anwsers" value={answerCounter} name={groupName} />
                      <label className="custom-control-label" htmlFor={id}>{answer.Answer}</label>
            </div>
            </div>
          )
        }
      });

      return (
        <div>
          <b style={{ padding: "10px" }}> Question {counter}. {question.Question}  ({question.Points} points)</b>
          <div style={{ padding: '30px', paddingTop: '10px' }}>{answers}</div>
        </div>
      )
    });

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
                <div id="videoPlayer" style={{ textAlign: 'center'}}>
                  <ReactPlayer url={url} style={{ display: 'inline-block' }} />
                  <div>
                    <Rater
                      total={5}
                      rating={this.state.rating && this.state.rating > 0 ? this.state.rating : 3}
                      onRate={this.handleRate.bind(this)}
                    />
                  </div>
                </div>
              </div>

              <h3>{this.state.config.watchandAnswer} {(((thisVideoRecord  && thisVideoRecord.NumberOfAttempts > 0)) && this.state.loggedin && (this.props.config.userData.isStudent == true)) && 
              (
              <span style={{color:checkColor}} onClick={() => recordclick('popup_click')} onMouseLeave={() => recordclick('popup_hower')} className='fa fa-check-square-o tooltipcheck'>
              <div className="tooltiptext">
                <span>Your stats</span>
                <hr/>
              <div>Number of attempts: {thisVideoRecord.NumberOfAttempts}</div>
              <div>Last attempt: {thisVideoRecord.Correct} out of {thisVideoRecord.Total} correct</div>
              <div>Points collected: {thisVideoRecord.EarnedPoints}</div>
                </div>
               </span>)}</h3> 
              
              <div style={{ paddingTop: "40px" }}> {questions}</div>
              <div style={{ padding: '10px' }}></div>

              {((needToWait == false) && this.state.loggedin && (this.props.config.userData.isStudent == true)) && (
                <Button style={buttonStyle} onClick={() => this.checkAnswers(this.state)} variant="primary">{this.state.config.checkbtn}</Button>)}

              {((needToWait != false) && this.state.loggedin && (this.props.config.userData.isStudent == true)) && (
                <div style={{color:'green', padding:'10px'}}><span>{this.state.config.needwait}</span> <Countdown date={lastAttempt} renderer={renderer} />. <br></br>{this.state.config.tryother}</div>)}

              {(this.state.loggedin && (this.props.config.userData.isStudent != true)) && (
                <label className='answersLabel'>You are currently signed in with school account. You must be logged-in with student account to check answers.</label>
              )}

              {(!this.state.loggedin) && (
                <label className='answersLabel'>You must be logged-in to check answers. <a onClick={() => recordclick('login_from_videos')} href='https://dtml.org/Account/Login'>Login</a> or register to create <a onClick={() => recordclick('register_from_videos')} href='https://dtml.org/Registration/Student'>FREE account</a> now.</label>
              )}

              <label id='answerLabel' style={linkStyle} className='answersLabel'></label>
              <Confetti active={ this.state.answered } />
              <div style={{ padding: '5px' }}>
              <a  onClick={() => recordclick('backToListOfVideos')} href='/esl/videos/view'>Back to the list of videos</a></div>
              <div style={{ padding: '20px' }}></div>
            </div>

            <aside className="game-sidebar">


              {(this.state.loggedin && (this.props.config.userData.isStudent == true)) && (
                <div className="game-relatedGames game-sidebar-box">
                  <h3>
                    {this.props.config.profile}
                  </h3>
                  <div>
                    <img className="game-profile-image" src="https://dtml.org/images/trophy.png" alt={this.props.config.profile} />
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

                {(this.state.loggedin && (AllPoints > 0) && (this.props.config.userData.isStudent == true)) && (
                <div className="game-relatedGames game-sidebar-box">
                  <h3>
                     Video Stats
                  </h3>
                  <h4 className='TextCenter' style={{paddingTop:10}}>
                      {AllPoints} Video Points
                  </h4>
                  <h5 className='TextCenter'>You have watched {VideosWatched} videos</h5>

                  <p className="game-profile">
                  </p>
                </div>
                
              )}

              {(!this.state.loggedin) && (
                <div className="game-relatedGames game-sidebar-box">
                  <h3>{this.props.config.register}</h3>
                  <p className="game-registerExplainer">
                    <img className="game-profile-image" src={this.state.image} alt={this.props.config.register} />
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
                      .slice(0, 5)
                      .map((video, i) => {
                        const j = i + 1;
                        return (
                          <div key={`game-${j}`} className="related-game">
                            <a href={`/videos/details/${video.VideoID}`}>{video.Title}</a>
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
