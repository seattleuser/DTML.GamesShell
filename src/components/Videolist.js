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
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import ReactGA from "react-ga";
import arrayShuffle from "array-shuffle";
import { isEmpty } from "lodash";
import { Link } from "react-router-dom";
import "babel-polyfill";
import * as utils from './utils.js';
import "react-responsive-carousel/lib/styles/carousel.min.css";

var Carousel = require('react-responsive-carousel').Carousel;

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

let themes = ["brown", "brown", "blue", "grey"];

class VideoList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
            sortProperty: `initial`,
            sortAsc: true
        };
        this.sortGamesArray(`random`);
        videosList = props.config.videos;
        console.log(props);
    }

    componentDidMount() {
        if (localStorage) {
            let index = localStorage.getItem('data-theme-index');
            document.documentElement.setAttribute("data-theme", themes[index]);
        }
    }

    videoSelected(listItem) {
        this.props.Selected(false, listItem);
    }

    bannerChange(index) {
        ReactGA.event({
            category: `BannerChange`,
            action: `click`,
        });

        if (localStorage) {
            localStorage.setItem('data-theme-index', index);
        }
        document.documentElement.setAttribute("data-theme", themes[index]);
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
                        a.id.localeCompare(b.id)
                    );
                });
            } else {
                videosList = arrayShuffle(videosList);
            }
        }
    }

    render() {

        let index = 0;
        if (localStorage) index = localStorage.getItem('data-theme-index');
        let bannerImageUrl = `/images/banner_new.jpg`;
        let titleStyle = {};
        const customization = !isEmpty(this.state.config.customization);
        console.log(this.props);

        if (customization) {
            const custom = this.state.config.customization;
            bannerImageUrl = custom.BannerURL;
            titleStyle = { color: utils.invertColor(custom.BackgroundColor) };
        }

        if (!isEmpty(this.state.config)) {
            let counter = 0;
            const that = this;

            listcontent = videosList.map(listItem => {
                counter += 1;
                return (

                    <Card className="videoCardStyle">
                        <Link style={{ color: '#fff' }}
                            onClick={that.videoSelected.bind(that, listItem)}
                            to={`/videos/details/${listItem.VideoID}`}
                        >
                            <Card.Img variant="top" src={listItem.Image} />
                        </Link>
                        <Card.Body className='videoCardBody'>
                            <Card.Title style={{ height: '50px', overflow: 'hidden' }}>{getFirstLine(listItem.Title)}</Card.Title>
                            <Card.Text style={{ height: '150px', overflow: 'hidden' }}>
                                {getFirstLine(listItem.Description)}
                        </Card.Text>
                            <Button variant="primary">
                                <Link style={{ color: '#fff' }}
                                onClick={that.videoSelected.bind(that, listItem)}
                                    to={`/videos/details/${listItem.VideoID}`}
                                >{this.state.config.watchVideo || 'Watch Video'}</Link></Button>
                            </Card.Body>
                            <Card.Footer>
                            <b>Earn up to {listItem.MaxPoints} points</b>
                            </Card.Footer>
                        </Card>
                    );
            });
        }

        return (
            <div>
                <Carousel showArrows={true} selectedItem={index} showThumbs={false} showStatus={false} onChange={this.bannerChange}>
                    <div>
                        {bannerImageUrl && bannerImageUrl !== '' && (<img src={bannerImageUrl} alt="Banner" />)}
                    </div>
                    <div>
                        {bannerImageUrl && bannerImageUrl !== '' && (<img src="/images/banner4.png" alt="Banner" />)}
                    </div>
                    <div>
                        {bannerImageUrl && bannerImageUrl !== '' && (<img src="/images/banner3.png" alt="Banner" />)}
                    </div>
                    <div>
                        {bannerImageUrl && bannerImageUrl !== '' && (<img src="/images/banner2.png" alt="Banner" />)}
                    </div>

                </Carousel>
                <div className="contentsection">
                    <div className="contentsection-main">
                        <div className="contentsection-main-top">
                            <h6 style={titleStyle}>{this.state.config.title}</h6>                           
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
