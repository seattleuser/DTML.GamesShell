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
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ReactGA from "react-ga";
import arrayShuffle from "array-shuffle";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import "babel-polyfill";
import * as utils from './utils.js';
import Banner from "./Banner";

let listcontent = [];
let videosList = [];

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


class VideoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
            sortProperty: `initial`,
            sortAsc: true,
            searchstring: ``
        };

        this.sortGamesArray(`random`);
        videosList = props.config.videos;
        console.log(props);
    }

    componentDidMount() {
    }

    videoSelected(listItem) {
        this.props.Selected(false, listItem);
    }

    sortChange(sortParameter) {
        this.sortGamesArray(sortParameter);
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

    sortGamesArray(sortParameter = `random`) {
        if (sortParameter !== `initial`) {
            if (sortParameter === this.state.sortProperty) {
                this.setState({ sortAsc: !this.state.sortAsc });
            } else {
                this.setState({ sortProperty: sortParameter });
                this.setState({ sortAsc: false });
            }
            if (sortParameter !== `random`) {
                videosList.sort((a, b) => {
                    const multiplier = this.state.sortAsc ? 1 : -1;
                    return (
                        (a[sortParameter] - b[sortParameter]) * multiplier ||
                        a.Title.localeCompare(b.Title)* multiplier
                    );
                });
            } else {
                videosList = arrayShuffle(videosList);
            }
        }
    }

    render() {

        let titleStyle = {};
        
        const customization = !isEmpty(this.state.config.customization);
 
        if (customization) {
            const custom = this.state.config.customization;
            titleStyle = { color: utils.invertColor(custom.BackgroundColor) };
        }

        if (!isEmpty(this.state.config)) {
            let counter = 0;
            const that = this;

            listcontent = videosList.map(listItem => {
                counter += 1;
                let maxpointslabel  = this.state.config.earnpoints.replace("{0}",listItem.MaxPoints);
                return (
                    ( that.state.searchstring == null || that.state.searchstring == "" || listItem.Title.toLowerCase().indexOf(that.state.searchstring.toLowerCase()) !== -1 ||  
                      listItem.Description.toLowerCase().indexOf(that.state.searchstring.toLowerCase()) !== -1) &&(
                    <Card className="videoCardStyle">
                        <Link style={{ color: '#fff' }}
                            onClick={that.videoSelected.bind(that, listItem)}
                            to={`/videos/details/${listItem.VideoID}`}
                        >
                            <Card.Img variant="top" src={listItem.Image} />
                        </Link>
                        <Card.Body className='videoCardBody'>
                            <Card.Title style={{ height: '52px', overflow: 'hidden' }}>{getFirstLine(listItem.Title)}</Card.Title>
                            <Card.Text style={{ height: '100px', overflow: 'hidden' }}>
                                {getFirstLine(listItem.Description)}
                        </Card.Text>
                            <Button variant="primary">
                                <Link style={{ color: '#fff' }}
                                onClick={that.videoSelected.bind(that, listItem)}
                                    to={`/videos/details/${listItem.VideoID}`}
                                >{this.state.config.watchVideo || 'Watch Video'}</Link></Button>
                            </Card.Body>
                            <Card.Footer>
                            <b>{maxpointslabel}</b>
                            </Card.Footer>
                        </Card>)
                    );
            });
        }

        return (
            <div>
                <Banner config={this.state.config} />
                <div className="contentsection">
                    <div className="contentsection-main">
                        <div className="contentsection-main-top">
                            <h6 style={titleStyle}>{this.state.config.title}</h6>                           
              <div className="contentsection-main-top02">
                <div className="contentsection-main-top02-main">
                  <div className="contentsection-main-top02-mainin">
                    <input
                      name=""
                      type="text"
                      onKeyUp={this.searchChange.bind(this)} onBlur={this.recordSearch.bind(this)}
                      placeholder=""
                    />
                    <input
                      name=""
                      className="btn"
                      type="submit"
                      value={this.state.config.search}
                    />
                    <div className="clr" />
                  </div>
                </div>
                <div className="sort-buttons">
                  <button
                    className="sort-button"
                    onClick={() => this.sortChange(`Title`)}
                  >
                    <i className="fa fa-star" />
                    {` `}
                    {this.state.config.sortByRating}
                  </button>
                  <button
                    className="sort-button"
                    onClick={() => this.sortChange(`MaxPoints`)}
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
                            <div className="clr" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default VideoList;
