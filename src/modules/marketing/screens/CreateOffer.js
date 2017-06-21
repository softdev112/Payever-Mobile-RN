import { Component } from 'react';
import { inject, observer } from 'mobx-react/native';
import { ErrorBox, NavBar, StyleSheet, View, WebView } from 'ui';
import type CommunicationStore from '../../../store/communication';
import type ProfilesStore from '../../../store/profiles';

@inject('profiles', 'communication')
@observer
export default class CreateOffer extends Component {
  static navigatorStyle = {
    navBarHidden: true,
  };

  props: {
    communication?: CommunicationStore;
    conversationId: string;
    profiles?: ProfilesStore;
  };

  state: {
    btnsDisabled: boolean;
  };

  $webView: WebView;

  constructor(props) {
    super(props);

    this.state = {
      btnsDisabled: true,
    };
  }

  onSendOffer() {
    if (this.$webView) {
      this.$webView.wrappedInstance.injectJS(
        'callWebViewOnMessage({ command: "show-loader" });offerEditApp.send();'
      );
    }
  }

  onEnabledBtns() {
    this.setState({ btnsDisabled: false });
  }

  renderWrongProfile() {
    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="New Offer" />
        </NavBar>
        <ErrorBox
          message={`Please choose another profile for offer creating.
            It should be business not private profile`}
        />
      </View>
    );
  }

  render() {
    const { communication, conversationId, profiles } = this.props;
    const { btnsDisabled } = this.state;
    const profile = profiles.currentProfile;

    const recipients = [];
    if (conversationId && communication.messengerInfo) {
      const conversation = communication.messengerInfo.byId(conversationId);
      if (conversation) {
        recipients.push({
          id: conversation.recipient_id,
          name: conversation.name,
        });
      }
    }

    if (!profile || !profile.isBusiness) {
      return this.renderWrongProfile();
    }

    const uri = profile.getCommunicationUrl() +
      `#conversation/${conversationId}`;

    const js = `(${injectedJs.toString()})(${JSON.stringify(recipients)})`;

    return (
      <View style={styles.container}>
        <NavBar>
          <NavBar.Back />
          <NavBar.Title title="New Offer" showTitle="always" />
          <NavBar.Button
            title="Send"
            disabled={btnsDisabled}
            onPress={::this.onSendOffer}
          />
        </NavBar>
        <WebView
          ref={r => this.$webView = r}
          injectJs={js}
          showLoader
          showNavBar="never"
          source={{ uri }}
          onLoaderHide={::this.onEnabledBtns}
        />
      </View>
    );
  }
}

// eslint-disable-next-line consistent-return
function injectedJs(recipients) {
  /* eslint-disable */
  /** @name callWebViewOnMessage */
  /** @name OfferEditApp */
  /** @name Layout */
  /** @name Layout.OfferAddItemForm */
  /** @name Layout.OfferEditForm */
  /** @name offerEditApp */
  /** @name offerEditApp.show_new */

  if (!window.offerAppStarted) {
    setTimeout(() => {
      offerEditApp.show_new(recipients);
    }, 4000);
    window.offerAppStarted = true;
  }

  fixOfferModal();

  setTimeout(() => {
    callWebViewOnMessage({ command: 'hide-loader' });

    const $modalContent =
      document.querySelector('.modal.fade.offer-edit.in .modal-content');

    if ($modalContent) {
      $modalContent.style.marginTop = '-60px';
    }
  }, 5000);

  function fixOfferModal() {
    offerEditApp.on_after_save = function() {
      offerEditApp.stop_spinner();
      callWebViewOnMessage({ command: 'back' });
    };

    Layout.OfferEditForm.prototype.childEvents = function() {
      setTimeout(fix, 300);
    };

    function fix() {
      const $header = document.getElementById('offer-dialog-header-region');
      if ($header) {
        ['.back', 'h2'].forEach(function(selector) {
          var $el = $header.querySelector(selector);
          if (!$el) {
            alert($el);
            return;
          }

          $el.style.display = 'none';
        });
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});