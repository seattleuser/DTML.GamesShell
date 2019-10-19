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

import "../css/font-awesome.min.css";
import "../css/responsive.css";

const imageurl = `https://dtml.org/esl;

class Loading extends Component {
  constructor(props) {
    super(props);
    this.state = {
      config: props.config
    };
  }

  render() {
    const loadingImageUrl = `${imageurl}images/gameloading.gif`;
    return (
      <div className="loading">
        <img src={loadingImageUrl} alt="Loading" />
      </div>
    );
  }
}

export default Loading;
