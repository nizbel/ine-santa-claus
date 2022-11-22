class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: ''
    };
  }

  handleInputChange(event) {
    event.preventDefault();
    const target = event.target;
    this.setState({
      [target.name]: target.value,
    });
  }
  
  handleSubmit(event) {
    event.preventDefault();

    // Make login request
    axios.post('http://localhost:8080/auth/login', this.state)
    .then(response => {
      // handle success
      setUser(response.data);
      window.location.href = '/';
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
  }

  render() {
    return ( 
      <form method="post" onSubmit={(e) => this.handleSubmit(e)}>
        <h1 className="h3 mb-3 fw-normal">Realizar login</h1>
    
        <div className="form-floating">
          <input type="text" className="form-control" name="username" value={this.state.username} 
            placeholder="" onChange={(e) => this.handleInputChange(e)}/>
          <label htmlFor="floatingInput">Usuário</label>
        </div>
        <div className="form-floating mb-3">
          <input type="password" className="form-control" name="password" value={this.state.password} 
            placeholder="" onChange={(e) => this.handleInputChange(e)}/>
          <label htmlFor="floatingPassword">Senha</label>
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