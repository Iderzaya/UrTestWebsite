import styled from "styled-components"

export const Main = styled.div`
    display : block;
    justify-content : start;
    padding: 0 0 0 10vw;

     @media(max-width : 700px){
        flex-direction   : column;
        align-content : center;
        align-items : center;
    }
`

export const MainBody = styled.div`
    background-color : #F8F9FF;
    height : 100vh;

`