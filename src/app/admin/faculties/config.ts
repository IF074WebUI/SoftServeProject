export class QuestionBase<T>{
  type: string;
  value: string;
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  constructor(type: string,
               value: string,
               label: string,
               name: string,
               placeholder: string,
               required: boolean) {
    this.type = type;
    this.value = value || '';
    this.label = label || '';
    this.name = name;
    this.placeholder = placeholder;
    this.required = !!required;
  }
}
