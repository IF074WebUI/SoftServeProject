export const FACULTY_CONFIG =
  [
    {
      type: 'id',
      text: null,
      label: 'ID факультету',
      name: 'faculty_id',
      placeholder: '',
      required: false
    },
    {
      type: 'addname',
      text: '',
      label: 'Введіть назву факультету',
      name: 'faculty_name',
      placeholder: 'Введіть назву факультету',
      required: true
    },
    {
      type: 'input',
      text: '',
      label: 'Введіть опис факультету',
      name: 'faculty_description',
      placeholder: 'Введіть опис факультету',
      required: false
    },
    // {
    //   type: 'select',
    //   value: '',
    //   label: 'Id факультету',
    //   name: 'Faculty',
    //   placeholder: 'ВChose факультету',
    //   required: false
    // },
    {
      label: 'Підтвердити',
      name: 'submit',
      type: 'button'
    }
  ];

export const GROUP_CONFIG =
  [
    {
      type: 'id',
      text: null,
      label: 'ID групи',
      name: 'group_id',
      placeholder: '',
      required: false
    },
    {
      type: 'input',
      text: '',
      label: 'Назва групи',
      name: 'group_name',
      placeholder: 'Введіть назву групи',
      required: true
    },
    {
      type: 'select',
      text: '',
      label: 'Спеціальність',
      name: 'Speciality',
      placeholder: 'Виберіть спеціальність',
      required: true
    },
    {
      type: 'select',
      text: '',
      label: 'Факультет',
      name: 'Faculty',
      placeholder: 'Виберіть факультет',
      required: true
    },
    {
      label: 'Підтвердити',
      name: 'submit',
      type: 'button'
    }
  ];
