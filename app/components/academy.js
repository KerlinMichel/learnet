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
        isLoading: true
      };
    }

  componentDidMount() {
    var _this = this;
    ref.child('users').on('value', function(snapshot){
        snapshot.forEach(function(childSnapshot){
          _this.setState({isLoading: false});
          //_this.state.students.push(childSnapshot.val());
          //console.log(_this.state.students);
          //console.log(typeof _this.state.students);
          //console.log(typeof _this.state.students == '[object Array]');
          //console.log(childSnapshot.val());
        })
        _this.setState({students: snapshot.val()});
        console.log(snapshot.val());
    });

  }

  goToAcc(){
    this.props.navigator.push({
      id: 'Account',
      name: 'Account'
    });
  }

  render() {
    //console.log(this.getStudents());
    /*var students = this.state.students.map( (student, key) => {
        return(
          <View key={key}><Text>Academy{this.state.students}</Text>
          </View>
        );
      });*/
  var students = [];
  for(var s in this.state.students) {
    var t;
    if(this.state.students[s].isTeacher){
      t = <Image source={require('./../../assets/teacher.png')></Image>
    }
        students.push(<TouchableHighlight> style={styles.row}>
          <View><Text>{this.state.students[s].name}</Text>

          </View>
          </TouchableHighlight>
        );
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
