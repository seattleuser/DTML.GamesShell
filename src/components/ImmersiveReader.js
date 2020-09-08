import React, { Component } from 'react';
import { renderButtons, close, launchAsync, CookiePolicy }  from  "@microsoft/immersive-reader-sdk";
import ReactGA from "react-ga";

class ImmersiveReader extends Component {

constructor(props) {
    super(props);
	this.state = {
        title: props.title,
        text: props.text,
        locale: props.locale
    };
  }

  componentDidMount () {
    renderButtons();
}

  getTokenAndSubdomainAsync() {

    ReactGA.event({
      category: `immersiveReader`,
      action: `${this.props.title}`
    });

      fetch("https://dtml.org/api/SpeechService/GetTokenAndSubdomain", { credentials: `include`, cache: "no-store" })
      .then(response => {
	 if (response.ok) {
          var body =response.json();
          const options = {
            "uiZIndex": 2000
        };
          const subdomain = body.subdomain;
          const data = {
              title: this.props.title,
              chunks: [{
                  content: this.props.text,
                  mimeType: "text/html"
              }]
          };
          launchAsync(response, subdomain, data, options)
                .catch(function (error) {
                    console.log("Error in launching the Immersive Reader. Check the console.");
                    console.log(error);
                });
        }      
  });
}
  render() {

    return (
      <button className="immersive-reader-button" onClick={()=>this.getTokenAndSubdomainAsync()} data-button-style="iconAndText" data-locale={this.props.locale}></button>
     );
  }
}

export default ImmersiveReader;