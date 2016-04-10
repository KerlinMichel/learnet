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
        AsyncStorage.getItem("username").then(function(username){
          _this.setState({username: username})
        })
    });

  }

  goToAcc(){
    this.props.navigator.push({
      id: 'Account',
      name: 'Account'
    });
  }

  gotoChat(){
    this.props.navigator.push({
      id: 'Chat',
      name: 'Chat'
    });
  }

  sendNotify(recieve) {
    console.log('reciever:'+recieve);
    console.log(this.state.username );
    ref.child('users/' + recieve + '/notifys').set(this.state.username + ' Sent you a notification');
  }
  render() {
  var _this = this;
  var students = this.state.students.map(function(item, key){
    var t;
    var s;
    var des;
    var skills;
    if(item.desired){
       des = <Text style={{color: 'white', alignSelf:'center', width: 60}}>{item.desired}</Text>
    }
    if(item.skills) {
      skills = <Text style={{color: 'white', alignSelf:'center', width: 60}}>{item.skills}</Text>
    }
    if(item.isTeacher){
      t = <View><TouchableHighlight onPress={e => _this.sendNotify(item.name)}>
          <Image style={styles.icon} source={require('./../../assets/teacher.png')} ></Image>
      </TouchableHighlight>
          </View>
    }
    if(item.isStudent){
      s = <View><TouchableHighlight onPress={e => _this.sendNotify(item.name)}>
          <Image style={styles.icon} source={require('./../../assets/student.png')} ></Image>
      </TouchableHighlight>
          </View>
    }
    return(<View style={styles.row} key={key}>
          <Text style={{color: 'white', alignSelf:'center', width: 60}}>{item.name}</Text>
          {t}
          {skills}
          {s}
          {des}
          </View>
    )
  })
    if(this.state.isLoading) {
      return(<View><Text>Loading...</Text></View>)
    }
    return(
      <View style={styles.container}>
      <ScrollView style={styles.scrollV}
                   scrollEnabled={true}>
         {students}
       </ScrollView>

       <View style={styles.footer}>
       <TouchableHighlight style={styles.footerBtns} onPress={e => {this.gotoToNotes(e)}}>
              <Text>Notifications</Text>
          </TouchableHighlight>
       <TouchableHighlight style={styles.footerBtns} onPress={e => {this.gotoChat(e)}}>
              <Text>Students</Text>
          </TouchableHighlight>
       <TouchableHighlight style={styles.footerBtns} onPress={e => {this.gotoChat(e)}}>
             <Text>Teachers</Text>
         </TouchableHighlight>
       <TouchableHighlight style={styles.footerBtns} onPress={e => {this.goToAcc(e)}}>
            <Text>Account settings</Text>
        </TouchableHighlight>
       </View>
       </View>
      )
  }

  gotoToNotes(row) {
    this.props.navigator.push({
      id: 'Notify',
      name: 'Notify'
    });
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 488,
    flexDirection: 'column'
  },
  footer:{
    //flex: 2,
    height: 50,
    flexDirection: 'row'
  },

  icon:{
    width: 50,
    height: 50
  },

  footerBtns:{
    flex:1,
    height: 50,
    backgroundColor: '#84b9f3',
    margin: 1
  },

  row:{
    flex: 1,
    borderWidth: 1,
    borderColor: '#84b9f3',
    flexDirection: 'row'
  },

  scrollV: {
    backgroundColor: '#1f1f42',
    flex :6
  }
});

export default Academy;
