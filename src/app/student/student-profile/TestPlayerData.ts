/**
 * Created by student on 2number.number7.17.
 */
export class TestPlayerData {
  studentId: number;
  testId: number;
  testDuration: number;
  startLogTime: number;
  testLogId: number;
  testLogDuration: number;
  endUnixTime: number;
  testName: string;
  constructor (studentId, testId, testDuration, startLogTime, testLogId, testLogDuration, endUnixTime, testName) {
    this.studentId = studentId;
    this.testId = testId;
    this.testDuration = testDuration;
    this.startLogTime = startLogTime;
    this.testLogId = testLogId;
    this.testLogDuration = testLogDuration;
    this.endUnixTime = endUnixTime;
    this.testName = testName;
  }
}
