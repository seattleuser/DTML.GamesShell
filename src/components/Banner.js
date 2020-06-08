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
import "react-responsive-carousel/lib/styles/carousel.min.css";
var Carousel = require('react-responsive-carousel').Carousel;

const imageurl = `/`;
let themes = ["brown", "brown", "blue", "grey"];

class Banner extends Component {
  constructor(props) {
    super(props);
  }
  

    componentDidMount()
  {
      if (localStorage) {
          let index = localStorage.getItem('data-theme-index');
          document.documentElement.setAttribute("data-theme", themes[index]);
      }
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

  render() {
    let index = 0;
    if (localStorage) index = localStorage.getItem('data-theme-index');
    let bannerImageUrl = `/images/banner_new.jpg`;

    if (this.props.config.customization) {
      const custom = this.props.config.customization;
      bannerImageUrl = custom.BannerURL;
    }

    return (
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
    );
  
	}
}

export default Banner;


