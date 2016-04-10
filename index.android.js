/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */

import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Navigator
} from 'react-native';

import Home from './app/components/home.js';
import Academy from './app/components/academy.js';
import Account from './app/components/Account.js';
import Notify from './app/components/notify.js';
import Chat from './app/components/chatroom.js';
//import Stripe from './app/components/Stripe.js';

class learnet extends Component {
  render() {
    return (
      <Navigator initialRoute={{id: 'Home', name: 'Home'}} renderScene={this.renderScene}
        configureScene={(route) => {
          if (route.sceneConfig) {
            return route.sceneConfig;
          }
          return Navigator.SceneConfigs.FloatFromRight;
        }}
        />
    );
  }

  renderScene (route, navigator){
    switch (route.id) {
      case 'Home':
        return (<Home navigator={navigator} />);
      case 'Academy':
        return (<Academy navigator={navigator}/>);
      case 'Account':
        return (<Account navigator={navigator}/>);
      case 'Notify':
        return (<Notify navigator={navigator}/>);
      case 'Chat':
        return (<Chat navigator={navigator}/>);
    }
  }
}

const styles = StyleSheet.create({

});

AppRegistry.registerComponent('learnet', () => learnet);
