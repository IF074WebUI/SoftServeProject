export class Speciality {
  speciality_id?: number;
  speciality_code: string;
  speciality_name: string;
  constructor(name: string, code: string) {
    this.speciality_name = name;
    this.speciality_code = code;
  }
}
