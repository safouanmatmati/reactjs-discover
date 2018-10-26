// @flow strict
import * as React from 'react';
import {
  NavLink as RouterNavLink,
  Route
} from "react-router-dom";

import {
  Navbar, NavbarBrand, NavbarToggler, Collapse, Nav, NavItem, NavLink,
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.css';

/**
 * AppNavbar React component properties.
 * @type {Object}
 */
type Props = {
  routes: {[string]: Route}
}

/**
 * AppNavbar React component.
 */
export default class AppNavbar extends React.Component <Props, {isOpen: boolean}> {

  /**
   * Constrcutor.
   * @param {Props} props
   */
  constructor(props: Props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {isOpen: false};
  }

  /**
   * Toggle collapse.
   */
  toggle = (): void => {
    this.setState({isOpen: !this.state.isOpen});
  }

  /**
   * Render React component.
   * @type {React.Node}
   */
  render = (): React.Node => {
    return (
        <Navbar color="light" light expand="md">
          <NavbarBrand tag={RouterNavLink} to={this.props.routes.home.props.path}><em>My Comments</em></NavbarBrand>

          <NavbarToggler onClick={this.toggle} />

          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <UncontrolledDropdown setActiveFromChild nav inNavbar>
                <DropdownToggle nav caret className={(window.location.hash.startsWith('#/rating') ? "active": "")}>
                  Rating
                </DropdownToggle>

                <DropdownMenu right>
                  <DropdownItem>
                    <NavLink tag={RouterNavLink} to={this.props.routes.ratings.props.path}>List</NavLink>
                  </DropdownItem>

                  <DropdownItem divider />

                  <DropdownItem>
                    <NavLink tag={RouterNavLink} to={this.props.routes.rating.props.path}>Add</NavLink>
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>

              <NavItem>
                <NavLink tag={RouterNavLink} to={this.props.routes.contact.props.path}>Contact</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
        </Navbar>
    );
  }
}
