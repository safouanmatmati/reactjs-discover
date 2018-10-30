// @flow strict
import * as React from 'react';
import { Table, ButtonGroup, Button} from 'reactstrap';

/**
 * Components.
 */
import {type Rating} from './../Component/RatingFactory.js';
import RatingManager, {type RatingsType as Ratings} from './../Component/RatingManager.js';
import Map, {type Leaflet, type LeafletMap} from './../Component/Map.js';

/**
 * TrRating React component properties.
 * @type {Object}
 */
type RSProps = {
  identifier: string,
  data: Rating,
  is_new: boolean,
  onDisplayComment: (identifier:string, data: Rating) => void,
  onDelete: (identifier:string) => void,
  onUpdateStatus: (identifier:string, allowed: boolean) => boolean
};

/**
 * CSS definition
 * @type {Object}
 */
const style = {
  cursor: 'pointer'
}

/**
 * TrRating React component
 * @extends React.Component
 */
class TrRating extends React.Component <RSProps, {allowed: ?boolean}> {

  /**
   * Constructor.
   * @param {RSProps} props
   */
  constructor(props:RSProps) {
    super(props);

    this.state = {
      allowed: this.props.data.allowed
    };

    this.toogleStatus = this.toogleStatus.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

/**
 * Toogle rating status.
 * @param  {SyntheticEvent} event
 */
  toogleStatus = (event: SyntheticEvent<HTMLElement>): void => {
    event.stopPropagation();

    var allowed = this.props.onUpdateStatus(
      this.props.identifier,
      (this.state.allowed !== true ? true : false)
    );

    this.setState({allowed: allowed});
  }

  /**
   * [handleDelete description]
   * @param {SyntheticEvent}
   */
  handleDelete = (event: SyntheticEvent<HTMLElement>): void => {
    event.stopPropagation();
    this.props.onDelete(this.props.identifier);
  }

/**
 * CLick handler.
 */
  handleClick = ():void => {
    this.props.onDisplayComment(this.props.identifier, this.props.data);
  }

  /**
   * Render component.
   * @return {React.Node}
   */
  render = ():React.Node => {
    let button: ButtonGroup|Button;

    if (false === ('boolean' === (typeof this.state.allowed)) || false === this.state.allowed) {
      button = <Button color="success" onClick={this.toogleStatus} size="sm">Accept</Button>;
    } else {
      button = <Button color="success" onClick={this.toogleStatus} size="sm" active>Accepted</Button>;
    }

    return (
      <tr
        onClick={this.handleClick}
        className={(true === this.props.is_new) ? "table-success" : ''}
        style={style}>
        <td>{this.props.identifier}</td>
        <td>{this.props.data.business}</td>
        <td>{this.props.data.score}</td>
        <td>{this.props.data.user}</td>
        <td>
        <ButtonGroup>
          {button}
           <Button color="danger" onClick={this.handleDelete} size="sm">Delete</Button>
         </ButtonGroup>
        </td>
      </tr>
    );
  }
}

/**
 * RatingList React component properties.
 * @type {Object}
 */
type TRLProps = {
  last_rating_added_id: ?string,
  ratingManager: RatingManager,
  onStatusUpdate: (identifier?: string) => void
};

/**
 * RatingList React component states.
 * @type {Object}
 */
type TRLState = {
  asc: boolean,
  map_current_marker: ?string,
  map_display: boolean
}

/**
 * RatingList React component.
 *
 * @type {RatingList}
 * @extends React.Compponent
 */
export default class RatingList extends React.Component <TRLProps, TRLState> {
  markers:{[identifier:string]: any} = {}

  /**
   * Constructor.
   *
   * @param {TRLProps} props
   */
  constructor(props:TRLProps) {
    super(props);
    this.state = {asc: true, map_display: false, map_current_marker: null};

    this.handleDelete       = this.handleDelete.bind(this);
    this.handleUpdateStatus = this.handleUpdateStatus.bind(this);
  }

  /**
   * Delete handler.
   *
   * @param {string} identifier
   */
  handleDelete = (identifier:string):void => {
    var results = this.props.ratingManager.delete(identifier);

    if (results.success === false) {
      alert('failed to delete');
      console.log(results.message);
    } else {
      this.props.onStatusUpdate(identifier);

      if (undefined !== this.markers[identifier]) {
        this.markers[identifier].remove();
      }

      this.forceUpdate();
    }
  }

  /**
   * Update status handler.
   *
   * @param {string} identifier
   * @param {string} allowed
   */
  handleUpdateStatus = (identifier:string, allowed:boolean): boolean => {
    var results = this.props.ratingManager.patch(identifier, {allowed: allowed});
    const rating = results.rating;

    if (rating) {
      this.props.onStatusUpdate();
      return rating.allowed || false;
    }

    alert('failed to set status');
    console.log(results.message);

    return false;
  }

  /**
   * Toogle "score" sort.
   */
  toogleScoreSort = (): void => {
    this.setState({asc: !this.state.asc});
  }

  /**
   * Display comment handler.
   *
   * @param {string} identifier
   * @param {Rating} data
   */
  handleDisplayComment = (identifier:string, data: Rating): void => {
    for (let marker_id:string in this.markers) {
      if (identifier === marker_id) {
        this.markers[marker_id].openPopup();
      }
    }

    this.setState({
      map_current_marker: identifier,
      map_display: true
    });
  }

  /**
   * Initialize map.
   *
   * @param {Leaflet} instance
   * @param {LeafletMap} data
   */
  initMap = (instance: Leaflet, map: LeafletMap): void => {
    var ratings: Ratings = this.props.ratingManager.getAll();

    for (let identifier in ratings) {
      let rating   = ratings[identifier];
      let position = [rating.lat, rating.lng];

      let marker   = instance.marker(position).addTo(map)
        .bindPopup('<h6>#'+identifier+' - '+rating.business+'</h6><p>'+rating.comment+'</p>')

      if (identifier === this.state.map_current_marker) {
        marker.openPopup();
      }

      this.markers = {[identifier]: marker, ...this.markers};
    }
  }

  /**
   * Return table rows.
   * @return {React.Element[]}
   */
  getTrElements = (): React.Element<typeof TrRating>[] => {
    var results:React.Element<typeof TrRating>[] = [];
    var data:{score: number, tr:React.Element<typeof TrRating>};
    var tmp:typeof data[] = [];
    var ratings:Ratings = this.props.ratingManager.getAll();

    // Format ratings and score
    for (let identifier in ratings) {
      let rating = ratings[identifier];

      tmp.push({
        score: rating.score,
        tr: <TrRating
          key={identifier}
          is_new={this.props.last_rating_added_id === identifier}
          identifier={identifier}
          data={rating}
          onDisplayComment={this.handleDisplayComment}
          onDelete={this.handleDelete}
          onUpdateStatus={this.handleUpdateStatus}/>
        });
    }

    // Order ratings depending on their score
    var asc = this.state.asc
    tmp.sort(function (a: typeof data, b: typeof data) {
      if (asc === true) {
        return a.score - b.score;
      } else {
        return b.score - a.score;
      }
    });

    // Return only ratings ordered
    for (let ordered: typeof data of tmp) {
      results.push(ordered.tr)
    }

    return results;
  }

  /**
   * Render component.
   *
   * @return {React.Node}
   */
  render = (): React.Node => {
    var map = null;

    if (true === this.state.map_display) {
      map = <div className="col-12">
        <div className="map-responsive">
          <Map id="map" init={this.initMap} style={{width:'100%', height:'300px'}} />
         </div>
       </div>
    }

    return (
       <React.Fragment>
        <div className="col table-responsive">
          <Table className="table-hover">
            <caption>List of comments. Click/tap on a row to display comment in map.</caption>

            <thead>
              <tr>
                <th scope="row">#</th>
                <th>Business</th><th>
                  <Button
                    outline color="secondary" onClick={this.toogleScoreSort}
                    size="sm" active={this.state.asc}>Score
                    </Button>
                </th>
                <th>User</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {this.getTrElements()}
            </tbody>
          </Table>
        </div>

        <div className="w-100"></div>

        {map}
       </React.Fragment>
    );
  }
}
