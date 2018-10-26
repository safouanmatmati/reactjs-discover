// @flow strict
import * as React from 'react';
import { Redirect } from "react-router-dom";
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';

/**
 * Components.
 */
import RatingManager from './../Component/RatingManager.js';
import Map, {type Leaflet, type LeafletMap} from './../Component/Map.js';

/**
 * React CreateRating component properties.
 * @type {Object}
 */
type Props = {
  onSubmit: (identifier: string) => void,
  ratingManager: RatingManager,
  redirect: string
};

/**
 * React CreateRating component.
 *
 * @type {CreateRating}
 * @extends React.Component
 */
export default class CreateRating extends React.Component<Props, {redirect: bool, position: {lat:number, lng:number}}> {
  map: any
  marker: any

  /**
   * Constructor.
   * @param {Props} props
   */
  constructor(props: Props): void {
    super(props);
    this.state = {
      redirect: false,
      position: {lat: 48.8588, lng: 2.3468}
    };

    this.initMap      = this.initMap.bind(this);
    this.moveMarker = this.moveMarker.bind(this);
    this.onSubmit     = this.onSubmit.bind(this);
  }

  /**
   * Initialize map.
   *
   * @param  {Leaflet} instance 
   * @param  {LeafletMap} map      
   */
  initMap = (instance: Leaflet, map: LeafletMap): void => {
    this.map    = map;
    this.marker = instance.marker(this.state.position).addTo(this.map)
      .bindPopup('Business location');

    this.map.on('click', this.moveMarker);
  }

  /**
   * Remove listeners.
   */
  componentWillUnmount() {
    this.map.off('click', this.moveMarker);
  }

  /**
   * Move marker.
   *
   * @param  {Object} leaflet_map 
   */
  moveMarker = (leaflet_map: any):void => {
    this.marker.setLatLng(leaflet_map.latlng);

    this.setState({
      position: leaflet_map.latlng
    })
  }

  /**
   * [onSubmit description]
   * @type {SyntheticEvent}
   */
  onSubmit = (event: SyntheticEvent<HTMLFormElement>): void => {
    event.preventDefault();
    var data = {};

    for (let node:HTMLElement of event.currentTarget.querySelectorAll('[name]')) {
      if (node instanceof HTMLInputElement) {
        data = {[node.name]: node.value, ...data};
      } else if (node instanceof HTMLTextAreaElement) {
        data = {[node.name]: node.value, ...data};
      }
    }

    // Post rating
    var result = this.props.ratingManager.post(data);

    if (result.success && typeof result.identifier === 'string') {
      const identifier: string = result.identifier;

      this.setState({redirect:true});
      this.props.onSubmit(identifier);
    } else {
      alert('Rating failed to be posted.');
      console.log('Rating failed to be posted.', result.message);
    }
  }

  /**
   * Render component.
   * @type {React.Node}
   */
  render = (): React.Node => {
    if (true === this.state.redirect) {
       return <Redirect to={this.props.redirect}/>;
   }

    return (
        <Form className="col-12 col-sm-6" onSubmit={this.onSubmit}>
          <FormGroup>
            <Label htmlFor="business">Business </Label>
            <Input required type="text" name="business" id="business" placeholder="Concerned business" />
          </FormGroup>

          <FormGroup>
            <Label>Location </Label>
            <div className="map-responsive form-group">
              <Map id="map" init={this.initMap} style={{width:'100%', height:'300px'}} />
             </div>
             <small className="form-text text-muted">Clik/tap on map to define a location.</small>

            <div className="row">
              <div className="col-6">
                <Input hidden readOnly type="text" name="lat" placeholder="latitude" value={this.state.position.lat} />
              </div>
              <div className="col-6">
                <Input hidden readOnly type="text" name="lng" placeholder="longitude" value={this.state.position.lng} />
              </div>
            </div>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="user_name">User </Label>
            <Input required type="text" name="user" id="user_name" placeholder="Your name"/>
          </FormGroup>

          <FormGroup>
            <Label htmlFor="comment">Comment </Label>
            <Input required type="textarea" name="comment" id="comment" placeholder="Your comment here" />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="number">Score </Label>
            <Input required type="number" name="score" id="score" step="1" placeholder="[0-5]" min="0" max="5"  />
          </FormGroup>

          <Button className="float-right" type="submit">Post</Button>
        </Form>
    );
  }
}
