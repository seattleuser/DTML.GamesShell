/* eslint-disable react/prefer-stateless-function */
/* eslint-disable import/no-unresolved, import/extensions, import/no-extraneous-dependencies */
import React, { Component } from 'react';
import {
  FacebookShareCount,
  GooglePlusShareCount,
  LinkedinShareCount,
  PinterestShareCount,
  VKShareCount,
  OKShareCount,
  RedditShareCount,
  TumblrShareCount,

  FacebookShareButton,
  GooglePlusShareButton,
  LinkedinShareButton,
  TwitterShareButton,
  PinterestShareButton,
  VKShareButton,
  OKShareButton,
  TelegramShareButton,
  WhatsappShareButton,
  RedditShareButton,
  EmailShareButton,
  TumblrShareButton,
  LivejournalShareButton,
  MailruShareButton,
  ViberShareButton,
  WorkplaceShareButton,
  LineShareButton,
  WeiboShareButton,

  FacebookIcon,
  TwitterIcon,
  GooglePlusIcon,
  LinkedinIcon,
  PinterestIcon,
  VKIcon,
  OKIcon,
  TelegramIcon,
  WhatsappIcon,
  RedditIcon,
  TumblrIcon,
  MailruIcon,
  EmailIcon,
  LivejournalIcon,
  ViberIcon,
  WorkplaceIcon,
  LineIcon,
} from 'react-share';



class Share extends Component {
	
constructor(props) {
    super(props);
	this.state = {
      shareUrl: window.location.href,
      title: props.title,
    };
  }
  
  render() {
    return (
      <div className="Share__container">
        <div className="Share__some-network">
          <FacebookShareButton
            url={this.state.shareUrl}
            quote={this.state.title}
            className="Share__some-network__share-button">
            <FacebookIcon
              size={32}
              round />
          </FacebookShareButton>

          <FacebookShareCount
            url={this.state.shareUrl}
            className="Share__some-network__share-count">
            {count => count}
          </FacebookShareCount>
        </div>
  <div className="Share__some-network">
          <TwitterShareButton
            url={this.state.shareUrl}
            title={this.state.title}
            className="Share__some-network__share-button">
            <TwitterIcon
              size={32}
              round />
          </TwitterShareButton>

          <div className="Share__some-network__share-count">
            &nbsp;
          </div>
        </div>

        <div className="Share__some-network">
          <TelegramShareButton
            url={this.state.shareUrl}
            title={this.state.title}
            className="Share__some-network__share-button">
            <TelegramIcon size={32} round />
          </TelegramShareButton>

          <div className="Share__some-network__share-count">
            &nbsp;
          </div>
        </div>

        <div className="Share__some-network">
          <WhatsappShareButton
            url={this.state.shareUrl}
            title={this.state.title}
            separator=":: "
            className="Share__some-network__share-button">
            <WhatsappIcon size={32} round />
          </WhatsappShareButton>

          <div className="Share__some-network__share-count">
            &nbsp;
          </div>
        </div>

        <div className="Share__some-network">
          <LinkedinShareButton
            url={this.state.shareUrl}
            title={this.state.title}
            windowWidth={750}
            windowHeight={600}
            className="Share__some-network__share-button">
            <LinkedinIcon
              size={32}
              round />
          </LinkedinShareButton>

          <LinkedinShareCount
            url={this.state.shareUrl}
            className="Share__some-network__share-count">
            {count => count}
          </LinkedinShareCount>
        </div>

        <div className="Share__some-network">
          <PinterestShareButton
            url={String(window.location)}
            windowWidth={1000}
            windowHeight={730}
            className="Share__some-network__share-button">
            <PinterestIcon size={32} round />
          </PinterestShareButton>

          <PinterestShareCount url={this.state.shareUrl}
            className="Share__some-network__share-count" />
        </div>

        <div className="Share__some-network">
          <VKShareButton
            url={this.state.shareUrl}
            windowWidth={660}
            windowHeight={460}
            className="Share__some-network__share-button">
            <VKIcon
              size={32}
              round />
          </VKShareButton>

          <VKShareCount url={this.state.shareUrl}
            className="Share__some-network__share-count" />
        </div>

        <div className="Share__some-network">
          <OKShareButton
            url={this.state.shareUrl}
            windowWidth={660}
            windowHeight={460}
            className="Share__some-network__share-button">
            <OKIcon
              size={32}
              round />
          </OKShareButton>

          <OKShareCount url={this.state.shareUrl}
            className="Share__some-network__share-count" />
        </div>

        <div className="Share__some-network">
          <RedditShareButton
            url={this.state.shareUrl}
            title={this.state.title}
            windowWidth={660}
            windowHeight={460}
            className="Share__some-network__share-button">
            <RedditIcon
              size={32}
              round />
          </RedditShareButton>

          <RedditShareCount url={this.state.shareUrl}
            className="Share__some-network__share-count" />
        </div>

        <div className="Share__some-network">
          <TumblrShareButton
            url={this.state.shareUrl}
            title={this.state.title}
            windowWidth={660}
            windowHeight={460}
            className="Share__some-network__share-button">
            <TumblrIcon
              size={32}
              round />
          </TumblrShareButton>

          <TumblrShareCount url={this.state.shareUrl}
            className="Share__some-network__share-count" />
        </div>

        <div className="Share__some-network">
          <LivejournalShareButton
            url={this.state.shareUrl}
            title={this.state.title}
            description={this.state.shareUrl}
            className="Share__some-network__share-button"
          >
            <LivejournalIcon size={32} round />
          </LivejournalShareButton>
        </div>

        <div className="Share__some-network">
          <MailruShareButton
            url={this.state.shareUrl}
            title={this.state.title}
            className="Share__some-network__share-button">
            <MailruIcon
              size={32}
              round />
          </MailruShareButton>
        </div>

        <div className="Share__some-network">
          <EmailShareButton
            url={this.state.shareUrl}
            subject={this.state.title}
            body={"Checkout this cool game: "+this.state.shareUrl}
            className="Share__some-network__share-button">
            <EmailIcon
              size={32}
              round />
          </EmailShareButton>
        </div>
        <div className="Share__some-network">
          <ViberShareButton
            url={this.state.shareUrl}
            title={this.state.title}
            body="body"
            className="Share__some-network__share-button">
            <ViberIcon
              size={32}
              round />
          </ViberShareButton>
        </div>

        <div className="Share__some-network">
          <WorkplaceShareButton
            url={this.state.shareUrl}
            quote={this.state.title}
            className="Share__some-network__share-button">
            <WorkplaceIcon
              size={32}
              round />
          </WorkplaceShareButton>
        </div>

        <div className="Share__some-network">
          <LineShareButton
            url={this.state.shareUrl}
            title={this.state.title}
            className="Share__some-network__share-button">
            <LineIcon
              size={32}
              round />
          </LineShareButton>
        </div>

        <div className="Share__some-network">
          <WeiboShareButton
            url={this.state.shareUrl}
            title={this.state.title}
            className="Share__some-network__share-button">
            <img className="Share__some-network__custom-icon" src="http://icons.iconarchive.com/icons/martz90/circle-addon2/512/weibo-icon.png" alt="Weibo share button" />
          </WeiboShareButton>
        </div>
      </div>
    );
  }
}

export default Share;