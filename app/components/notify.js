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
  TextInput
} from 'react-native';

var Firebase = require('firebase');

var ref = new Firebase("https://learnet.firebaseio.com/");

class Notify extends Component {
  constructor (props) {
      super(props);
      this.state = {
        username: "",
        notes: []
      }
    }

    componentDidMount() {
      var _this = this;
      AsyncStorage.getItem("username").then(function(username){
        _this.setState({username: username})
      }).then(function(){
        ref.child('users/' + _this.state.username+'/notifys').on('value', function(snapshot){
          var arr = [snapshot.val()];
          console.log(snapshot.val());
          _this.setState({notes:arr});
        })
      }
    );
    }

    startChat() {
      var id = Date.now();
      ref.child('chats/'+id).set({teacher : this.state.notes[0].split(" ")[0], student: this.state.username, text:"" })
      ref.child('users/' + this.state.username + '/chats/' + id).set("");
      ref.child('users/' + this.state.notes[0].split(" ")[0] + '/chats/' + id).set("");
      this.props.navigator.push({
        id: 'Chat',
        name: 'Chat'
      });
    }

    render() {
      var _this = this;
        var notes = this.state.notes.map(function(item, key) {
          return(<TouchableHighlight onPress={e => _this.startChat()}>
              <Text>{item}</Text>
          </TouchableHighlight>)
        })

        return(
          <View>
          {notes}
          </View>)
    }
}

export default Notify;
