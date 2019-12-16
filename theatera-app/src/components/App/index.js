import React, { useState } from 'react';

import { Route, withRouter, Redirect } from 'react-router-dom'
import Login from '../Login'
import Register from '../Register'
import Header from '../Header'
import Footer from '../Footer'
import Posts from '../Posts'
import AccountDetail from '../Account-Detail'
import PostDetail from '../Post-detail'
import Connections from '../Connections'
import PersonalInfo from '../Personal-Info'
import UserPosts from '../UserPosts'
import NewPost from '../New-Post'
import Chats from '../Chats'
import Chat from '../Chat'
import News from '../News'
import Search from '../Search-Result'
import FriendConnections from '../Friend-connections'

import Context from '../CreateContext'

import './index.sass'

export default withRouter(function () {

  const [render, setRender] = useState(true)
  const { token } = sessionStorage
  const [postId, setPostId] = useState()
  

  

  return <>
  <Context.Provider value={{render, setRender}}>
    <Route exact path='/info/:userId' render={({ match: { params: { userId } } }) =>  token && userId  ? <> <Header/>   <PersonalInfo userId={userId}  />  <Footer />  </> :<Login/>} />  
  </Context.Provider>
    <Route exact path='/' render={() => token ? <Redirect to="/home" /> : <Login />} />
    <Route path='/login' render={() => <Login/>} />
    <Route path='/register' render={() => <Register/>} />
    <Route path='/home' render={() => token ? <> <Header/>   <Posts />    <Footer />  </> : <Login  />} />
    <Route path='/users/:userId' render={({ match: { params: { userId } } }) =>  token && userId ? <> <Header/>   <AccountDetail userId={userId} />  <Footer />  </> :<Redirect to="/home" />} />    
    <Route path='/posts/:postId' render={({ match: { params: { postId } } }) =>  token && postId  ? <> <Header/>   <PostDetail postId={postId}  />  <Footer />  </> :<Login/>} />  
    <Route path='/connections' render={() => token ? <> <Header/>   <Connections />    <Footer />  </> : <Login  />} />
    <Route path='/usersPosts/:userId' render={({ match: { params: { userId } } }) =>  token && userId  ? <> <Header/>   <UserPosts userId={userId}  />  <Footer />  </> :<Login/>} />  
    <Route path='/newPost' render={() =>  token ? <> <Header/>   <NewPost/>  <Footer />  </> :<Login/>} />  
    <Route path='/chats' render={() =>  token ? <> <Header/>   <Chats/>  <Footer />  </> :<Login/>} />  
    <Route path='/chat/:chatId' render={({ match: { params: { chatId } } }) =>  token ? <> <Header/>   <Chat chatId={chatId}/>  <Footer />  </> :<Login/>} />  
    <Route path='/search/:query' render={({ match: { params: { query } } }) =>  token ? <> <Header/>   <Search query={query}/>  <Footer />  </> :<Login/>} />  
    <Route path='/friend-connections/:userId' render={({ match: { params: { userId } } }) =>  token ? <> <Header/>   <FriendConnections userId={userId}/>  <Footer />  </> :<Login/>} />  
    <Route path='/news' render={() =>  token ? <> <Header/>   <News/>  <Footer />  </> :<Login/>} />  


    </>


})

