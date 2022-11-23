class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      messages: {
        username: '',
        password: ''
      },
      responseMessage: ''
    };
  }

  handleInputChange(event) {
    event.preventDefault();
    const target = event.target;
    this.setState({
      [target.name]: target.value,
    });
  }
  
  validateForm() {
    console.log("validatin");
    let valid = true;

    const messages = {
      username: '',
      password: ''
    };

    if (this.state.username.length < 3 || this.state.username.length > 20) {
      messages.username = 'Usuário deve ter de 3 a 20 dígitos';
      valid = false;
    } else if (this.state.username.indexOf(' ') > -1) {
      messages.username = 'Usuário não deve conter espaços';
      valid = false;
    }

    if (this.state.password.length < 6 || this.state.password.length > 40) {
      messages.password = 'Senha deve ter de 6 a 40 dígitos';
      valid = false;
    } else if (this.state.password.indexOf(' ') > -1) {
      messages.password = 'Senha não deve conter espaços';
      valid = false;
    }

    this.setState({
      messages: messages
    });
    return valid;
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const {messages, responseMessage, ...loginRequest} = this.state;

    // Make login request
    axios.post(baseUrl + '/auth/login', loginRequest)
    .then(response => {
      // handle success
      setUser(response.data);
      window.location.href = '/';
    })
    .catch(error => {
      // handle error
      this.setState({
        responseMessage: 'Usuário ou senha não conferem'
      })
    });
  }

  render() {
    return ( 
      <form method="post" onSubmit={(e) => this.handleSubmit(e)}>
        <h1 className="h3 mb-3 fw-normal">Realizar login</h1>
    
        <p className="ms-1 text-start text-danger">{this.state.responseMessage}</p>
        <div className="form-floating">
          <input type="text" className="form-control" name="username" value={this.state.username} 
            placeholder="" onChange={(e) => this.handleInputChange(e)}/>
          <label>Usuário</label>
          <p className="ms-1 text-start text-danger">{this.state.messages.username}</p>
        </div>
        <div className="form-floating mb-3">
          <input type="password" className="form-control" name="password" value={this.state.password} 
            placeholder="" onChange={(e) => this.handleInputChange(e)}/>
          <label>Senha</label>
          <p className="ms-1 text-start text-danger">{this.state.messages.password}</p>
        </div>
        
        <button className="w-100 btn btn-lg btn-primary" type="submit">Entrar</button>
      </form>
    );
  }
}
  
// functions
function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}


const root = ReactDOM.createRoot(document.getElementById("form"));
root.render(<LoginForm />);