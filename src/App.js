import React, { Component, Fragment } from 'react'
import Navbar from './components/Layout/Navbar'
import Users from './components/users/Users'
import User from './components/users/User'
import Search from './components/users/Search'
import Alert from './components/Layout/Alert'
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom'
import About from './components/pages/About'
import axios from 'axios'
import './App.css'

export default class App extends Component {
  state={
    users:[],
    user:{},
    repos :[],
    loading: false,
    alert: null,
  }


  //search Github Users
  searchUsers= async text =>{
    this.setState({loading: true})

    const res = await axios.get(`https://api.github.com/search/users?q=${text}&client_id=${process.env.REACT_APP_GITHUB_CLIENT_ID}&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`)

    this.setState({
      users: res.data.items,
      loading: false
    })
    
  };
  //Get single Github user
  getUser = async (username) =>{
    this.setState({loading: true})

    const res = await axios.get(
      `https://api.github.com/users/${username}?client_id=${
        process.env.REACT_APP_GITHUB_CLIENT_ID
      }&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );

    this.setState({
      user: res.data,
      loading: false
    })

  };

  getUserRepos = async (username) =>{
    this.setState({loading: true})

    const res = await axios.get(
      `https://api.github.com/users/${username}/repos?per_page=5&sort=created:asc&client_id=${
        process.env.REACT_APP_GITHUB_CLIENT_ID
      }&client_secret=${process.env.REACT_APP_GITHUB_CLIENT_SECRET}`
      );

    this.setState({
      repos: res.data,
      loading: false
    })

  };

  //Clear User From State
  clearUsers=()=>{
    this.setState({users:[], loading: false});
  }

  //set alert
  setAlert=(msg,type)=>{
    this.setState({alert:{msg,type}})

    setTimeout(()=>{
      this.setState({alert:null})
    },5000)
  }


  render() {
    const{loading,users,user,repos,alert}= this.state;

    return (
      <Router>
      <div className="App">
        <Navbar/> 
        <div className="container">
          <Alert alert={alert}/>
          <Switch>
            <Route 
            exact 
            path='/' 
            render={props=>(
              <Fragment>
                <Search 
                  searchUsers={this.searchUsers} 
                  clearUsers={this.clearUsers} 
                  setAlert={this.setAlert}
                  showClear={users.length>0? true: false}/>
                  <Users loading={loading} users={users}/>  
              </Fragment>
            )}/>
            <Route exact path='/about' component={About}/>
            <Route exact path='/user/:login' render={props=>(
              <User 
                  {...props} 
                  getUser={this.getUser} 
                  getUserRepos={this.getUserRepos} 
                  repos={repos}
                  user={user} 
                  loading={loading}/>
            )}/>
          </Switch>  
          
          
        </div>       
      </div>
      </Router>
    )
  }
}

