function Square(props) {
  return (
    <button 
      className='square' 
      onClick={props.onClick}
      style={{backgroundColor: props.winSquare ? 'yellow' : 'white'}}
    >
      {props.value}
    </button>
  );
}
  
class Board extends React.Component {
  renderSquare(i, winSquare) {
    return (
      <
        Square 
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
        winSquare={winSquare}
      />
    );
  }

  render() {
    const checkWinning = ((i) => {
      return this.props.winSquares != null &&  this.props.winSquares.includes(i);
    });

    // Add rows
    const rows = [];
    for (let i = 0; i < 3; i++) {

      // Add columns
      const cols = [];
      for (let j = 0; j < 3; j++) {
        let currentIndex = i*3+j;
        cols.push(this.renderSquare(currentIndex, checkWinning(currentIndex)));
      }

      rows.push(<div className="board-row">{cols}</div>)
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}
  
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      selectedMove: null,
      ascSorting: true,
      stepNumber: 0,
      xIsNext: true,
    }
  }

  handleChangeSort() {
    this.setState({
      ascSorting: !this.state.ascSorting,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length-1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      selectedMove: null,
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,  
    });
  }

  jumpTo(step) {
    this.setState({
      selectedMove: step,
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerSquares = calculateWinner(current.squares);
    const winner = winnerSquares != null ? current.squares[winnerSquares[0]] : null;

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button 
            onClick={() => this.jumpTo(move)}
            style={{fontWeight: move === this.state.selectedMove ? 'bold' : 'normal'}}
          >
            {desc}
          </button>
        </li>
      );
    });

    // Check if should reverse moves list
    if (!this.state.ascSorting) {
      moves.reverse();
    }

    let status;
    if (winner) {
      // Someone won
      status = 'Winner: ' + winner;
    } else if (this.state.history.length == 10) {
      // Draw
      status = 'DRAW!';
    } else {
      // Still playing
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winSquares={winnerSquares}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <label>
            Ascending sort
            <input 
              type='checkbox'
              checked={this.state.ascSorting}
              onChange={() => this.handleChangeSort()}
            />
          </label>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

class Letter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      ineClass: '',
      gifts: '',
      letterImagePath: ''
    }
  }

  render() {
    return (
      <div className="col">
        <div className="card shadow-sm">
          <svg className="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>

          <div className="card-body">
            <p className="card-text">This is a wider card with supporting text below as a natural lead-in to additional content. This content is a little bit longer.</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <button type="button" className="btn btn-sm btn-outline-secondary">View</button>
                <button type="button" className="btn btn-sm btn-outline-secondary">Edit</button>
              </div>
              <small className="text-muted">9 mins</small>
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
    }

  }

  componentDidMount() {
    // Make request
    axios.get('http://localhost:8080/letters/list')
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
  }

  renderLoading() {
    return (
      <div className="spinner-container d-flex justify-content-center">
        <div className="loading-spinner">
        </div>
      </div>
    );
  }

  render() {
    const letters = [];
    
    this.state.letters.forEach(letter => {
      letters.push(
        <Letter
          name={letter.name}
        />);
    });

    return ( 
      <div className="container">
        {this.state.isLoading ?
          this.renderLoading()
          :
          <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
            {letters}
          </div>
          }
      </div>
    );
  }
}
  
// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);
const albumRoot = ReactDOM.createRoot(document.getElementById("album"));
albumRoot.render(<LettersList />);
  
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return lines[i];
    }
  }
  return null;
}