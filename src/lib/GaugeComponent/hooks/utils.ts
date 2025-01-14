import { GaugeComponentProps } from '../types/GaugeComponentProps';
export const calculatePercentage = (minValue: number, maxValue: number, value: number) => {
    if (value < minValue) {
        return 0;
    } else if (value > maxValue) {
        return 100;
    } else {
        let percentage = (value - minValue) / (maxValue - minValue)
        return (percentage);
    }
}
export const mergeObjects = (obj1: any, obj2: Partial<any>): any => {
    const mergedObj = { ...obj1 } as any;
  
    Object.keys(obj2).forEach(key => {
      const val1 = obj1[key];
      const val2 = obj2[key];
  
      if (Array.isArray(val1) && Array.isArray(val2)) {
        mergedObj[key] = val2;
      } else if (typeof val1 === 'object' && typeof val2 === 'object') {
        mergedObj[key] = mergeObjects(val1, val2);
      } else if (val2 !== undefined) {
        mergedObj[key] = val2;
      }
    });
  
    return mergedObj;
  }
//Returns the angle (in rad) for the given 'percent' value where percent = 1 means 100% and is 180 degree angle
export const percentToRad = (percent: number) => {
    return percent * Math.PI;
};
export const floatingNumber = (value: number, maxDigits = 2) => {
  return Math.round(value * 10 ** maxDigits) / 10 ** maxDigits;
};
export const degToRad = (degrees: number) => {
  return degrees * (Math.PI / 180);
}
export const getCurrentGaugeValuePercentage = (gauge: GaugeComponentProps) => calculatePercentage(gauge.minValue, gauge.maxValue, gauge.value as number);
export const camelCaseToKebabCase = (str: string): string => str.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);