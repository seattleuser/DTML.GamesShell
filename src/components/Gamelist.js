import React, { Component } from 'react'
import Rater from 'react-rater'
import arrayShuffle from 'array-shuffle'
import { isEmpty } from 'lodash'
import { Link } from 'react-router-dom';

const imageurl="https://games.dtml.org/games/";
var listcontent=[];

class Gamelist extends Component {

	constructor(props) {
		super(props)
		this.state= {
			searchstring: '',
			listcounter: 12,
			config : props.config
		}
	}
	
	gameSelected(listItem) {
		this.props.Selected(false, listItem)
	}
	
	getFirstLine(str){
        if (str == null || typeof(str) === "undefined") return ""; 
        var p1 = str.indexOf('.');
	var p2 = str.indexOf('…');
	var breakIndex = p1 > 0 ? p2 > 0 ? Math.min(p1,p2) : p1 : p2 > 0 ? p2 : -1;
	
    if (breakIndex === -1){
		breakIndex = str.indexOf('!');
		if (breakIndex === -1){
                      return str;
		}
    }
    return str.substr(0, breakIndex+1);
	}


	searchChange(e) {
		this.setState({searchstring: e.target.value,})
	}

	showMore() {
		this.setState({listcounter: this.state.listcounter+10})
	}

	render() {
	 	var bannerImageUrl = imageurl + 'images/banner01.jpg'

		if(!isEmpty(this.state.config.customization)) {
			var custom = this.state.config.customization
			bannerImageUrl = custom.BannerURL
		}
		if(!isEmpty(this.state.config)){
			var counter=0;
      var that = this;		
		  listcontent = arrayShuffle(this.state.config.games).map((listItem, i) => {
				counter++;
				if((counter<=that.state.listcounter)&&((listItem.title.indexOf(that.state.searchstring)!==-1) || (listItem.description.indexOf(that.state.searchstring)!==-1))) {
					return(
		        <div className="contentsection-main-middle-box" key={i}>
							<div className="game-content-top">
								<div className="imgsec">
									<img src={imageurl + listItem.image} alt={this.state.config.playgame} />
								</div>
								<h3>{listItem.title}</h3>
								<p>{this.getFirstLine(listItem.description)}</p>
							</div>

						<div className="game-content-middle">
              <Rater total={5} rating={listItem.rating} interactive={false} />
						</div>

              <div className="game-content-bottom">
								<h6><Link onClick={that.gameSelected.bind(that, listItem)} to={`/${listItem.id}`} >{this.state.config.playgame}</Link></h6>
							</div>
		        </div>
					)
				}
				else{
					return null
				}
			})
		}

		return (
		  <div>
				<div className="bannersection_list">
				  <img src={bannerImageUrl} alt="Banner" />
				</div>
				<div className="contentsection">
					<div className="contentsection-main">
					  <div className="contentsection-main-top">
					    <h6>{this.state.config.title}</h6>
					      <div className="contentsection-main-top01">
					        <div className="contentsection-main-top01-main">
					          <div className="contentsection-main-top01-mainin">
					            <input name="" type="text" onKeyUp={this.searchChange.bind(this)} placeholder={this.state.config.findlesson} />
					            <input name="" type="submit" value={this.state.config.search} />
					            <div className="clr"></div>
					          </div>
					        </div>
					      </div>
					  </div>
					  <div className="contentsection-main-middle">
					    {listcontent}
			     	  <h5><a onClick={this.showMore.bind(this)}>{this.state.config.more}</a></h5>
			    		<div className="clr"></div>
					  </div>
					</div>
				</div>
		  </div>
		);
	}
}

export default Gamelist;