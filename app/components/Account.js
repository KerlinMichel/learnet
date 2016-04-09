import React, {
  Alert,
  AsyncStorage,
  Component,
  StyleSheet,
  Image,
  Text,
  Navigator,
  TouchableHighlight,
  View,
  TextInput,
} from 'react-native';

var Firebase = require('firebase');

class Account extends Component {

  constructor (props) {
      super(props);
      this.state = {
        username: "",
      };
  }

  becomeStudent(row) {

  }

  becomeTeacher(row) {

  }


  render() {
    return(
      <View><Text>Account Settings</Text></View>
      <TouchableHighlight onPress={e => {this.becomeStudent(e)}}>
            <Text>Become Student</Text>
        </TouchableHighlight>
      <TouchableHighlight onPress={e => {this.becomeTeacher(e)}}>
           <Text>Become Teacher</Text>
      <TextInput
        onChangeText={(username) => this.setState({username})}
        placeholder='username'
      />
    )
  }
}

export default Account;
