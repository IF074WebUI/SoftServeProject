export class QuestionBase<T>{
  type: string;
  text: string;
  label: string;
  name: string;
  placeholder: string;
  required: boolean;

  constructor(type: string,
              text: string,
              label: string,
              name: string,
              placeholder: string,
              required: boolean) {
    this.type = type;
    this.text = text || '';
    this.label = label || '';
    this.name = name;
    this.placeholder = placeholder;
    this.required = !!required;
  }
}

