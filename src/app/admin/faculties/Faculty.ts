export class Faculty {
  public faculty_id: number;
  public faculty_name: string;
  public faculty_description: string;
  constructor(id, name, description) {
   this.faculty_id = id;
    this.faculty_name = name;
    this.faculty_description = description;
  }

}
