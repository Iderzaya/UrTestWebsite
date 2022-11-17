

import React from 'react'
import Header from './components/Header/header.js'
import Wallet from './components/Wallet/Wallet'

import { Main, MainBody } from './Main.styles.js' 
import './assets/css/app.css'

function App(){ 
        return(
         
            <MainBody>
                <Header/> 
                <Main>
                    <Wallet/>
                </Main>
            </MainBody>
        )
}

// function App(){ 
//   return(
   
//       <div>hello</div>
//   )
// }

export default App
