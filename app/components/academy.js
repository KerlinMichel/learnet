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
  ScrollView
} from 'react-native';

var Firebase = require('firebase');

var ref = new Firebase("https://learnet.firebaseio.com/");

class Academy extends Component {
  constructor (props) {
      super(props);
      this.state = {
        username: "",
        password: "",
        students: [],
        isLoading: false
      };
    }

  componentDidMount() {
    var _this = this;
    ref.child('users').on('value', function(snapshot){
        _this.setState({isLoading: false});
        var a = snapshot.val();
        var arr = [];
        for(var i in snapshot.val()){
          arr.push(snapshot.val()[i]);
        }
        console.log(arr);
        _this.setState({students: arr});
        //console.log(_this.state.students);
    });

  }

  goToAcc(){
    this.props.navigator.push({
      id: 'Account',
      name: 'Account'
    });
  }

  sendNotify(recieve) {
    console.log(recieve);
    ref.child('users/' + recieve + '/notifys').set(this.state.username + 'Sent you a notification');
  }
//var name = this.state.students[s].name;
  render() {
  var students = [];
  for(var i in this.state.students) {
    var t;
    var s;
    var name = this.state.students[i]['name'];
    if(this.state.students[i].isTeacher){
      t = <TouchableHighlight onPress={this.sendNotify(this.state.students[i]['name'])}>
          <Image style={styles.icon} source={require('./../../assets/teacher.png')} ></Image>
      </TouchableHighlight>
    }
    if(this.state.students[i].isStudent){
      console.log(i + this.state.students[i].isStudent);
      s = <TouchableHighlight onPress={this.sendNotify(this.state.students[i]['name'])}>
          <Image style={styles.icon} source={require('./../../assets/student.png')} ></Image>
      </TouchableHighlight>
    }
    students.push(<View style={styles.row}>
          <Text>{this.state.students[i]['name']}</Text>
          {t}
          {s}
          </View>
        );
    s = <View></View>
    t = <View></View>
  }
    if(this.state.isLoading) {
      return(<View><Text>Loading...</Text></View>)
    }
    return(
      <View style={styles.container}>
      <ScrollView
                   scrollEnabled={true}>
         {students}
       </ScrollView>

       <View style={styles.footer}>
       <TouchableHighlight style={styles.footerBtns} onPress={e => {this.goToAcc(e)}}>
              <Text>Notifications</Text>
          </TouchableHighlight>
       <TouchableHighlight style={styles.footerBtns} onPress={e => {this.goToAcc(e)}}>
              <Text>Students</Text>
          </TouchableHighlight>
       <TouchableHighlight style={styles.footerBtns} onPress={e => {this.goToAcc(e)}}>
             <Text>Teachers</Text>
         </TouchableHighlight>
       <TouchableHighlight style={styles.footerBtns} onPress={e => {this.goToAcc(e)}}>
            <Text>Account settings</Text>
        </TouchableHighlight>
       </View>
       </View>
      )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 488,
    flexDirection: 'column'
  },
  footer:{
    flex: 6,
    height: 50,
    flexDirection: 'row'
  },

  icon:{
    width: 50,
    height: 50
  },

  footerBtns:{
    flex:1
  },

  row:{
    flex: 1,
    borderWidth: 1,
    borderColor: '#DDD',
    flexDirection: 'row'
  },
});

export default Academy;
