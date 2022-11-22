class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      password1: '',
      name: '',
      phone: '',
      messages: {
        username: '',
        password: '',
        password1: '',
        name: '',
        phone: '',
      },
      requestMessage: ''
    };
  }

  handleInputChange(event) {
    event.preventDefault();
    const target = event.target;
    this.setState({
      [target.name]: target.value,
    });
  }

  handlePhoneInputChange(event) {
    event.preventDefault();
    const target = event.target;
    this.setState({
      [target.name]: target.value.replace(/\D/g, '').substring(0, 11),
    });
  }
  
  validateForm() {
    let valid = true;

    const messages= {
      username: '',
      password: '',
      password1: '',
      name: '',
      phone: '',
    };

    // Validate username
    if (this.state.username.length < 3 || this.state.username.length > 20) {
      messages.username = 'Usuário deve ter de 3 a 20 dígitos';
      valid = false;
    }

    // Validate password
    if (this.state.password.length < 6 || this.state.password.length > 40) {
      messages.password = 'Senha deve ter de 6 a 40 dígitos';
      valid = false;
    }
    if (this.state.password != this.state.password1) {
      messages.password1 = 'Confirmação de senha não confere';
      valid = false;
    }

    // Validate name
    if (this.state.name.length == 0) {
      messages.name = 'Nome deve ser preenchido';
      valid = false;
    }

    // Validate phone
    if (this.state.phone.length < 10 || this.state.phone.length > 11) {
      messages.phone = 'Telefone deve ter de 10 a 11 dígitos';
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

    this.setState({
      requestMessage: ''
    })

    // Remove control attributes from state to make signup request
    const {password1, messages, ...signupRequest} = this.state;

    // Make signup request
    axios.post('http://localhost:8080/auth/signup', signupRequest)
    .then(response => {

      // Make login request
      axios.post('http://localhost:8080/auth/login', this.state)
      .then(response => {
        // handle success
        setUser(response.data);
        window.location.href = '/';
      })
      .catch(error => {
        // handle error
        this.setState({
          requestMessage: error.response.data.message
        })

      });
    })
    .catch(error => {
      // handle error
      this.setState({
        requestMessage: error.response.data.message
      })
    });
  }

  formatPhone() {
    const phone = this.state.phone + "_".repeat(Math.max(0, 10-this.state.phone.length));
    if (phone.length == 11) {
      return '(' + phone.substring(0, 2) + ') ' + phone.substring(2, 7) + '-' + phone.substring(7);
    } else {
      return '(' + phone.substring(0, 2) + ') ' + phone.substring(2, 6) + '-' + phone.substring(6);
    } 
  }

  render() {
    return ( 
      <form method="post" className="needs-validation" onSubmit={(e) => this.handleSubmit(e)}>
        <h1 className="h3 mb-3 fw-normal">Cadastrar</h1>
    
        <p className="ms-1 text-start text-danger">{this.state.requestMessage}</p>
        <div className="form-floating mb-3">
          <input type="text" className="form-control" name="name" value={this.state.name} 
            placeholder="" onChange={(e) => this.handleInputChange(e)}/>
          <label htmlFor="floatingInput">Nome completo</label>
          <p className="ms-1 text-start text-danger">{this.state.messages.name}</p>
        </div>
        <div className="form-floating mb-3">
          <input type="text" className="form-control" name="phone" value={this.formatPhone()} 
            placeholder="" onChange={(e) => this.handlePhoneInputChange(e)}/>
          <label htmlFor="floatingInput">Telefone</label>
          <p className="ms-1 text-start text-danger">{this.state.messages.phone}</p>
        </div>
        <div className="form-floating mb-3">
          <input type="text" className="form-control" name="username" value={this.state.username} 
            placeholder="" onChange={(e) => this.handleInputChange(e)}/>
          <label htmlFor="floatingInput">Usuário</label>
          <p className="ms-1 text-start text-danger">{this.state.messages.username}</p>
        </div>
        <div className="form-floating">
          <input type="password" className="form-control" name="password" value={this.state.password} 
            placeholder="" onChange={(e) => this.handleInputChange(e)}/>
          <label htmlFor="floatingPassword">Senha</label>
          <p className="ms-1 text-start text-danger">{this.state.messages.password}</p>
        </div>
        <div className="form-floating mb-3">
          <input type="password" className="form-control" name="password1" value={this.state.password1} 
            placeholder="" onChange={(e) => this.handleInputChange(e)}/>
          <label htmlFor="floatingInput">Confirmação de senha</label>
          <p className="ms-1 text-start text-danger">{this.state.messages.password1}</p>
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
root.render(<SignupForm />);