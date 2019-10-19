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
import arrayShuffle from "array-shuffle";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import "babel-polyfill";
import * as utils from './utils.js'; 

const imageurl = `https://dtml.org/esl/`;
let listcontent = [];

const getFirstLine = str => {
  if (str == null || typeof str === `undefined`) return ``;
  const p1 = str.indexOf(`.`);
  const p2 = str.indexOf(`…`);
  let breakIndex = p1 > 0 ? (p2 > 0 ? Math.min(p1, p2) : p1) : p2 > 0 ? p2 : -1;

  if (breakIndex === -1) {
    breakIndex = str.indexOf(`!`);
    if (breakIndex === -1) {
      return str;
    }
  }
  return str.substr(0, breakIndex + 1);
};

let gamesList = [];

class Gamelist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchstring: ``,
      listcounter: 12,
      config: props.config,
      sortProperty: `initial`,
      sortAsc: true
    };
    gamesList = props.config.games;
    this.sortGamesArray(`random`);
  }

  gameSelected(listItem) {
    this.props.Selected(false, listItem);
  }

  recordSearch(e) {
    ReactGA.event({
      		  category: `WebAction`,
       		  action: `Search`,
	     	  label: e.target.value
     		 });
  }

  searchChange(e) {
    this.setState({ searchstring: e.target.value });
	
  }

  showMore() {
    this.setState({ listcounter: this.state.listcounter + 10 });
	this.setState({ hideMore: true });
  }

  sortChange(sortParameter) {
    this.sortGamesArray(sortParameter);
  }
  
  sortGamesArray(sortParameter = `random`) {
    if (sortParameter !== `initial`) {
      if (sortParameter === this.state.sortProperty) {
        this.setState({ sortAsc: !this.state.sortAsc });
      } else {
        this.setState({ sortProperty: sortParameter });
        this.setState({ sortAsc: false });
      }
      if (sortParameter !== `random`) {
        gamesList.sort((a, b) => {
          const multiplier = this.state.sortAsc ? 1 : -1;
          return (
            (a[sortParameter] - b[sortParameter]) * multiplier ||
            a.id.localeCompare(b.id)
          );
        });
      } else {
        gamesList = arrayShuffle(gamesList);
      }
    }
  }

  render() {
    let bannerImageUrl = `${imageurl}images/banner_new.jpg`;
	let searchStyle = {display: 'none'};
	let titleStyle ={};
	let hideMoreStyle = this.state.hideMore ? {display:'none'}: {};
	
    if (!isEmpty(this.state.config.customization)) {
      const custom = this.state.config.customization;
      bannerImageUrl = custom.BannerURL;
	  searchStyle = custom.HideSearch ? {display: 'none'} : {};

	  titleStyle = {color: utils.invertColor(custom.BackgroundColor)};
     }

    if (!isEmpty(this.state.config)) {
      let counter = 0;
      const that = this;

      listcontent = gamesList.map(listItem => {
        counter += 1;
        if (
          counter <= that.state.listcounter &&
          (listItem.title.indexOf(that.state.searchstring) !== -1 ||
            listItem.description.indexOf(that.state.searchstring) !== -1)
        ) {
          return (
            <div className="contentsection-main-middle-box" key={counter}>
              <div className="game-content-top">
                <div className="imgsec">
				<Link
                    onClick={that.gameSelected.bind(that, listItem)}
                    to={`/${listItem.id}`}
                  >
				<img
                    src={imageurl + listItem.image}
                    alt={this.state.config.playgame}
                  />
				     </Link>
                </div>
                <h3>{listItem.title}</h3>
                <p>{getFirstLine(listItem.description)}</p>
              </div>

              <div className="game-content-middle">
                <Rater total={5} rating={listItem.rating} interactive={false} />
              </div>

              <div className="game-content-bottom">
                <h6>
                  <Link
                    onClick={that.gameSelected.bind(that, listItem)}
                    to={`/${listItem.id}`}
                  >
                    {this.state.config.playgame}
                  </Link>
                </h6>
              </div>
            </div>
          );
        }

        return null;
      });
    }

    return (
      <div>
        <div className="bannersection_list">
		{bannerImageUrl && bannerImageUrl !=='' && (<img src={bannerImageUrl} alt="Banner" />)}
        </div>
        <div className="contentsection">
          <div className="contentsection-main">
            <div className="contentsection-main-top">
              <h6 style={titleStyle}>{this.state.config.title}</h6>
              <div className="contentsection-main-top01" style={searchStyle}>
					<div className="contentsection-main-top01-main" >
                  <div className="contentsection-main-top01-mainin">
                    <input
                      name=""
                      type="text"
                      onKeyUp={this.searchChange.bind(this)}
		      onBlur={this.recordSearch.bind(this)}
                      placeholder={this.state.config.findlesson}
                    />
                    <input
                      name=""
                      type="submit"
                      value={this.state.config.search}
                    />
                    <div className="clr" />
                  </div>
                </div>
                <div className="sort-buttons">
                  <button
                    className="sort-button"
                    onClick={() => this.sortChange(`rating`)}
                  >
                    <i className="fa fa-star" />
                    {` `}
                    {this.state.config.sortByRating}
                  </button>
                  <button
                    className="sort-button"
                    onClick={() => this.sortChange(`complexity`)}
                  >
                    <i className="fa fa-cogs" />
                    {` `}
                    {this.state.config.sortByComplexity}
                  </button>
                </div>
              </div>
            </div>
            <div className="contentsection-main-middle">
              {listcontent}
              <h5>
                <button onClick={this.showMore.bind(this)} style={hideMoreStyle}>
                  {this.state.config.more}
                </button>
              </h5>
              <div className="clr" />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Gamelist;
