// Chat Component
const chatComponent = {
    template: ` <div class="chat-box">
                   <p v-for="data in content">
                       <img v-bind:src=data.user.imageSrc class="circle" width="30px">
                       <span><strong>{{data.user.name}}</strong> <small>{{data.date}}</small><span>
                       <br />
                       {{data.message}}
                   </p>
               </div>`,
    props: ['content']
}

// Users Component
const usersComponent = {
    template: ` <div class="user-list">
                   <h6>Active Users ({{users.length}})</h6>
                   <ul v-for="user in users">
                       <li>
                            <img v-bind:src=user.imageSrc class="circle" width="30px">
                            <span>{{user.name}}</span>
                       </li>
                       <hr>
                   </ul>
               </div>`,
    props: ['users']
}

// Welcome Component
const welcomeComponent = {
    template: ` <div v-if="user.isLoggedIn" class="welcome-user" style="background-color:#6a5acd;">
                  <h4>Welcome</h4>
                  <img v-bind:src=user.imageSrc class="circle" width="70px"><br/>
                  <h5>{{user.name}}</h5>
                  
                </div>`,
    props: ['user']
}

// Welcome Component

const socket = io()
const app = new Vue({
    el: '#chat-app',
    data: {
        loggedIn: false,
        userName: '',
        user: {},
        users: [],
        message: '',
        messages: [],
        errorMessage: ''
    },
    methods: {
        joinUser: function () {
            if (!this.userName)
                return

                console.log(app.users)

            socket.emit('join-user', this.userName)
        },
        sendMessage: function () {
            if (!this.message)
                return

            socket.emit('send-message', { message: this.message, user: this.user })
        }
    },
    components: {
        'users-component': usersComponent,
        'chat-component': chatComponent,
        'welcome-component': welcomeComponent
    }
})


// Client Side Socket Event
socket.on('refresh-messages', messages => {
    app.messages = messages
})
socket.on('refresh-users', users => {
    app.users = users
})

socket.on('successful-join', user => {
    // the successful-join event is emitted on all connections (open browser windows)
    // so we need to ensure the loggedIn is set to true and user is set for matching user only
    if (user.name === app.userName) {
        app.user = user
        app.user.isLoggedIn = true
        app.loggedIn = true
    }

    app.users.push(user)
})

socket.on('failed-join', user => {

  if (user.name === app.userName) {
      app.user = user
      app.loggedIn = false
      app.errorMessage = "*Sorry user already Exists with name "+app.userName;
  }

})

socket.on('successful-message', content => {
    // clear the message after success send
    app.message = ''
    app.messages.push(content)
})
