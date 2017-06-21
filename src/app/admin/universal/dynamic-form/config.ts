export const FACULTY_CONFIG =
  [
    {
      type: 'id',
      label: 'ID факультету',
      name: 'faculty_id',
      placeholder: '',
    },
    {
      type: 'input',
      label: 'Назву факультету',
      name: 'faculty_name',
      placeholder: 'Введіть назву факультету',
      requiredAsync: true,
      entity_name: 'Faculty'
    },
    {
      type: 'textarea',
      //  text: '',
      label: 'Введіть опис факультету',
      name: 'faculty_description',
      placeholder: 'Введіть опис факультету',
    }
  ];

export const TEST =
  [
    {
      type: 'input',
      name: 'test'
    }
  ];

export const SPECIALITY_CONFIG =
  [
    {
      type: 'id',
      label: 'ID спеціальності',
      name: 'speciality_id',
      placeholder: '',
    },
    {
      type: 'input',
      label: 'Код спеціальності',
      name: 'speciality_code',
      required: true,
      placeholder: 'Введіть код спеціальності',
    },
    {
      type: 'input',
      label: 'Назва спеціальності',
      name: 'speciality_name',
      placeholder: 'Введіть назву спеціальності',
      requiredAsync: true
    }
  ];


export const SUBJECTS_CONFIG =
  [
    {
      type: 'id',
      label: 'ID предмету',
      name: 'subject_id',
      placeholder: '',
    },
    {
      type: 'input',
      label: 'Назва предмету',
      name: 'subject_name',
      placeholder: 'Введіть назву предмету',
      requiresAsync: true
    },
    {
      type: 'textarea',
      label: 'Опис предмету',
      name: 'subject_description',
      placeholder: 'Введіть опис предмету',
    }
  ];
export const GROUP_CONFIG =
  [
    {
      type: 'id',
      label: 'ID групи',
      name: 'group_id',
      placeholder: '',
    },
    {
      type: 'input',
      label: 'Назва групи',
      name: 'group_name',
      placeholder: 'Введіть назву групи',
      required: true,
      requiredMax: 10
    },
    {
      type: 'select',
      label: 'Спеціальність',
      name: 'Speciality',
      placeholder: 'Виберіть спеціальність',
    },
    {
      type: 'select',
      label: 'Факультет',
      name: 'Faculty',
      placeholder: 'Виберіть факультет',
    }
  ];

export const STUDENT_CONFIG =
  [
    {
      type: 'input',
      label: `Ім'я студента`,
      name: 'student_name',
      placeholder: `Введіть ім'я студента`,
      required: true
    },
    {
      type: 'input',
      label: `Прізвище студента`,
      name: 'student_surname',
      placeholder: `Введіть прізвище студента`,
      required: true
    },
    {
      type: 'input',
      label: `По-батькові студента`,
      name: 'student_fname',
      placeholder: `Введіть по-батькові студента`,
      required: true
    },
    {
      type: 'input',
      label: `Номер залікової книжки студента`,
      name: 'gradebook',
      placeholder: `Введіть номер залікової книжки студента`,
      required: true
    },
    {
      type: 'email',
      label: `Електронна пошта студента`,
      name: 'email',
      placeholder: `Введіть адрес електроної пошти студента`,
      required: true,
      emailPattern: true
    },
    {
      type: 'id',
      label: 'ID студента',
      name: 'group_id',
      placeholder: ''
    },
    {
      type: 'select',
      label: 'Група',
      name: 'group',
      placeholder: 'Виберіть групу',
      required: true
    },
    {
      type: 'id',
      label: 'ID',
      name: 'user_id',
      placeholder: ''
    },
    {
      type: 'input_file',
      label: 'Вкладення',
      name: 'attachment'
    }
  ];
export const TEST_DETAIL_CONFIG = [
  {
    type: 'id',
    label: 'ID деталей тесту',
    name: 'id_detail_id',
    placeholder: '',
  },
  {
    type: 'id',
    label: 'ID тесту',
    name: 'test_id',
    placeholder: '',
  },
  {
    type: 'sect_test_detail_by_id',
    test_id: null,
    label: 'Номер рівня завдань',
    name: 'level',
    options: [],
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
  }
];
export const QUESTION_CONFIG = [
  {
    type: 'id',
    label: 'ID питання',
    name: 'question_id',
    placeholder: '',
  },
  {
    type: 'id',
    label: 'ID тесту',
    name: 'test_id',
    placeholder: '',
  },
  {
    type: 'textarea',
    text: '',
    label: 'Питання',
    name: 'question_text',
    placeholder: 'Напишіть текст питання'
  },
  {
    type: 'select_with_options',
    label: 'Рівень питання',
    name: 'level',
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    placeholder: 'Виберіть рівень питання'
  },
  {
    type: 'select_with_options',
    label: 'Тип питання',
    name: 'type',
    options: ['1', '2'],
    placeholder: 'Виберіть тип питання'
  },
  {
    type: 'input_file',
    label: 'Вкладення',
    name: 'attachment'
  }
];
export const ANSWER_CONFIG = [
  {
    type: 'id',
    text: null,
    label: 'ID питання',
    name: 'answer_id',
    placeholder: '',
    required: false
  },
  {
    type: 'id',
    text: null,
    label: 'ID тесту',
    name: 'question_id',
    placeholder: '',
    required: false
  },
  {
    type: 'textarea',
    label: 'Текст відповіді',
    name: 'answer_text',
    options: '',
    placeholder: ''
  },
  {
    type: 'select_with_options',
    label: 'Правильність відповіді',
    name: 'true_answer',
    options: ['Правильно', 'Неправильноо'],
    placeholder: ''
  },
  {
    type: 'input_file',
    label: 'Вкладення',
    name: 'attachment',
    options: ['1', '2'],
    placeholder: 'Select an option'
  }
];
export const TESTS_CONFIG = [
  {
    type: 'id',
    label: 'ID тесту',
    name: 'test_id',
    placeholder: '',
  },
  {
    type: 'input',
    label: `Номер залікової книжки студента`,
    name: 'test_name',
    placeholder: `Введіть номер залікової книжки студента`,
  },
  {
    type: 'number',
    label: `Кількість завдань`,
    name: 'number_of_tasks',
    placeholder: `Введіть номер залікової книжки студента`,
    test_id: ''
  },
  {
    type: 'number',
    label: `Тривалість тесту`,
    name: 'duration_of_test',
    placeholder: `Введіть номер залікової книжки студента`,
  },
  {
    type: 'select_with_options',
    label: `Статус`,
    name: 'status',
    options: ['доступний', 'недоступний'],
    placeholder: `Введіть номер залікової книжки студента`,
  },
  {
    type: 'number',
    label: `Кількість спроб`,
    name: 'amount',
    placeholder: `Введіть номер залікової книжки студента`,
  },
  {
    type: 'select',
    label: 'Предмет',
    name: 'Subject',
    placeholder: 'Виберіть предмет',
  }
];

export const ADMINUSER_CONFIG = [
  {
    type: 'email',
    label: 'E-mail:',
    name: 'email',
    placeholder: 'Введіть e-mail',
    required: true,
    emailPattern: true
  },
  {
    type: 'id',
    label: 'ID',
    name: 'id',
    placeholder: ''
  },
  {
    type: 'input',
    label: 'Пароль',
    name: 'password',
    placeholder: 'Введіть пароль:',
    required: true
  },
  {
    type: 'input',
    label: 'Повторіть пароль:',
    name: 'password_confirm',
    placeholder: 'Повторіть пароль',
    required: true
  },
  {
    type: 'input',
    label: 'Логін:',
    name: 'username',
    placeholder: 'Введіть логін',
    required: true
  }
];




