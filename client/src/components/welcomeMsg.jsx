import React from "react"
//Greetings message display. User in home, login, and register pages.
function Greeting (params) {
    return<div>
        <div>
        <div className="jumbotron jumbotron-fluid">
            <div className="container">
                <h1 className="display-4">AAWAD Blog</h1>
                <p className="lead">Welcome, please {params.actionRequired} below and share your wonderful thoughts and ideas.</p>
            </div>
        </div>
        </div>
    </div>
}

export default Greeting;