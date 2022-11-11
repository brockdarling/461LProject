import React, { useRef } from 'react'


export default function UserInfo() {

  const loginUsername =  useRef()
  const loginPassword = useRef()
  
  function handleSignIn(e){
    const user = loginUsername.current.value
    console.log(user)
    const password = loginPassword.current.value
    console.log(password)
  }

  function handleCreateAccount(e){
    
  }

  return (
    <>
      <div>
          UserName
      </div>
      <div>
        <input ref = {loginUsername} type="text" />
      </div>
      <div>
        Password
      </div>
      <div>
        <input ref = {loginPassword} type = "text" />
      </div>
      <div>
        <button onClick = {handleSignIn}>Sign In</button>
      </div>
      <div>
        <button onClick = {handleCreateAccount}>Create Account</button>
      </div>
    </>
  )
}
