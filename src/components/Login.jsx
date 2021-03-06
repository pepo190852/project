import React from 'react'
// import './node_modules/bulma/css/bulma.css'
import firebase from '../firebase/firebase'
import Navbar from './Navbar'
import MessageList from './MessageList'
import Contact from './Contact'


class Login extends React.Component{
    constructor(props){
        super(props)

        this.state ={
            email: '',
            password: '',
            messages: '',
            messages: [],
            currentUser: null,
            image: '',
            comment: 'ผัดกระเพรา '
        }
        this.logout = this.logout.bind(this)
    }

    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.setState({
                    currentUser: user
                })
                firebase.firestore().collection('users')
                .doc(user.email)
                .collection('messages')
                .onSnapshot(item =>{
                    this.setState({
                        messages: item
                    })
                })
                firebase.storage().ref('40510726_1885325624882038_6625989121489764352_n.jpg')
                .getDownloadURL().then(response => this.setState({image: response}))
            }
        })
    }

    post = e => {
        firebase.firestore()
        .collection('users')
        .doc(this.state.currentUser.email)
        .collection('messages')
        .add({
            text: "ผัดกระเพรา จำนวน " + this.state.comment + " จาน รวมราคา = " + (this.state.comment)*40 + "บาท",
            timestamp: new Date()
        })

    }

    delete = e => {
        firebase.firestore()
        .collection('users')
        .doc(this.state.currentUser.email)
        .collection('messages')
        .doc(e.target.value)
        .delete()
    }

    onChange = e => {
        const { name,value} = e.target
        this.setState({
            [name]: value
        })
    }

    onSubmit = e => {
        e.preventDefault()
        const { email,password } = this.state
        firebase.auth()
           .signInWithEmailAndPassword(email, password)
           .then(response => {
               this.setState({
                   currentUser: response.user
               })
           })
           .catch(error => {
               this.setState({
                   message: error.message
               })
           })


    }

    logout(){
        firebase.auth().signOut().then(response => {
            this.setState({
                currentUser: null
            })
        })
    }

    render(){
        const { message, currentUser } = this.state
        if (currentUser){
            return(
                <div>
                    <Navbar logout={this.logout} username={currentUser.email}></Navbar>
                    <MessageList
                       image={this.state.image}
                       messages={this.state.messages}
                       onChange={this.onChange}
                       post={this.post}
                       delete={this.delete} />
                </div>
            )
        }
        return(
            <section className="section container">
               <div className="columns is-centered">
                   <div className="column is-half">
                       <form onSubmit={this.onSubmit}> 
                           <div className="field">
                               <label className="label">Email</label>
                               <div className="control">
                                   <input className="input" type="email" name="email" onChange={this.onChange} />
                               </div>
                           </div>
                           <div className="field">
                               <label className="label">
                                   password
                               </label>
                               <div className="control">
                                   <input className="input" type="password" name="password" onChange={this.onChange} />
                               </div>
                           </div>
                                {message ? <p className="help is-danger">{message}</p> : null}
                           <div className="field is-grouped">
                               <div className="control">
                                   <button className="button is-link">Login</button>
                               </div>
                           </div>
                           <Contact/>
                       </form>
                   </div>
               </div>
           </section>

        )
    }
}

export default Login