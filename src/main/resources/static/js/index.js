class Letter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: props.name,
      ineClass: props.ineClass,
      gifts: props.gifts || 'Sem sugestão de presente, favor ler a carta',
      age: props.age,
      images: props.images,
      onEdit: props.onEdit,
      onVisualize: props.onVisualize
    }
  }

  render() {
    return (
      <div className="col">
        <div className="card shadow-sm">
          <img className="bd-placeholder-img card-img-top" height="250" src={this.state.images[0]} />
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <p><b>{this.state.name}</b></p>
              <p>{this.state.age} anos</p>
            </div>
            <p>{this.state.gifts}</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <button type="button" className="btn btn-sm btn-outline-secondary"
                  onClick={this.state.onVisualize}>Visualizar</button>
                <button type="button" className="btn btn-sm btn-outline-secondary"
                  onClick={this.state.onEdit}>Editar</button>
              </div>
              <small className="text-muted">{this.state.ineClass}</small>
            </div>
          </div>
        </div>
      </div>
    );
  }
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
      currentLetter: null
    }
  }

  componentDidMount() {
    // Make request
    axiosInstance().get('http://localhost:8080/letters/list')
      .then(response => {
        // handle success
        this.setState({
          isLoading: false,
          letters: response.data,
        });
      })
      .catch(error => {
        // handle error
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
    this.state.editModal.show();
    this.setState({
      currentLetter: letter
    });
  }

  showViewModal(letter) {
    this.state.viewModal.show();
    this.setState({
      currentLetter: letter
    });
  }

  handleLetterEditInput(event) {
    event.preventDefault();
    const target = event.target;
    const editedLetter = {...this.state.currentLetter, [target.name]: target.value}
    this.setState({
      currentLetter: editedLetter
    });
  }

  handleEdit(event) {
    event.preventDefault();

    // Make edit request
    axiosInstance().post('http://localhost:8080/letters/edit/' + this.state.currentLetter.id, this.state.currentLetter)
    .then(response => {
      const editedLetter = response.data;

      // const letters = [...this.state.letters.map(letter => letter.id !== editedLetter.id ? letter : editedLetter)];
      const letters = [editedLetter];
      // update letter
      this.setState({
        currentLetter: null,
        letters: letters
      })

      // hide modal
      this.state.editModal.hide();
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
            <div className="form-floating flex-fill mr-5">
              <input type="text" className="form-control ml-3" name="name" value={letter.name} 
                placeholder="" onChange={(e) => this.handleLetterEditInput(e)}/>
              <label htmlFor="floatingInput">Nome</label>
            </div>
            <div className="form-floating flex-fill mx-5">
              <input type="text" className="form-control" name="ineClass" value={letter.ineClass} 
                placeholder="" onChange={(e) => this.handleLetterEditInput(e)}/>
              <label htmlFor="floatingPassword">Turma</label>
            </div>
            <div className="form-floating flex-fill ml-5">
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

  renderViewModal() {
    const letter = this.state.currentLetter;

    // Check if letter available
    const letterAvailable = letter != null;

    const title = letterAvailable ? letter.name + ' (' + letter.age + ' anos)' : '';
    const image = letterAvailable ? (<img className="bd-placeholder-img card-img-top" src={letter.imagePath[0]} />) : (null);
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
              
              <div className="d-flex justify-content-between">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Fechar</button>
                <button type="button" className="btn btn-primary">Adotar</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  render() {
    console.log(this.state.letters);
    const letters = [];
    this.state.letters.forEach(letter => {
      letters.push(
        <Letter
          name={letter.name}
          ineClass={letter.ineClass}
          gifts={letter.giftSuggestion}
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
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
            {letters}
          </div>
        }

        {this.renderEditModal()}
        {this.renderViewModal()}
      </div>

    );
  }
}

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user
    }
  }

  render() {
    const options = [];
    
    if (this.state.user) {
      console.log(this.state.user);
      if (this.state.user.roles.includes('ROLE_ADMIN')) {
        options.push(<li><a href="/users/validate" className="text-white">Validar usuários</a></li>);
      }
      options.push(<li><a href="#" onClick={logout} className="text-white">Logout</a></li>);
    } else {
      options.push(<li><a href="/login" className="text-white">Login</a></li>);
    }

    const greetMessage = this.state.user ? 'Olá ' + this.state.user.name.split(' ')[0] + '!' : '';

    return ( 
      <div>
        <div className="bg-dark collapse" id="navbarHeader">
          <div className="container">
            <div className="row">
              <div className="col-sm-8 col-md-7 py-4">
                <h4 className="text-white">Sobre</h4>
                <p className="text-muted">Essa página foi criada por ... e o código pode ser visualizado em ...</p>
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
        <div className="navbar navbar-dark bg-dark shadow-sm">
          <div className="container">
            <a href="#" className="navbar-brand d-flex align-items-center">
              <strong>InE Santa Claus</strong>
            </a>
            <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse" data-bs-target="#navbarHeader" aria-controls="navbarHeader" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
  
// functions
function getUser() {
  const userString = localStorage.getItem('user');
  return userString ? JSON.parse(userString) : null;
}

function isLoggedIn() {
  return getUser() != null;
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

const user = getUser();

const navBarRoot = ReactDOM.createRoot(document.getElementById("header"));
navBarRoot.render(<NavBar user={user}/>);
// const greetRoot = ReactDOM.createRoot(document.getElementById("greet"));
const lettersRoot = ReactDOM.createRoot(document.getElementById("album"));

// Prepare base for axios instance
let reqInstance = null;

if (user != null) {
  // Prepare axios instance with access token
  reqInstance = axios.create({
    headers: {
      Authorization : `Bearer ${user.accessToken}`
      }
  });

  lettersRoot.render(<LettersList user={user}/>);
}