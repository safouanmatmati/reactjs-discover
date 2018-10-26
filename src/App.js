// @flow strict
import * as React from 'react';
import {
  Route,
  BrowserRouter,
  Switch
} from "react-router-dom";
import {UncontrolledAlert } from 'reactstrap';

// Routes
import Home from './Route/Home.js';
import Contact from './Route/Contact.js';
import RatingList from './Route/RatingList.js';
import CreateRating from './Route/CreateRating.js';
import Error404 from './Route/Error404.js';

// Components
import AppNavBar from './Component/AppNavBar.js';
import Statistics from './Component/Statistics.js';
import A2HS from './Component/A2HS.js';

// Helper
import RatingManager from './Component/RatingManager.js';

// CSS
import './App.css';

/**
 * App React component properties.
 * @type {Object}
 */
type States = {
  last_rating_added_id: ?string,
  update_stats:boolean,
  alert: ?React.Node
}

export default class App extends React.Component <{}, States> {
  routes: {[route_name: string]: Route};

  ratingManager: RatingManager;

  pwa_aths: A2HS

  constructor(props: {}) {
    super(props);

    this.ratingManager = new RatingManager();
    this.defineRoutes  = this.defineRoutes.bind(this);
    this.refreshStats  = this.refreshStats.bind(this);
    this.handlePwaInstallable = this.handlePwaInstallable.bind(this);
    this.promptPwaInstallation = this.promptPwaInstallation.bind(this);
    this.handlePwaInstalled  = this.handlePwaInstalled.bind(this);

    this.pwa_aths = new A2HS(this.handlePwaInstallable, this.handlePwaInstalled);

    this.state = {
      last_rating_added_id: null,
      update_stats: true,
      alert: null
    };

    // Retrieve data from localStorage
    if (localStorage.hasOwnProperty('ratings')) {
       try {
          // get the key's value from localStorage
         let data:?string = localStorage.getItem('ratings');

         // parse the localStorage string and fill manager
         this.ratingManager.fill(JSON.parse((typeof data === 'string' ? data : '{}')));
       } catch (e) {
         console.log(e);
       }
    }

    // Define routes
    // They are defined after localStorage treatments because some routes depends on ratings
    this.defineRoutes();
  }

  componentDidMount = () => {
    // Add event listener to save state to localStorage
    // when user leaves/refreshes the page
    window.addEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );
  }

  componentWillUnmount() {
    // Remove event listener
    window.removeEventListener(
      "beforeunload",
      this.saveStateToLocalStorage.bind(this)
    );

    // Saves if component has a chance to unmount
    this.saveStateToLocalStorage();
  }

  saveStateToLocalStorage = () => {
    localStorage.setItem('ratings', JSON.stringify(this.ratingManager.getAll()));
  }

  // Defines mapping between location and components
  defineRoutes = (): void => {
    this.routes = {
      home:      <Route key="home" exact path="/" component={Home}/>,
      contact:   <Route key="contact" path="/contact" component={Contact}/>,
      ratings:   <Route key="ratings" path="/ratings" render={() => <RatingList last_rating_added_id={this.state.last_rating_added_id} onStatusUpdate={this.refreshStats} ratingManager={this.ratingManager}/>}/>,
      rating:    <Route key="rating"
        path="/rating/"
        render={() => <CreateRating onSubmit={this.refreshStats} ratingManager={this.ratingManager} redirect={this.routes.ratings.props.path}/>}/>,
      error_404: <Route key="404"  component={Error404}/>
    };
  }

  refreshStats = (identifier?: string): void => {
    this.setState({
      last_rating_added_id: identifier,
      update_stats: !this.state.update_stats
    });
  }

  handlePwaInstallable = ():void => {
    let alert = <div class="fixed-bottom">
      <UncontrolledAlert className="mb-0" color="info" fade={false}>
        <p className="mb-0">
          <button type="button" onClick={(e)=>{e.preventDefault(); this.promptPwaInstallation();}} class="btn btn-link">
            Add to home screen
          </button>
          <span className="align-middle">to a greater experience.</span>
        </p>
      </UncontrolledAlert>
    </div>;

    this.setState({alert: alert});
  }

  handlePwaInstalled = ():void => {
    const alert =
      <div class="fixed-bottom">
        <UncontrolledAlert className="mb-0" color="success" fade={false}>
          <p className="mb-0">Application added to home screen successfully.</p>
      </UncontrolledAlert>
    </div>;

    this.setState({alert: alert});
  }

  promptPwaInstallation = ():void => {
    this.pwa_aths.promptInstall().then((accepted: boolean) => {
      console.log(accepted);
    });
  }

  render = (): React.Node => {
    return (
      <BrowserRouter>
        <React.Fragment>
          <AppNavBar routes={this.routes} />

          <div className="container">
            {this.state.alert}

            <Statistics key={Date.now()} ratings={this.ratingManager.getAll()}/>

            <div className="row justify-content-around">
              <Switch>
                {Object.values((this.routes))}
              </Switch>
            </div>
          </div>
        </React.Fragment>
      </BrowserRouter>
    );
  }
}
