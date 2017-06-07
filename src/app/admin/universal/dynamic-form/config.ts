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
      label: 'Введіть назву факультету',
      name: 'faculty_name',
      placeholder: 'Введіть назву факультету',
      required: true
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
    // {
    //   type: 'uniqname',
    //   text: '',
    //   label: `Username`,
    //   name: 'username',
    //   placeholder: `Введіть username студента`,
    //   required: true
    // },
    {
      type: 'input',
      text: '',
      label: `Номер залікової книжки студента`,
      name: 'gradebook',
      placeholder: `Введіть номер залікової книжки студента`,
      required: false
    },

    {
      label: 'Підтвердити',
      name: 'submit',
      type: 'button'
    }
  ];
