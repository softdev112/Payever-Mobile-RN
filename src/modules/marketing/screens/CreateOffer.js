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

  renderWrongProfile() {
    return (
      <View style={styles.container}>
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Create New Offer" />
        </NavBar>
        <ErrorBox message="Choose another profile for offer creating" />
      </View>
    );
  }

  render() {
    const profile = this.props.profiles.currentProfile;
    const { communication, conversationId } = this.props;

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
        <NavBar popup>
          <NavBar.Back />
          <NavBar.Title title="Create New Offer" />
        </NavBar>
        <WebView
          injectJs={js}
          showLoader
          showNavBar="never"
          source={{ uri }}
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

  fixOfferModal();
  fixItemsModal();
  offerEditApp.show_new(recipients);

  function fixOfferModal() {
    offerEditApp.on_after_save = function() {
      callWebViewOnMessage({ command: 'back' });
    };

    Layout.OfferEditForm.prototype.childEvents = function() {
      setTimeout(fix, 300);
    };

    function fix() {
      var $header = document.getElementById('offer-dialog-header-region');
      ['.back', 'h2'].forEach(function(selector) {
        var el = $header.querySelector(selector);
        if (!el) return;
        el.style.display = 'none';
      });

      const $sendBtn = document.getElementById('offer-send-step');
      if ($sendBtn) {
        $sendBtn.innerHTML = $sendBtn.innerHTML.replace('span', 'div');
      }

      callWebViewOnMessage({ command: 'hide-loader' });
    }
  }

  function fixItemsModal() {
    Layout.OfferAddItemForm.prototype.childEvents = function() {
      setTimeout(fix, 300);
    };

    function fix() {
      const $selectBtn = document.getElementById('offer-select-items');
      if ($selectBtn) {
        $selectBtn.innerHTML = $selectBtn.innerHTML.replace('span', 'div');
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});