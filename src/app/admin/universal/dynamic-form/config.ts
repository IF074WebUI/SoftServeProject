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
      type: 'input',
      text: '',
      label: 'Назву факультету',
      name: 'faculty_name',
      placeholder: 'Введіть назву факультету',
      requiresAsync: true
    },
    {
      type: 'textarea',
      text: '',
      label: 'Введіть опис факультету',
      name: 'faculty_description',
      placeholder: 'Введіть опис факультету',
      required: false
    },
    {
      label: 'Підтвердити',
      name: 'submit',
      type: 'button'
    }
  ];

export const SPECIALITY_CONFIG =
  [
    {
      type: 'id',
      text: null,
      label: 'ID спеціальності',
      name: 'speciality_id',
      placeholder: '',
      required: false
    },
    {
      type: 'input',
      text: '',
      label: 'Код спеціальності',
      name: 'speciality_code',
      placeholder: 'Введіть код спеціальності',
      required: false
    },
    {
      type: 'input',
      text: '',
      label: 'Назва спеціальності',
      name: 'speciality_name',
      placeholder: 'Введіть назву спеціальності',
      requiresAsync: true
    },
    {
      label: 'Підтвердити',
      name: 'submit',
      type: 'button'
    }
  ];


export const SUBJECTS_CONFIG =
  [
    {
      type: 'id',
      text: null,
      label: 'ID предмету',
      name: 'subject_id',
      placeholder: '',
      required: false
    },
    {
      type: 'input',
      text: '',
      label: 'Назва предмету',
      name: 'subject_name',
      placeholder: 'Введіть назву предмету',
      requiresAsync: true
    },
    {
      type: 'textarea',
      text: '',
      label: 'Опис предмету',
      name: 'subject_description',
      placeholder: 'Введіть опис предмету',
      required: false
    },
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
      requiredMax: true
    },
    {
      type: 'select_speciality',
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

export const STUDENT_CONFIG =
  [
    {
      type: 'id',
      text: null,
      label: 'ID студента',
      name: 'group_id',
      placeholder: '',
      required: false
    },
    {
      type: 'select',
      text: '',
      label: 'Група',
      name: 'Group',
      placeholder: 'Виберіть групу',
      required: false
    },
    {
      type: 'input',
      text: '',
      label: `Ім'я студента`,
      name: 'student_name',
      placeholder: `Введіть ім'я студента`,
      required: true
    },
    {
      type: 'input',
      text: '',
      label: `По-батькові студента`,
      name: 'student_second_name',
      placeholder: `Введіть по-батькові студента`,
      required: false
    },
    {
      type: 'input',
      text: '',
      label: `Прізвище студента`,
      name: 'student_fname',
      placeholder: `Введіть прізвище студента`,
      required: true
    },
    {
      type: 'input',
      text: '',
      label: `Номер залікової книжки студента`,
      name: 'gradebook',
      placeholder: `Введіть номер залікової книжки студента`,
      required: false
    },
    {
      type: 'email',
      text: '',
      label: `Електронна пошта студента`,
      name: 'email',
      placeholder: `Введіть адрес електроної пошти студента`,
      required: false
    },
    {
      label: 'Підтвердити',
      name: 'submit',
      type: 'button'
    }
  ];
export const TEST_DETAIL_CONFIG = [
  {
    type: 'id',
    text: null,
    label: 'ID деталей тесту',
    name: 'id',
    placeholder: '',
    required: false
  },
  {
    type: 'id',
    text: null,
    label: 'ID тесту',
    name: 'test_id',
    placeholder: '',
    required: false
  },
  {
    type: 'select_with_options',
    label: 'Номер рівня завдань',
    name: 'level',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    placeholder: 'Select an option'
  },
  {
    type: 'select_with_options',
    label: 'Кількіст завдань',
    name: 'tasks',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    placeholder: 'Select an option'
  },
  {
    type: 'select_with_options',
    label: 'Кількіст балів',
    name: 'rate',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'],
    placeholder: 'Select an option'
  },
  {
    label: 'Зберегти',
    name: 'submit',
    type: 'button'
  }
];


