class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      validateModal: null,
      users: []
    }
  }

  componentDidMount() {
    if (isAdmin()) {
      // Make request
      axiosInstance().get(baseUrl + '/users/list')
        .then(response => {
          // handle success
          const users = [];
          response.data.forEach(user => {
            users.push({...user, roles: user.roles.map(r => r.name)});
          });

          this.setState({
            users: users,
          });
        })
        .catch(error => {
          // handle error
          console.log(error);
        });

      this.setState({
        validateModal: new bootstrap.Modal(document.getElementById('validateModal'))
      });
    }
  }

  showValidateModal() {
    // Has to be admin
    if (!isAdmin()) {
      return;
    }

    this.state.validateModal.show();
  }

  handleChangeValidated(id) {
    if (isAdmin()) {
      // Make request
      axiosInstance().post(baseUrl + '/users/changeValidated/' + id)
        .then(response => {
          const editedUser = {...response.data, roles: response.data.roles.map(r => r.name)};

          // Update user in users list
          const users = [...this.state.users.map(user => user.id !== editedUser.id ? user : editedUser)];

          this.setState({
            users: users,
          });
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    }
  }

  handleChangeAdmin(id) {
    if (isAdmin()) {
      // Make request
      axiosInstance().post(baseUrl + '/users/changeAdmin/' + id)
        .then(response => {
          const editedUser = {...response.data, roles: response.data.roles.map(r => r.name)};

          // Update user in users list
          const users = [...this.state.users.map(user => user.id !== editedUser.id ? user : editedUser)];

          this.setState({
            users: users,
          });
        })
        .catch(error => {
          // handle error
          console.log(error);
        });
    }
  }

  renderUsers() {
    const users = [];
    this.state.users.forEach(user => {
      let userType;
      switch (user.userType) {
        case 'USER_INE':
          userType ='Voluntário InE';
          break;

        case 'USER_ASSOCIATION':
          user.userType ='Associação';
          break;

        case 'USER_RELATED_INE':
          userType =`Contato de ${user.volunteer}`;
          break;

        default:
          userType ='Outros';
          break;
      }
      users.push(
        <div className="alert alert-info m-2 row" role="alert" key={user.id}>
          <div className="col-12 col-md-3">Nome: <strong>{user.name}</strong></div>
          <div className="col-12 col-md-2">Telefone: <strong>{formatPhone(user.phone)}</strong></div>
          <div className="col-12 col-md-3">Vínculo: <strong>{userType}</strong></div>
          <div className="col-12 col-md-2">Usuário: <strong>{user.username}</strong></div>
          <div className="col-6 col-md-1">Validado: <input 
              type='checkbox'
              checked={user.roles.includes('ROLE_USER')}
              onChange={() => this.handleChangeValidated(user.id)}
          /></div>
          <div className="col-6 col-md-1">Admin: <input 
            type='checkbox'
            checked={user.roles.includes('ROLE_ADMIN')}
            onChange={() => this.handleChangeAdmin(user.id)}
          /></div>
        </div>
        );
    });

    return (
      <div>
        {users}
      </div>
    );
  }

  renderValidateModal() {
    // Check if admin
    if (!isAdmin()) {
      return null;
    }

    return (
      <div className="modal fade" id="validateModal" tabIndex="-1" role="dialog" aria-labelledby="validateModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable" role="document" 
        style={{marginLeft: "5vw"}}>
          <div className="modal-content" style={{width: "90vw"}}>
            <div className="modal-header">
              <h5 className="modal-title" id="validateModalLabel">Validação de usuários</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-0">
              {this.renderUsers()}
            </div>
            <div className="modal-footer flex-column align-items-stretch">              
              <div className="d-flex justify-content-end">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    const options = [];
    
    if (isLoggedIn()) {
      if (isAdmin()) {
        options.push(<li><a href="#" onClick={() => this.showValidateModal()} className="text-white">Administrar usuários</a></li>);
      }
      options.push(<li><a href="#" onClick={logout} className="text-white">Sair</a></li>);
    } else {
      options.push(<li><a href="/signup" className="text-white">Cadastrar</a></li>);
      options.push(<li><a href="/login" className="text-white">Entrar</a></li>);
    }

    const greetMessage = isLoggedIn() ? 'Olá ' + this.state.user.name.split(' ')[0] + '!' : '';

    return ( 
      <div>
        <div className="bg-ine collapse" id="navbarHeader">
          <div className="container">
            <div className="row">
              <div className="col-sm-8 col-md-7 py-4">
                <h4 className="text-white">Sobre</h4>
                <p className="text-white">
                  Essa página foi criada por <a 
                  className="text-white" href="https://twitter.com/gui_niz">@gui_niz</a> e o código-fonte está disponível no <a 
                  className="text-white" href="https://github.com/nizbel/ine-santa-claus">GitHub</a>
                </p>
              </div>
              <div className="col-sm-4 offset-md-1 py-4">
                <h4 className="text-white">{greetMessage}</h4>
                <ul className="list-unstyled">
                  {options}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="navbar bg-ine shadow-sm">
          <div className="container">
            <a href="#" className="navbar-brand d-flex align-items-center">
              <strong>Papai Noel do InE</strong>
            </a>
            <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
        {this.renderValidateModal()}
      </div>
    );
  }
}

class Greetings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      adoptedLetters: []
    }
  }

  componentDidMount() {
    // Check if user is logged in
    if (!isValidated()) {
      return;
    }

    // Make request
    axiosInstance().get(baseUrl + '/users/listAdoptedLetters')
      .then(response => {
        // handle success
        this.setState({
          adoptedLetters: response.data
        });
      })
      .catch(error => {
        // handle error
        console.log(error);
      });
  }

  generateRandomGreet() {
    const randomInt = Math.floor(Math.random() * 3);

    const name = this.state.user.name.split(" ")[0];

    switch (randomInt) {
      case 0:
        return (<p className="lead text-muted">Olá {name}! Escolha uma cartinha abaixo para adotar!</p>);
      case 1:
        return (<p className="lead text-muted">Oi {name}! Que tal adotar uma cartinha hoje?</p>);
      case 2:
        return (<p className="lead text-muted">Que bom ter você por aqui {name}!</p>);
    }
  }

  render() {
    let greetingsMessage;
    if (isValidated()) {
      greetingsMessage = this.generateRandomGreet();
    } else if (isLoggedIn()) {
      greetingsMessage = (
        <p className="lead text-muted">
          Aguarde a validação do seu usuário para poder visualizar as cartas.
        </p>
      )
    } else {
      greetingsMessage = (
        <p className="lead text-muted">
          <a href="/login">Entre</a> ou <a href="/signup">cadastre-se</a> para poder visualizar as cartas!
        </p>
      )
    }

    return (
      <div className="col-lg-6 col-md-8 mx-auto">
        <img className="mb-4 w-50" src="/img/logo.png" alt="logo" title="Inglês na Estrutural" />
        <h1 className="fw-light">Bem-vindo(a) ao Papai Noel do InE!</h1>
        {greetingsMessage}
        <h2 className="text-success">IMPORTANTE</h2>
        <p className="text-success fs-5">Os pedidos nas cartas são opções, ao adotar uma cartinha escolha uma das opções</p>
        <p className="text-success fs-5">Data de entrega dos presentes: <b>09/12/2024</b></p>
      </div>
    );
  }
}

function Letter(props) {
  const image = props.images[0].replace('.jpg', '.thumb.jpg').replace('.jpeg', '.thumb.jpeg');
  return (
    <div className="col">
      <div className="card shadow-sm">
        <img className="bd-placeholder-img card-img-top" height="250" src={image} onClick={props.onVisualize} style={{'cursor': 'pointer'}}/>
        <div className="card-body">
          <div className="d-flex justify-content-between">
            <p><b>{props.name}</b></p>
            <p>{props.age} anos</p>
          </div>
          <p>{props.giftSuggestion}</p>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <button type="button" className="btn btn-sm btn-outline-secondary"
                onClick={props.onVisualize}>Visualizar</button>
              {isAdmin() ?
              <button type="button" className="btn btn-sm btn-outline-secondary"
                onClick={props.onEdit}>Editar</button>
                : null}
            </div>
            <small className="text-muted">{props.ineClass}</small>
          </div>
        </div>
      </div>
    </div>
  );
}

class LettersList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      letters: [],
      user: props.user,
      editModal: null,
      viewModal: null,
      currentLetter: null,
      visualizationType: 'all',
      viewModalMessage: ''
    }
  }

  componentDidMount() {
    // Make request
    axiosInstance().get(baseUrl + '/letters/list')
      .then(response => {
        // handle success
        this.setState({
          isLoading: false,
          letters: response.data,
        });
      })
      .catch(error => {
        // handle error
        this.setState({
          isLoading: false
        });
        console.log(error);
      });

    this.setState({
      editModal: new bootstrap.Modal(document.getElementById('editModal')),
      viewModal: new bootstrap.Modal(document.getElementById('viewModal'))
    });
  }

  renderLoading() {
    return (
      <div className="spinner-container d-flex justify-content-center">
        <div className="loading-spinner">
        </div>
      </div>
    );
  }

  showEditModal(letter) {
    // Has to be admin
    if (!isAdmin()) {
      return;
    }

    this.state.editModal.show();
    this.setState({
      currentLetter: letter
    });
  }

  handleLetterEditInput(event) {
    event.preventDefault();
    // Has to be admin
    if (!isAdmin()) {
      return;
    }

    const target = event.target;
    const editedLetter = {...this.state.currentLetter, [target.name]: target.value}
    this.setState({
      currentLetter: editedLetter
    });
  }

  handleEdit(event) {
    event.preventDefault();
    // Has to be admin
    if (!isAdmin()) {
      return;
    }

    // Make edit request
    axiosInstance().post(baseUrl + '/letters/edit/' + this.state.currentLetter.id, this.state.currentLetter)
    .then(response => {
      const editedLetter = response.data;
      
      // hide modal
      this.state.editModal.hide();

      const letters = [...this.state.letters.map(letter => letter.id !== editedLetter.id ? letter : editedLetter)];
      // update letter
      this.setState({
        currentLetter: null,
        letters: letters
      })

    })
    .catch(error => {
      // handle error
      console.log(error);
    });
  }

  renderEditModal() {
    const letter = this.state.currentLetter;

    // Check if letter available
    const letterAvailable = letter != null;

    const image = letterAvailable ? (<img className="bd-placeholder-img card-img-top" src={letter.imagePath[0]} />) : (null);
    const form = letterAvailable ? 
      (
        <form method="post" onSubmit={(e) => this.handleEdit(e)}>  
          <div className="d-flex mb-3">  
            <div className="form-floating flex-fill me-5">
              <input type="text" className="form-control ml-3" name="name" value={letter.name} 
                placeholder="" onChange={(e) => this.handleLetterEditInput(e)}/>
              <label htmlFor="floatingInput">Nome</label>
            </div>
            <div className="form-floating flex-fill me-5">
              <input type="text" className="form-control" name="ineClass" value={letter.ineClass} 
                placeholder="" onChange={(e) => this.handleLetterEditInput(e)}/>
              <label htmlFor="floatingPassword">Turma</label>
            </div>
            <div className="form-floating flex-fill">
              <input type="number" className="form-control" name="age" value={letter.age} 
                placeholder="" onChange={(e) => this.handleLetterEditInput(e)}/>
              <label htmlFor="floatingPassword">Idade</label>
            </div>
          </div>
          <div className="form-floating mb-3">
            <input type="text" className="form-control" name="giftSuggestion" value={letter.giftSuggestion} 
              placeholder="" onChange={(e) => this.handleLetterEditInput(e)}/>
            <label htmlFor="floatingPassword">Pedido</label>
          </div>
          <div className="d-flex justify-content-between">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
            <button type="submit" className="btn btn-primary">Editar</button>
          </div>
        </form>
      ): (null);

    return (
      <div className="modal fade" id="editModal" tabIndex="-1" role="dialog" aria-labelledby="editModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable" role="document" 
        style={{marginLeft: "5vw"}}>
          <div className="modal-content" style={{width: "90vw"}}>
            <div className="modal-body p-0">
              {image}
            </div>
            <div className="modal-footer flex-column align-items-stretch">        
                {form}
            </div>
          </div>
        </div>
      </div>
    );
  }

  showViewModal(letter) {
    this.setState({
      currentLetter: letter,
      viewModalMessage: ''
    }, () => this.state.viewModal.show());

    // Update letter and show modal
    axiosInstance().get(baseUrl + '/letters/' + letter.id)
    .then(response => {    
      const currentLetter = response.data;

      const letters = [...this.state.letters.map(letter => letter.id !== currentLetter.id ? letter : currentLetter)];
      // update letter
      this.setState({
        currentLetter: currentLetter,
        letters: letters
      });

    })
    .catch(error => {
      // handle error
      console.log(error);
    });
  }

  renderAdoptButton() {
    if (this.state.currentLetter && this.state.currentLetter.adopter) {
      if (this.state.currentLetter.adopter.id == this.state.user.id) {
        return (<button type="button" className="btn btn-secondary" onClick={() => this.handleAbandon()}>Abandonar</button>);
      }
      return <p>Adotada por {this.state.currentLetter.adopter.name}</p>;
    }
    return (<button type="button" className="btn btn-primary" onClick={() => this.handleAdopt()}>Adotar</button>);
  }

  handleAdopt(event) {
    // Has to be a validated user
    if (!isValidated()) {
      return;
    }

    // Make request
    axiosInstance().post(baseUrl + '/letters/adopt/' + this.state.currentLetter.id)
    .then(response => {      
      if (response.data) {
        // hide modal
        this.state.viewModal.hide();

        const currentLetter = {...this.state.currentLetter, adopter: this.state.user};

        const letters = [...this.state.letters.map(letter => letter.id !== currentLetter.id ? letter : currentLetter)];
        // update letter
        this.setState({
          currentLetter: null,
          letters: letters
        });
      } else {
        this.setState({
          viewModalMessage: 'Carta já foi adotada por outro usuário'
        });
      }
    })
    .catch(error => {
      // handle error
      console.log(error);
    });
  }

  handleAbandon() {
    // Has to be a validated user
    if (!isValidated()) {
      return;
    }

    // Make request
    axiosInstance().post(baseUrl + '/letters/abandon/' + this.state.currentLetter.id)
    .then(response => {      
      // hide modal
      this.state.viewModal.hide();

      if (response.data) {
        const currentLetter = {...this.state.currentLetter, adopter: null};

        const letters = [...this.state.letters.map(letter => letter.id !== currentLetter.id ? letter : currentLetter)];
        // update letter
        this.setState({
          currentLetter: null,
          letters: letters
        });
      }

    })
    .catch(error => {
      // handle error
      console.log(error);
    });
  }

  renderViewModal() {
    const letter = this.state.currentLetter;

    // Check if letter available
    const letterAvailable = letter != null;

    const title = letterAvailable ? letter.name + ' (' + letter.age + ' anos)' : '';
    const image = letterAvailable ? (
      <img className="bd-placeholder-img card-img-top" src={letter.imagePath[0]}/>) 
      : null;
    const gift = letterAvailable && letter.giftSuggestion ? letter.giftSuggestion : 'Sem sugestão de presente, favor ler a carta';

    return (
      <div className="modal fade" id="viewModal" tabIndex="-1" role="dialog" aria-labelledby="viewModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-scrollable" role="document" 
        style={{marginLeft: "5vw"}}>
          <div className="modal-content" style={{width: "90vw"}}>
            <div className="modal-header">
              <h5 className="modal-title" id="viewModalLabel">{title}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body p-0">
              {image}
            </div>
            <div className="modal-footer flex-column align-items-stretch">
              <div className="text-center"><p>{gift}</p></div>
              { this.state.viewModalMessage ?
              <div className="alert alert-danger m-2 row" role="alert">
                {this.state.viewModalMessage}
              </div>
              : null
              }
              
              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                {this.renderAdoptButton()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  changeVisualizationType(visualizationType) {
    this.setState({
      visualizationType: visualizationType
    })
  }

  render() {
    const letters = [];

    this.state.letters.sort(((a, b) => a.name.localeCompare(b.name))).forEach(letter => {
      if (this.state.visualizationType === 'adoptable' && letter.adopter) {
        return;
      } else if (this.state.visualizationType === 'myAdopted' && (!letter.adopter || letter.adopter.id !== this.state.user.id)) {
        return;
      }

      letters.push(
        <Letter
          key={letter.id}
          id={letter.id}
          name={letter.name}
          ineClass={letter.ineClass}
          giftSuggestion={letter.giftSuggestion || 'Sem sugestão de presente, favor ler a carta'}
          images={letter.imagePath}
          age={letter.age}
          onEdit={() => this.showEditModal(letter)}
          onVisualize={() => this.showViewModal(letter)}
        />);
    });

    return ( 
      <div className="container">
        {this.state.isLoading ?
          this.renderLoading()
          :
          <div className="row">
            <div className="btn-group col col-md-6 offset-md-3">
              <button type="button" onClick={() => this.changeVisualizationType('all')}
              className={`btn btn-sm btn-outline-secondary ${this.state.visualizationType  == 'all' ? 'active': ''}`}
                >Todas</button>
              <button type="button" onClick={() => this.changeVisualizationType('adoptable')}
              className={`btn btn-sm btn-outline-secondary ${this.state.visualizationType  == 'adoptable' ? 'active': ''}`}
                >Não adotadas</button>
              <button type="button" onClick={() => this.changeVisualizationType('myAdopted')}
              className={`btn btn-sm btn-outline-secondary ${this.state.visualizationType  == 'myAdopted' ? 'active': ''}`}
                >Minhas cartas</button>
            </div>
            <div className="row text-center mt-3">
              <h4>{letters.length} cartas</h4>
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
              {letters}
            </div>
            <div class="toast" id="myToast">
              <div class="toast-header">
                  <strong class="me-auto"><i class="bi-gift-fill"></i> We miss you!</strong>
                  <small>10 mins ago</small>
                  <button type="button" class="btn-close" data-bs-dismiss="toast"></button>
              </div>
              <div class="toast-body">
                  It's been a long time since you visited us. We've something special for you. <a href="#">Click here!</a>
              </div>
          </div>
          </div>
        }

        {this.renderEditModal()}
        {this.renderViewModal()}
      </div>

    );
  }
}

// functions
function getUser() {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
}

function setUser(user) {
  localStorage.setItem('user', JSON.stringify(user));
}

function isLoggedIn() {
  return getUser() != null;
}

function isValidated() {
  const user = getUser();
  return user && user.roles.includes('ROLE_USER');
}

function isAdmin() {
  const user = getUser();
  return user && user.roles.includes('ROLE_ADMIN');
}

function logout() {
  localStorage.setItem('user', null);
  window.location.reload(false);
}

function axiosInstance() {
  return reqInstance || axios;
}

function formatPhone(phone) {
  if (phone.length == 11) {
    return '(' + phone.substring(0, 2) + ') ' + phone.substring(2, 7) + '-' + phone.substring(7);
  } else {
    return '(' + phone.substring(0, 2) + ') ' + phone.substring(2, 6) + '-' + phone.substring(6);
  } 
}

// Starting code
const storageUser = getUser();

// Prepare base for axios instance
let reqInstance = null;

if (storageUser != null) {
  // Prepare axios instance with access token
  reqInstance = axios.create({
    headers: {
      Authorization : `Bearer ${storageUser.accessToken}`
      }
  });

  axiosInstance().get(baseUrl + '/users/loggedUser')
  .then(response => {
    // handle success
    const user = {...storageUser, roles: response.data.roles.map(r => r.name)};

    setUser(user);

    const navBarRoot = ReactDOM.createRoot(document.getElementById("header"));
    navBarRoot.render(<NavBar user={user}/>);

    const greetingsRoot = ReactDOM.createRoot(document.getElementById("greetings"));
    greetingsRoot.render(<Greetings user={user}/>);

    if (isValidated()) {
      const lettersRoot = ReactDOM.createRoot(document.getElementById("album"));
      lettersRoot.render(<LettersList user={user}/>);
    }
  })
  .catch(error => {
    // handle error
    console.log(error);
    localStorage.setItem('user', null);

    const navBarRoot = ReactDOM.createRoot(document.getElementById("header"));
    navBarRoot.render(<NavBar />);
  
    const greetingsRoot = ReactDOM.createRoot(document.getElementById("greetings"));
    greetingsRoot.render(<Greetings />);
  });
} else {
  const navBarRoot = ReactDOM.createRoot(document.getElementById("header"));
  navBarRoot.render(<NavBar />);

  const greetingsRoot = ReactDOM.createRoot(document.getElementById("greetings"));
  greetingsRoot.render(<Greetings />);
}
