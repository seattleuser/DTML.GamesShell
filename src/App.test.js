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

import React from "react";
import ReactDOM, { findDOMNode } from "react-dom";
import { renderIntoDocument } from "react-dom/test-utils";
import App from "./App";
import Header from "./App";
import Footer from "./App";
import Body from "./App";
import { expect } from "chai";
import { data } from "./gamelist.json";

it(`renders without crashing`, () => {
  const div = document.createElement(`div`);
  ReactDOM.render(<App />, div);
});

it(`should render header (DOM class matching)`, () => {
  const list = renderIntoDocument(<Header />);
  const items = findDOMNode(list).querySelectorAll(`.blog-logo`);
  expect(items.length).to.equal(1);
});

it(`should render footer with social links (DOM class matching)`, () => {
  const list = renderIntoDocument(<Footer />);
  const items = findDOMNode(list).querySelectorAll(`.blog-footer`);
  expect(items.length).to.equal(1);
});

it(`should render body even without list (DOM class matching)`, () => {
  const list = renderIntoDocument(<Body />);
  const bodyContainer = findDOMNode(list).querySelectorAll(`.bodyContainer`);
  const activeClass = findDOMNode(list).querySelectorAll(`.activeClass`);
  expect(bodyContainer.length).to.equal(1);
});

it(`should render bodywith the list (DOM class matching)`, () => {
  const list = renderIntoDocument(<Body list={data} />);
  const bodyContainer = findDOMNode(list).querySelectorAll(`.bodyContainer`);
  const activeClass = findDOMNode(list).querySelectorAll(`.activeClass`);
  expect(bodyContainer.length).to.equal(1);
  expect(activeClass.length).to.equal(1);
});
/* eslint-enable */
