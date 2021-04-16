import React, { Component } from 'react';
import { Label, Text, Tag } from 'react-konva';
import PropTypes from 'prop-types';

function textColorFromBg(bgColor) {
  const color = bgColor.charAt(0) === '#' ? bgColor.substring(1, 7) : bgColor;
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? '#000000' : '#ffffff';
}

export default class Node extends Component {
  overlap = (node) => {
    const { x, y } = this.props;
    const overlapXleftPointInside =
      node.props.x > x - 25 && node.props.x < x + 325;
    const overlapXrightPointInside =
      node.props.x + 300 > x - 25 && node.props.x + 300 < x + 325;
    const overlapX = overlapXleftPointInside || overlapXrightPointInside;
    const overlapY =
      (node.props.y > y - 25 && node.props.y < y + 60) ||
      (node.props.y + 30 > y - 25 && node.props.y + 30 < y + 60);

    if ((overlapX && overlapY) || (x === node.props.x && y === node.props.y)) {
      return true;
    }
    return false;
  };

  render() {
    const {
      children,
      id,
      onClick,
      setCurrentText,
      setFocusText,
      showingChildren,
      x,
      y,
    } = this.props;

    const bgClosedConclusionColor = '#2b2d42';
    const bgOpenConclusionColor = '#8d99ae';
    const bgRuleColor = '#edf2f4';

    const conclusion = id.indexOf('c') !== -1;

    const bgConclusionColor = showingChildren
      ? bgOpenConclusionColor
      : bgClosedConclusionColor;
    const bgColor = conclusion ? bgConclusionColor : bgRuleColor;

    return (
      <Label
        conclusion={conclusion}
        draggable
        id={id}
        key={id}
        onClick={(e) =>
          e.evt.button === 2 ? setCurrentText(e.target.attrs.text) : onClick(e)
        }
        onDragMove={(e) => {
          const { updateNodeState } = this.props;
          updateNodeState(id, e.target.attrs.x, e.target.attrs.y);
        }}
        onMouseEnter={(e) => {
          setFocusText(e.target.attrs.text);
        }}
        onMouseLeave={() => setFocusText('')}
        x={x}
        y={y}
      >
        <Tag fill={bgColor} stroke="black" />
        <Text
          align="center"
          fill={textColorFromBg(bgColor)}
          fontSize={15}
          height={35}
          padding={10}
          text={children}
          width={300}
        />
      </Label>
    );
  }
}

Node.propTypes = {
  children: PropTypes.string,
  id: PropTypes.string,
  onClick: PropTypes.func,
  setFocusText: PropTypes.func,
  setCurrentText: PropTypes.func,
  showingChildren: PropTypes.bool,
  updateNodeState: PropTypes.func,
  x: PropTypes.number,
  y: PropTypes.number,
};
