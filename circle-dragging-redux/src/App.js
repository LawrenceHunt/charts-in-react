import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from './actions';
import DevTools from './DevTools';
import Circles from './Circles';
import './App.css';

const width = 960;
const height = 500;

class App extends Component {
  state = {
    circles: this.props.circles,
  };

  componentWillReceiveProps({ circles }) {
    this.setState({ circles });
  }

  onDragStart = ({ id }) => {
    const { setActive } = this.props;
    setActive(id);
  };

  onDrag = ({ id }, dragEvent) => {
    const { circles } = this.state;
    let { x, y } = dragEvent;

    const updatedCircles = circles.map((circle) => {
      if (circle.id !== id) {
        return circle;
      }

      const { radius } = circle;
      const minimum = radius;
      const maximumX = width - radius;
      const maximumY = height - radius;

      if (x < radius) {
        x = minimum;
      }

      if (y < radius) {
        y = minimum;
      }

      if (x > maximumX) {
        x = maximumX;
      }

      if (y > maximumY) {
        y = maximumY;
      }

      return { ...circle, x, y };
    });

    this.setState({ circles: updatedCircles });
  };

  onDragEnd = ({ id }) => {
    const { unsetActive, updateCirclePosition } = this.props;
    const { circles } = this.state;
    const circle = circles.find(o => o.id === id);
    updateCirclePosition(circle);
    unsetActive(id);
  };

  render() {
    const { circles } = this.state;

    return (
      <div className="App">
        <Circles
          circles={circles}
          width={width}
          height={height}
          onDragStart={this.onDragStart}
          onDrag={this.onDrag}
          onDragEnd={this.onDragEnd}
        />

        <DevTools />
      </div>
    );
  }
}

const mapStateToProps = state => state;
const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(App);
