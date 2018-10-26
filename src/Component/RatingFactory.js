// @flow strict
/**
 * Rating type definition
 * @type {Object}
 */
export type Rating = {
  business: string,
  user:     string,
  comment:  string,
  score:    number,
  lat:      number,
  lng:      number,
  allowed:  boolean
};

/**
 * RatingFactory class.
 *
 * @type {Object}
 */
export default class RatingFactory {
  /**
   * Rating definition
   * @type {Object}
   */
  static definition:{[string]: string} = {
    business: 'string',
    user:     'string',
    comment:  'string',
    score:    'number',
    lat:      'number',
    lng:      'number'
  };

  /**
   * Create rating.
   * @param {Rating|Object data
   */
  static create = (data: Rating|{}) => {
    var rating: Rating = {...data};

    return rating;
  }

  /**
   * Valdate data.
   * @type {Object}
   * @return {Object}
   */
  static validate = (data: {}): {success: bool, errors?: {}} => {
    var errors = {};
    let rating_definition = Object.keys(RatingFactory.definition).map(key => [key, RatingFactory.definition[key]]);

    for (let [name:string, type:string] of rating_definition) {
      if (false === data.hasOwnProperty(name)) {
        errors[name] = {undefined: true};
      } else {
        // Convert to number if number expected
        if (type === 'number') {
          data[name] = Number(data[name]);
        }

        let data_type = typeof data[name];

        if (false === (data_type === type)) {
          errors[name] = {invalid_type: data_type, expected_type: type};
        }
      }
    }

    if (0 < Object.keys(errors).length) {
        return {success: false, errors: errors};
    }

    return {success: true};
  }
}
