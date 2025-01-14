import * as utils from '../utils';
import {
  arc,
  pie,
  select,
  easeElastic,
  easeExpOut,  
  scaleLinear,
  interpolateHsl,
  interpolateNumber,
} from "d3";
import { Gauge } from "../../types/Gauge";
//If 'resize' is true then the animation does not play
export const drawNeedle = (resize: boolean, gauge: Gauge) => {
  const { needle, value, minValue, maxValue } = gauge.props;
  var needleRadius = getNeedleRadius(gauge), // Make the needle radius responsive
    centerPoint = [0, -needleRadius / 2];
  let currentPercent = utils.calculatePercentage(minValue, maxValue, value as number);
  var prevPercent = utils.calculatePercentage(minValue, maxValue, gauge.prevProps?.current.value || minValue);
  var pathStr = calculateRotation(prevPercent || utils.getCurrentGaugeValuePercentage(gauge.props), gauge);
  gauge.pointer.current.append("path").attr("d", pathStr).attr("fill", needle.color);
  //Add a circle at the bottom of needle
  gauge.pointer.current
    .append("circle")
    .attr("cx", centerPoint[0])
    .attr("cy", centerPoint[1])
    .attr("r", needleRadius)
    .attr("fill", needle.color);
  //Translate the needle starting point to the middle of the arc
  gauge.pointer.current.attr(
    "transform",
    "translate(" + gauge.outerRadius.current + ", " + gauge.outerRadius.current + ")"
  );
  // if(prevPercent == currentPercent) return;
  //Rotate the needle
  if (!resize && needle.animate) {
    gauge.pointer.current
      .transition()
      .delay(needle.animationDelay)
      .ease(needle.elastic ? easeElastic : easeExpOut)
      .duration(needle.animationDuration)
      .tween("progress",  () => {
        const currentInterpolatedPercent = interpolateNumber(prevPercent, currentPercent);
        return function (percentOfPercent: number) {
          const progress = currentInterpolatedPercent(percentOfPercent);
          return gauge.container.current
            .select(`.needle path`)
            .attr("d", calculateRotation(progress, gauge));
        };
      });
  } else {
    gauge.container.current
      .select(`.needle path`)
      .attr("d", calculateRotation(utils.getCurrentGaugeValuePercentage(gauge.props), gauge));
  }
};

export const calculateRotation = (percent: number, gauge: Gauge) => {
  const { needle } = gauge.props;
  var needleLength = gauge.outerRadius.current * needle.length, //TODO: Maybe it should be specified as a percentage of the arc radius?
    needleRadius = getNeedleRadius(gauge),
    theta = utils.percentToRad(percent),
    centerPoint = [0, -needleRadius / 2],
    topPoint = [
      centerPoint[0] - needleLength * Math.cos(theta),
      centerPoint[1] - needleLength * Math.sin(theta),
    ],
    leftPoint = [
      centerPoint[0] - needleRadius * Math.cos(theta - Math.PI / 2),
      centerPoint[1] - needleRadius * Math.sin(theta - Math.PI / 2),
    ],
    rightPoint = [
      centerPoint[0] - needleRadius * Math.cos(theta + Math.PI / 2),
      centerPoint[1] - needleRadius * Math.sin(theta + Math.PI / 2),
    ];
    
  var pathStr = `M ${leftPoint[0]} ${leftPoint[1]} L ${topPoint[0]} ${topPoint[1]} L ${rightPoint[0]} ${rightPoint[1]}`;
  return pathStr;
};

export const getNeedleRadius = (gauge: Gauge) => {
  const { needle } = gauge.props;
  return needle.width * (gauge.width.current / 500);
}

export const addNeedleElement = (gauge: Gauge) => gauge.pointer.current = gauge.g.current.append("g").attr("class", "needle");
export const clearNeedleElement = (gauge: Gauge) => gauge.pointer.current.selectAll("*").remove();
