/**
 * Created by student on 06.06.17.
 */
export class TestDetail {
  public id: number;
  public test_id: string;
  public level: number;
  public tasks: number;
  public  rate: number;
  constructor(id, test_id, level, tasks, rate) {
    this.id = id;
    this.test_id = test_id;
    this.level = level;
    this.tasks = tasks;
    this.rate = rate;
  }
}
