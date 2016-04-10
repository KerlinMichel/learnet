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

var stripe_url = 'https://api.stripe.com/v1/'
var secret_key = 'sk_test_7OwR2IfSJ3yMbJJKM1XI9p4j '

var Firebase = require('firebase');
var ref = new Firebase("https://learnet.firebaseio.com/");

class Account extends Component {

  constructor (props) {
      super(props);
      this.state = {
        username: "",
        isStudent: false,
        isTeacher: false,
        desired : '',
        skills: '',
        charges: [],
        students: []
      };
  }

  becomeStudent(row) {
    var _this = this;
    var usr =_this.state.username;
    ref.child('users/'+_this.state.username).once('value', function(snapshot){
      ref.child('users/'+_this.state.username+'/isStudent').set(!snapshot.val().isStudent)
    })
  }

  becomeTeacher(row) {
    var _this = this;
    var usr =_this.state.username;
    ref.child('users/'+_this.state.username).once('value', function(snapshot){
      ref.child('users/'+_this.state.username+'/isTeacher').set(!snapshot.val().isTeacher)
    })
  }

  submit(row) {

  }

  componentDidMount() {
    var _this = this;
    AsyncStorage.getItem("username").then(function(username){
      _this.setState({username: username})
    }).then(function(){
      ref.child('users/'+_this.state.username).on('value', function(snap) {
        _this.setState({isStudent: snap.val().isStudent})
        _this.setState({isTeacher: snap.val().isTeacher})
        var arr = [];
        for(var i in snap.val().charges) {
          arr.push(snap.val()[i]);
        }

      })
    }).then(function() {
      ref.child('users/'+_this.state.username+"/students").on('value', function(snap) {
        var arr2 = [];
        for(var i in snap.val()) {
          arr2.push(snap.val()[i]);
        }
        console.log(snap.val());
        _this.setState({students: arr2}); })
      })
  }

  submitStudent() {
      ref.child('users/'+this.state.username+'/desired').set(this.state.desired);
  }

  submitTeacher() {
      ref.child('users/'+this.state.username+'/skills').set(this.state.skills);
  }

  render() {
    var isStudent = "rgba(255, 0,0,0.4)";
    var isTeacher = "rgba(255, 0,0,0.4)";
    var studentInfo;
    var teacherInfo;
    if(this.state.isStudent){
      isStudent = "rgba(0, 250,0,0.4)";
      studentInfo = <View><Text style={styles.text}>Input your what you want to learn (seperate multiple entries with commas)</Text>
        <TextInput style={styles.card} placeholderTextColor='white'
          onChangeText={(desired) => this.setState({desired})}
          placeholder='Desired knowledge'
        /><TouchableHighlight style={styles.submit} onPress={e => {this.submitStudent(e)}}>
             <Text style={styles.text}>Submit desired knowledge</Text>
        </TouchableHighlight></View>;
    }
    if(this.state.isTeacher){
      isTeacher = "rgba(0, 250,0,0.4)"
      teacherInfo = <View><Text style={styles.text}>Input your skills (seperate multiple entries with commas)</Text>
        <TextInput style={styles.card} placeholderTextColor='white'
          onChangeText={(skills) => this.setState({skills})}
          placeholder='Skills'
        /><TouchableHighlight style={styles.submit} onPress={e => {this.submitTeacher(e)}}>
             <Text style={styles.text}>Submit skills</Text>
        </TouchableHighlight></View>;
    }

    var _this = this;
      var charges = this.state.charges.map(function(item, key) {
        return(
          <View style={{flex: 1, flexDirection: 'row'}} key={key}>
            <Text style={[styles.text, {flex: 1}]}>Sent {item.amount}</Text>
            <Text style={[styles.text, {flex: 1}]}>{item.sentTo}</Text>
          </View>
        )
      });
      var students = this.state.students.map(function(item, key){
          return(
            <View style={{flex: 1, flexDirection: 'row'}} key={key}>
              <Text style={[styles.text, {flex: 1}]}>{item.name}</Text>
                <TouchableHighlight style={styles.submit} onPress={e => {_this.certify(item.name, 'docker')}}>
                       <Text style={styles.text}>Give {item.name} a certificate</Text>
                  </TouchableHighlight>
            </View>
          )
      });
    return(
      <View style={styles.container}>
        <ScrollView style={styles.scrollV}
                     scrollEnabled={true}>
      <Text style={styles.title}>Account Settings for : {this.state.username}</Text>
      <TouchableHighlight style={{borderWidth: 2, borderColor: isStudent, backgroundColor: '#84b9f3', marginBottom: 10}} onPress={e => {this.becomeStudent(e)}}>
            <Text style={styles.text}>Toggle Student Status</Text>
      </TouchableHighlight>
      <TouchableHighlight style={{borderWidth: 2, borderColor: isTeacher, backgroundColor: '#84b9f3', marginBottom: 10}} onPress={e => {this.becomeTeacher(e)}}>
           <Text style={styles.text}>Toggle Teache Status</Text>
      </TouchableHighlight>
      <Text style={styles.text}>Input you credit card information to recieve and give payment</Text>
      <View style={{flex: 1, flexDirection: 'column'}}>
      <TextInput style={styles.card} placeholderTextColor='white'
        onChangeText={(username) => this.setState({username})}
        placeholder='Credit Card Number'
      />
      <TextInput style={styles.card} placeholderTextColor='white'
        onChangeText={(username) => this.setState({username})}
        placeholder='Expiration month'
      />
      <TextInput style={styles.card} placeholderTextColor='white'
        onChangeText={(username) => this.setState({username})}
        placeholder='Expiration month'
      />
      <TextInput style={styles.card} placeholderTextColor='white'
        onChangeText={(username) => this.setState({username})}
        placeholder='CVC'
      />
    </View>
    <TouchableHighlight style={styles.submit} onPress={e => {this.submit(e)}}>
           <Text style={styles.text}>Click here to submit this credit card to your account</Text>
      </TouchableHighlight>
     {teacherInfo}
     {studentInfo}
     {charges}
     {students}
     <TouchableHighlight style={{backgroundColor: 'white'}} onPress={e => {this.goAcad(e)}}>
          <Text style={{fontSize: 27, color: 'black'}}>Go to academy</Text>
     </TouchableHighlight>
      </ScrollView>
      </View>
    )
  }

  certify(usr, skill) {
    ref.child('users/' + usr + '/certificates/' + skill).set({text: usr +" is certified for " + skill + " by " + this.state.username});
  }

  goAcad() {
    this.props.navigator.push({
      id: 'Academy',
      name: 'Academy'
    });
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1f1f42',
    flex: 1,
    flexDirection: 'column'
  },
  title: {
    fontSize: 25,
    color: 'white'
  },
  text: {
    fontSize: 14,
    color: 'white'
  },
  card: {
    borderWidth: 2,
    borderColor: '#84b9f3'
  },
  submit: {
    flex: 2,
    backgroundColor: '#007bff',
    borderColor: 'gray',
    borderWidth:1,
    margin: 15,
    height: 35
  }
});

export default Account;
