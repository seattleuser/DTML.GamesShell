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
          return body;
     }
     }). then (body => {
        const options = {
            "uiZIndex": 2000 
        };
          const data = {
              title: this.props.title,
              chunks: [{
                  content: this.props.text,
                  lang:"en-us",
                  mimeType: "text/plain"
              }]
          };

          console.log(data);

          launchAsync(body.token, body.subdomain, data, options)
                .catch(function (error) {
                    console.log("Error in launching the Immersive Reader. Check the console.");
                    console.log(error);
                });
        }      
);
}
  render() {
    return (
      <button className="immersive-reader-button" onClick={()=>this.getTokenAndSubdomainAsync()} data-button-style="iconAndText" data-locale={this.props.locale}></button>
     );
  }
}

export default ImmersiveReader;