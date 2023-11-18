class SignupForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      password1: '',
      name: '',
      phone: '',
      userType: '',
      volunteer: '',
      messages: {
        username: '',
        password: '',
        password1: '',
        name: '',
        phone: '',
        userType: '',
        volunteer: '',
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

  handlePhoneInputChange(event) {
    event.preventDefault();
    const target = event.target;
    let newValue = target.value.replace(/\D/g, '');

    // Change value if string incremented or decremented
    newValue = (target.value.length > target.defaultValue.length ?
      newValue.substring(0, 11) : newValue.substring(0, newValue.length-1));

    this.setState({
      [target.name]: newValue
    });
  }

  handleUserTypeInputChange(event) {
    this.setState({
      userType: event.target.value
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
    } else if (this.state.username.indexOf(' ') > -1) {
      messages.username = 'Usuário não deve conter espaços';
      valid = false;
    }

    // Validate password
    if (this.state.password.length < 6 || this.state.password.length > 40) {
      messages.password = 'Senha deve ter de 6 a 40 dígitos';
      valid = false;
    } else if (this.state.password.indexOf(' ') > -1) {
      messages.password = 'Senha não deve conter espaços';
      valid = false;
    }
    if (this.state.password != this.state.password1) {
      messages.password1 = 'Confirmação de senha não confere';
      valid = false;
    }

    // Validate name
    if (this.state.name.trim().length == 0) {
      messages.name = 'Nome deve ser preenchido';
      valid = false;
    }

    // Validate phone
    if (this.state.phone.length < 10 || this.state.phone.length > 11) {
      messages.phone = 'Telefone deve ter de 10 a 11 dígitos';
      valid = false;
    }

    if (!['USER_INE', 'USER_RELATED_INE'].includes(this.state.userType)) {
      messages.userType = 'Vínculo inválido';
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
      responseMessage: ''
    })

    // Remove control attributes from state to make signup request
    const {password1, messages, responseMessage, ...signupRequest} = this.state;

    // Make signup request
    axios.post(baseUrl + '/auth/signup', signupRequest)
    .then(response => {
      // Make login request
      axios.post(baseUrl + '/auth/login', this.state)
      .then(response => {
        // handle success
        setUser(response.data);
        window.location.href = '/';
      })
      .catch(error => {
        // handle error
        this.setState({
          responseMessage: error.response.data.message
        })

      });
    })
    .catch(error => {
      // handle error
      this.setState({
        responseMessage: error.response.data.message
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
    const volunteerField = this.state.userType === "USER_RELATED_INE" ? (
      <div className="form-floating mb-3">
        <input type="text" className="form-control" name="volunteer" value={this.state.volunteer} 
          placeholder="" onChange={(e) => this.handleInputChange(e)}/>
        <label>Voluntário</label>
        <div className="alert alert-warning" style={{maxWidth:"250px"}} role="alert">
          Caso não seja do DF, garanta que você consegue entregar o presente ao voluntário de alguma forma
        </div> 
        <p className="ms-1 text-start text-danger">{this.state.messages.volunteer}</p>
      </div>
    ) : (null);
    return ( 
      <form method="post" className="needs-validation mb-3" onSubmit={(e) => this.handleSubmit(e)}>
        <h1 className="h3 mb-3 fw-normal">Novo cadastro</h1>
    
        <p className="ms-1 text-start text-danger">{this.state.responseMessage}</p>
        <div className="form-floating mb-3">
          <input type="text" className="form-control" name="name" value={this.state.name} 
            placeholder="" onChange={(e) => this.handleInputChange(e)}/>
          <label>Nome completo</label>
          <p className="ms-1 text-start text-danger">{this.state.messages.name}</p>
        </div>
        <div className="form-floating mb-3">
          <input type="text" className="form-control" name="phone" value={this.formatPhone()} 
            placeholder="" onChange={(e) => this.handlePhoneInputChange(e)}/>
          <label>Telefone</label>
          <p className="ms-1 text-start text-danger">{this.state.messages.phone}</p>
        </div>
        <div className="form-floating mb-3 text-start">
          <legend class="col-form-label">Vínculo</legend>
          <div className="form-check">
            <input className="form-check-input" type="radio" name="userType" id="userTypeRadio1"
              value="USER_INE" checked={this.state.userType === "USER_INE"} onChange={(e) => this.handleUserTypeInputChange(e)} />
            <label className="form-check-label" htmlFor="userTypeRadio1">
              Voluntário InE
            </label>
          </div>
          {/* <div className="form-check mt-2">
            <input className="form-check-input" type="radio" name="userType" id="userTypeRadio2"
              value="USER_ASSOCIATION" checked={this.state.userType === "USER_ASSOCIATION"} onChange={(e) => this.handleUserTypeInputChange(e)} />
            <label className="form-check-label"htmlFor="userTypeRadio2">
              Associado
            </label>
          </div> */}
          <div className="form-check mt-2">
            <input className="form-check-input" type="radio" name="userType" id="userTypeRadio2"
              value="USER_RELATED_INE" checked={this.state.userType === "USER_RELATED_INE"} onChange={(e) => this.handleUserTypeInputChange(e)} />
            <label className="form-check-label"htmlFor="userTypeRadio2">
              Conheço um Voluntário InE
            </label>
          </div>
          <p className="ms-1 text-start text-danger">{this.state.messages.userType}</p>
        </div>
        {volunteerField}
        <div className="form-floating mb-3">
          <input type="text" className="form-control" name="username" value={this.state.username} 
            placeholder="" onChange={(e) => this.handleInputChange(e)}/>
          <label>Usuário</label>
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
          <label>Confirmação de senha</label>
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