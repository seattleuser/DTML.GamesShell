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
import ReactGA from "react-ga";


import "../css/font-awesome.min.css";
import "../css/responsive.css";

class NotSupported extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: props.config
    };
  }

  componentDidMount() {
		    ReactGA.event({
      		    category: `NotSupported`,
       		    action: `PageShown`,
		    label:window.store.countryName
     		 }); 
   }

  render() {
    return (
    <div className='notsupported-wrapper'>
    <h2>We do not support the browser version you are using</h2>
    <span>You are seeing this page because we detected an unsupported browser. Your browser does not support security features that we require. We highly recommend that you update your browser. If you believe you have arrived here in error, please contact us. Be sure to include your browser version.</span>
            <div className="browsers-container">
                <br/>
                <a href='https://dtml.org'> Go to DTML home page </a>

        <h2 className="supported-intro">Browsers we recommend:</h2>

        <ul className="supported-browsers-list">

            <li className="supported-browsers-list-item browser-chrome">

                <div className="supported-browser-information">
                    Google Chrome
                </div>

                <div className="supported-browser-download">
                    <a href="https://www.google.com/intl/en/chrome/browser/" target="_blank" rel="noopener noreferrer">
                        Download latest
                    </a>
                </div>
                <div className="clearfix"></div>
            </li>
            <li className="supported-browsers-list-item browser-firefox">
                <div className="supported-browser-information">
                    Mozilla Firefox
                </div>
                <div className="supported-browser-download">
                    <a href="https://www.mozilla.org/firefox/all/" target="_blank" rel="noopener noreferrer">
                        Download latest
                    </a>
                </div>
                <div className="clearfix"></div>
            </li>
            <li className="supported-browsers-list-item browser-opera">
                <div className="supported-browser-information">
                    Microsoft Edge
                </div>
                <div className="supported-browser-download">
                    <a href="https://www.microsoft.com/en-us/download/details.aspx?id=48126" target="_blank" rel="noopener noreferrer">
                        Download latest
                    </a>
                </div>
                <div className="clearfix"></div>
            </li>
            <li className="supported-browsers-list-item browser-safari">
                <div className="supported-browser-information">
                    Apple Safari
                </div>
                <div className="supported-browser-download">
                    <a href="https://itunes.apple.com/us/app/os-x-yosemite/id915041082" target="_blank" rel="noopener noreferrer">
                        Download latest
                    </a>
                </div>
                <div className="clearfix"></div>
            </li>
        </ul>
    </div>
</div>
    );
  }
}

export default NotSupported;
