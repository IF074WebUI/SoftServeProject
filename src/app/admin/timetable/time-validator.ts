import { AbstractControl } from '@angular/forms';

export const timeValidator = (control: AbstractControl): {[key: string]: boolean} => {
  const startDateArr: string[] = control.get('start_date').value.split('-');
  const startTimeArr: string[] = control.get('start_time').value.split(':');
  const endDateArr: string[] = control.get('end_date').value.split('-');
  const endTimeArr: string[] = control.get('end_time').value.split(':');
  const startTimeIntervalArr: number[] = arrFromSrtToNum(startDateArr.concat(startTimeArr));
  startTimeIntervalArr[1]--;
  const endTimeIntervalArr: number[] = arrFromSrtToNum(endDateArr.concat(endTimeArr));
  endTimeIntervalArr[1]--;
  const startTimeInterval = +new Date(
    startTimeIntervalArr[0],
    startTimeIntervalArr[1],
    startTimeIntervalArr[2],
    startTimeIntervalArr[3],
    startTimeIntervalArr[4]);
  const endTimeInterval = +new Date(
    endTimeIntervalArr[0],
    endTimeIntervalArr[1],
    endTimeIntervalArr[2],
    endTimeIntervalArr[3],
    endTimeIntervalArr[4]);
  const now = Date.now();
  if (startTimeInterval < endTimeInterval && now < startTimeInterval) {
    return null;
  } else {
    return { 'timeValidation': true };
  }
};

export function arrFromSrtToNum(arr: string[]) {
  const arrOfNumbers: number[] = [];
  for ( let i = 0; i < arr.length; i++) {
    arrOfNumbers[i] = +arr[i];
  }
  return arrOfNumbers;
}
