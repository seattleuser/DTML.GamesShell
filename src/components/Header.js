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
import { isEmpty, keys } from "lodash";
import ReactGA from "react-ga";
import "babel-polyfill";
import "../css/style.css";

const imageurl = `/`;
const loginURL = `https://dtml.org/Activity/GetUserName`;

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedin: false,
      username: ``,
      showBanner: false
    };
  }
  
  componentWillMount() {
    const that = this;
    fetch(loginURL, { credentials: `include` })
      .then(response => {
        if (response.status >= 400) {
          console.log(`Bad response from server`);
          that.setState({ loggedin: false });
          window.store.loggedin = false;
        }
        return response.json();
      })
      .then(data => {
        that.setState({ username: data });
        window.store.username = data;
        if (data !== ``) {
          that.setState({ loggedin: true });
          window.store.loggedin = true;
        }
      })
      .catch(error => {
        console.log(`Request failed ${error}`);
      });

	  that.setState({ showBanner: false});   
   
  }

  render() {
    let custom = [];
    let Logo;
    let logoImageUrl = `${imageurl}images/logo-main.png`;
    let menuColor = ``;
    if (!isEmpty(this.props.config.customization)) {
      custom = this.props.config.customization;
      logoImageUrl = custom.logoURL;
      document.body.style.background = this.props.config.customization.BackgroundColor;
	  document.body.style.backgroundURL ='';
      menuColor = custom.MenueColor;
	   try
	  {
      ReactGA.event({
      category: `Customization_PageLoad`,
      label: custom.OrganizationName
     })
	 }
	  catch(e) {}
    }

    if (logoImageUrl && logoImageUrl !== ``) {
      Logo = (
        <a href="https://dtml.org">
          <img src={logoImageUrl} alt="DTML Logo" style={{ height: `37px` }} />
        </a>
      );
    }

    const closeSupport = () => {
      this.setState({ showBanner: false});
      localStorage.setItem(`showBanner`, `false`);
	  try
	  {
      ReactGA.event({
        category: `Share`,
        action: `Close`, 
	    label:window.store.countryName
      });
	  }
	  catch(e) {}
    };

    return (
      <div className="header">
        {this.state.showBanner && (
          <div className="support-banner">
            <p>
              <span className="support-banner-icon">
                <svg
                  fill="currentColor"
                  preserveAspectRatio="xMidYMid meet"
                  height="20"
                  width="20"
                  viewBox="0 0 40 40"
                >
                  <g>
                    <path d="m25.9 30.7v-3.6q0-0.3-0.2-0.5t-0.6-0.2h-2.1v-11.4q0-0.3-0.2-0.5t-0.5-0.2h-7.2q-0.3 0-0.5 0.2t-0.2 0.5v3.6q0 0.3 0.2 0.5t0.5 0.2h2.2v7.1h-2.2q-0.3 0-0.5 0.2t-0.2 0.5v3.6q0 0.3 0.2 0.5t0.5 0.2h10q0.4 0 0.6-0.2t0.2-0.5z m-2.9-20v-3.6q0-0.3-0.2-0.5t-0.5-0.2h-4.3q-0.3 0-0.5 0.2t-0.2 0.5v3.6q0 0.3 0.2 0.5t0.5 0.2h4.3q0.3 0 0.5-0.2t0.2-0.5z m14.3 9.3q0 4.7-2.3 8.6t-6.3 6.2-8.6 2.3-8.6-2.3-6.2-6.2-2.3-8.6 2.3-8.6 6.2-6.2 8.6-2.3 8.6 2.3 6.3 6.2 2.3 8.6z" />
                  </g>
                </svg>
              </span>
              {this.props.config.shareTitle}
              <br />
              {this.props.config.shareBody}
            </p>
			
	   <div className="stripe-button-el">
	    <div className="fb-share-button" data-href="https://dtml.org/esl/" data-layout="button_count" data-size="large" data-mobile-iframe="true"><a target="_blank"  rel="noopener noreferrer" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fgames.dtml.org%2Fgames%2F&amp;src=sdkpreparse" className="fb-xfbml-parse-ignore">{this.props.config.shareButton}</a></div>
	    </div>
			
            <button className="close-support" onClick={() => closeSupport()}>
              close X
            </button>
          </div>
        )}
        <div
          className="logosection"
          style={!isEmpty(menuColor) ? { background: menuColor } : null}
        >
          <div className="logosection-main">
            <div className="logosection-main-left">{Logo}</div>

            {!this.state.loggedin ? (
              <div className="logosection-main-right">
                <div className="logosection-main-right01">
                  {!this.props.config.customization ? (
                    <ul>
                      <li>
                        <a href="https://dtml.org">{this.props.config.home}</a>
                      </li>
                      <li>
                        <a href="/esl/leaderboard/scores">{this.props.config.Leaderboard}</a>
                      </li>
                      <li>
                        <a href="https://jaasfoundation.org/about-us/">
                          {this.props.config.blog}
                        </a>
                      </li>
                    </ul>
                  ) : (
                    <ul>
                      {keys(custom.Menue).map(key => (
                        <li>
                          <a href={custom.Menue[key].Value}>
                            {custom.Menue[key].Key}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <div className="logosection-main-right02">
                  <h6>
                    <a
                      href={`https://dtml.org/Account/Login?ReturnUrl=${
                        window.location.href
                      }`}
                    >
                      {this.props.config.login}
                    </a>
                  </h6>
                </div>
              </div>
            ) : (
              <div className="logosection-main-right">
                <div className="logosection-main-right01">
                  <ul>
                    <li>
                      {` `}
                      <a
                        href="https://dtml.org/Student/PersonalProfile"
                        title={`${this.props.config.hello}, ${
                          this.state.username
                        }`}
                      >
                        {this.props.config.hello}, {this.state.username}
                      </a>
                    </li>
                    <li>
                      <a href="https://dtml.org/Student/PersonalProfile">
                        {this.props.config.profile}
                      </a>
                    </li>
                    <li>
                      <a href="https://dtml.org/esl/">
                        {this.props.config.game}
                      </a>
                    </li>
                    <li>
                      <a href="https://dtml.org/Account/LogOffExternal">
                        {this.props.config.logoff}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  
	}

}

export default Header;
