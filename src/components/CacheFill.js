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

import "babel-polyfill";
import 'core-js/es6/map';
import 'core-js/es6/set';

import React, { Component } from "react";
import ReactGA from "react-ga";


import "../css/font-awesome.min.css";
import "../css/responsive.css";

let gamesList = [];
let count = 0;
let start = Date.now();

class CacheFill extends Component {
    constructor(props) {
        super(props);
        this.state = {
            config: props.config,
            loaded: 0,
            start: Date.now()
        };
        gamesList = props.config.games;
    }
    getInitialState(){
        return { elapsed: 0 };
  }

    countCache() {
        count++;
    }

   gamelist() {
       let table = [];
       const userLang = navigator.language || navigator.userLanguage;
       gamesList.map(listItem => {
           table.push(<iframe
               onLoad={this.countCache()}
               src={(listItem.url.indexOf('?') > 0) ? `${listItem.url}&mkt=${userLang}` : `${listItem.url}?&mkt=${userLang}`}
           />)
       });

       table.push(<iframe
           onLoad={this.countCache()}
           src='https://dtml.org/Account/Login'
       />)

       table.push(<iframe
           onLoad={this.countCache()}
           src='https://dtml.org/esl'
       />)

       return table;
    }

    componentWillUnmount(){
      clearInterval(this.timer);
}

    componentDidMount() {
        ReactGA.event({
            category: `PreLoad`,
            action: `PageShown`,
            label: window.store.countryName
        });

        this.timer = setInterval(() => { this.setState({ elapsed: new Date() - start }); var elapsed = Math.round(this.state.elapsed / 100); if (elapsed >= 2000) clearInterval(this.timer);}, 123);
    }

    render() {
        var elapsed = Math.round(this.state.elapsed / 100);
        var seconds = (elapsed / 20).toFixed(1);  
        if (seconds > 100) seconds = 100;

        return (
            <div className='notsupported-wrapper'>
                <h2>Limited internent connectivity Pre-Caching</h2>
                <span>This page pre-loads components needed for the site into local browser cache. Visit this page on all computers in your class before class starts</span>
                <div className="browsers-container">
                    <ul className="supported-browsers-list">
                        <li className="supported-browsers-list-item ">
                            <div className="supported-browser-information">
                                Loading Assets
                            </div>
                            <div className="supported-browser-download">
                                {count} 
                            </div>
                            <div className="clearfix"></div>
                        </li>
                        <li className="supported-browsers-list-item">
                            <div className="supported-browser-information">
                              Loading games
                             </div>
                            <div className="supported-browser-download">
                                {seconds} %
                            </div>
                            <div className="clearfix"></div>
                        </li>
                    </ul>
                </div>

                <div style={{ display: 'none' }}>
                    {this.gamelist()}
                </div>
            </div>

        );

    }
}

export default CacheFill;
