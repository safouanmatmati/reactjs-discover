// @flow strict
import * as React from 'react';

/**
 * Leaflet type.
 *
 * @type {Object}
 */
export type Leaflet = {...any};

/**
 * LeafletMap type.
 *
 * @type {Object}
 */
export type LeafletMap = {...any};

/**
 * Leaflet async library loader.
 *
 * @type {LeafletClass}
 */
class LeafletClass {

  /**
   * Assets required.
   *
   * @type {Object}
   */
  static assests: {type:string, failed?: string|false}[] = [
    {type: 'link', rel: 'stylesheet', href: 'https://unpkg.com/leaflet@1.3.4/dist/leaflet.css'},
    {type: 'script', src: 'https://unpkg.com/leaflet@1.3.4/dist/leaflet.js'}
  ];

  /**
   * Return promise of asset loading.
   *
   * @return Promise[]
   */
  static getPromises = (): Promise<(resolve: (node: any) => void, reject: (node: any) => void) => {}>[] => {
    return LeafletClass.assests.map((asset) => new Promise((resolve: (node: any) => void, reject: (node: any) => void) => {
      var node = document.createElement(asset.type);

      for (let attr in asset) {
        if (attr !== 'type') {
          node.setAttribute(attr, asset[attr]);
        }
      }

      node.onload = () => {
        if (asset.type === 'link' || window.L) {
          resolve(asset);
        } else {
          asset.failed = 'window.L instance not founded after complete script load.'
          reject(asset);
        }
      };

      let first_node = document.getElementsByTagName(asset.type)[0];
      if (first_node.parentNode) {
        first_node.parentNode.insertBefore(node, first_node);
      }

      asset.failed = false;

      // Reject after 5s if not yet loaded
      new Promise(() => {setTimeout(() => {
        asset.failed = 'script load timeout.';
        reject(asset)}, 5000);
      });
    }));
  }

  /**
   * Return Promise returning Leaflet instance on resolve.
   *
   * @return {Promise}
   */
   static init = ():Promise<Leaflet> => {
    return new Promise((resolve) => {
        if (window.L) {
          resolve();
        } else {
          resolve(Promise.all(LeafletClass.getPromises()));
        }
      })
      .then(() => (window.L));
  }
}

/**
 * Properties
 * @type {Object}
 */
type Props = {
  id: string,
  style: {},
  position?: [number, number],
  zoom?: number,
  loading?: string | () => string,
  init?: (instance: Leaflet, map: LeafletMap) => void
}

/**
 * States
 * @type {Object}
 */
type State = {
  content: ?string
}

/**
 * React Map component based on Leaflet library.
 *
 * @type {Map}
 */
export default class Map extends React.Component <Props, State> {
  map: LeafletMap
  instance: Leaflet
  position: ?[number, number]
  style:{} = {width: 500, height: 500}
  zoom:number = 13
  loading: string = 'Loading ...'

  /**
   * Constructor.
   * @param {Props} props
   */
  constructor(props: Props) {
    super(props);

    if (undefined !== this.props.position) {
      this.position = this.props.position;
    }

    if (undefined !== this.props.zoom) {
      this.zoom = this.props.zoom;
    }

    if (undefined !== this.props.style) {
      this.style = this.props.style;
    }

    if (undefined !== this.props.loading) {
      if ('function' === typeof this.props.loading) {
        this.loading = this.props.loading();
      } else {
        this.loading = this.props.loading;
      }
    }

    this.state = {
      content: this.loading,
      style:  this.props.style || { width: 500, height: 500 }
    };
  }

  /**
   * Map configuration initialisation, only if map not configurated yet.
   * Call props.init() to custom configuration.
   */
  componentDidUpdate() {
    if (this.instance !== undefined && this.map === undefined) {
      this.map = this.instance.map(this.props.id);

      if (undefined !== this.position) {
        this.map.setView(this.position,this.zoom);
      } else {
        this.map.fitWorld();
      }

      this.instance.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png?', {
        attribution:
          (typeof process.env.REACT_APP_APPLICATION_SHORT_NAME === 'string' ? '© <a href="/">'+process.env.REACT_APP_APPLICATION_SHORT_NAME+'</a> | ' : '')+
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>',
      }).addTo(this.map);

      if (undefined !== this.props.init && this.map) {
        this.props.init(this.instance, this.map);
      }
    }
  }

  /**
   * Initialize Leaflet and set state.content depending on Leaflet library loading state.
   */
  async componentDidMount() {
    await LeafletClass.init()
      .then((instance: Leaflet) => new Promise((resolve, reject) => {
        this.instance = instance;
        this.setState({content: null});
        resolve();
      })).catch(() => {
        this.setState({content: 'Failed to load map'});
      });
  }

  /**
   * Render map
   * @type React.Node
   */
  render = (): React.Node => {
    return (
      <div id={this.props.id} style={this.style}>
        {this.state.content}
      </div>
    );
  }
}
