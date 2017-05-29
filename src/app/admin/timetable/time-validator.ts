import { AbstractControl } from '@angular/forms';

export const timeValidator = (control: AbstractControl): {[key: string]: boolean} => {
  const startDate = control.get('start_date').value.split('-');
  const startTime = control.get('start_time').value.split(':');
  const endDate = control.get('end_date').value.split('-');
  const endTime = control.get('end_time').value.split(':');

  const startTimeIntervalArr: number[] = arrFromSrtToNum(startDate.concat(startTime));
  const endTimeIntervalArr: number[] = arrFromSrtToNum(endDate.concat(endTime));
  const startTimeInterval = +new Date(startTimeIntervalArr[0], startTimeIntervalArr[1], startTimeIntervalArr[2], startTimeIntervalArr[3], startTimeIntervalArr[4]);
  const endTimeInterval = +new Date(endTimeIntervalArr[0], endTimeIntervalArr[1], endTimeIntervalArr[2], endTimeIntervalArr[3], endTimeIntervalArr[4]);
  if (startTimeInterval < endTimeInterval) {
    return null;
  } else {
    return { 'timeValidation': true };
  }
};


function arrFromSrtToNum(arr: string[]) {
  const arrOfNumbers: number[] = [];
  for ( let i = 0; i < arr.length; i++) {
    arrOfNumbers[i] = +arr[i];
  }
  return arrOfNumbers;
}
