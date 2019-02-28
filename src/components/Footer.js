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
import { isEmpty } from "lodash";
import { css } from 'glamor';
import "../css/font-awesome.min.css";
import "../css/responsive.css";
import postal from 'postal';

const imageurl = `/`;

class Footer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: props.config
    };
    this.makeBugReporterVisible = this.makeBugReporterVisible.bind(this);
    this.channel = postal.channel('BugReporterVisibility');
  }

  makeBugReporterVisible(){
    this.channel.publish("togglevisibility");
  }

  render() {
    let footerImageUrl = `${imageurl}images/footerbg-01.png`;
	let customizedRules = css({});
    if (!isEmpty(this.props.config.customization)) {
      footerImageUrl = this.props.config.customization.FooterURL;
	  customizedRules = css({
						  background: this.props.config.customization.MenueColor,
						});
    }
	
	return (
      <div>
        <div className="footertop-section">
		
		{this.footerImageUrl && this.footerImageUrl !==`` && (<img src={footerImageUrl} alt="Footer" />)}
        </div>
        <div className="footersecion" {...customizedRules}>
          <div className="footersecion-main">
            <div className="footersecion-main-left">
              <ul>
                <li>
                  <a href="https://www.facebook.com/distantteaching/">
                    <i className="fa fa-facebook" />
                  </a>
                </li>
                <li>
                  <a href="https://twitter.com/DistantTeaching">
                    <i className="fa fa-twitter" />
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/company/distant-teaching-and-mobile-learning">
                    <i className="fa fa-linkedin" />
                  </a>
                </li>
                <li>
                  <a href="https://www.youtube.com/channel/UCwF13kloyxnifaNCHQUL2rQ/featured">
                    <i className="fa fa-youtube" />
                  </a>
                </li>                
                <li>
                  <a href="#" role="button" onClick={() => {this.makeBugReporterVisible()}}>
                    <i className="fa fa-bug" />
                  </a>
                </li>
              </ul>
              <div className="clr" />
            </div>
            <div className="footersecion-main-right">
              <p>
                dtml.org &copy; 2017-2019 All Rights Reserved |{` `}
                <a href="https://dtml.org/Home/TermsandConditions">
                  {this.props.config.terms}
                </a>
                {` `}
              </p>
            </div>
            <div className="clr" />
          </div>
        </div>
      </div>
    );
  }
}

export default Footer;
