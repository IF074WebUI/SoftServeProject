export class Group {
public  group_id: number;
  public group_name: string;
  public faculty_id: number;
  public speciality_id: number;
  constructor(group_id, group_name, faculty_id, speciality_id) {
    this.group_id = group_id;
    this.group_name = group_name;
    this.faculty_id = faculty_id;
    this.speciality_id = speciality_id;
  }
 }
