const ERRORS = {
	customer: {
		phone_number: {
			required: 'Phone Number cannot be empty.',
			invalid: 'Phone Number can only contain numbers.',
		},
		customer_name: {
			required: 'Customer Name cannot be empty.',
			invalid:
				'Customer Name can only contain letters and chinese characters.',
		},
		permissions: {
			get: 'You do not have permissions to get customers.',
			edit: 'You do not have permissions to edit customers.',
			add: 'You do not have permissions to add customers.',
			delete: 'You do not have permission to delete customers.',
		},
	},
	employee: {
		username: {
			required: 'Username cannot be empty.',
			invalid: 'Username can only contain letters and numbers.',
		},
		password: {
			required: 'Password cannot be empty.',
			invalid:
				'Password can only contain letters, numbers, and symbols ~`! @#$%^&*()_-+={[}]|\\:;"\'<,>.?/',
		},
		first_name: {
			required: 'First Name cannot be empty.',
			invalid: 'First Name can only contain letters.',
		},
		last_name: {
			required: 'Last Name cannot be empty.',
			invalid: 'Last Name can only contain letters.',
		},
		gender: {
			required: 'Gender cannot be empty.',
		},
		role: {
			required: 'Role cannot be empty.',
		},
		body_rate: {
			required: 'Body Rate cannot be empty.',
			invalid: "Body Rate must be in format '12.34'",
		},
		feet_rate: {
			required: 'Feet Rate cannot be empty.',
			invalid: "Feet Rate must be in format '12.34'",
		},
		per_hour: {
			required: 'Per Hour cannot be empty.',
			invalid: "Per Hour must be in format '12.34'",
		},
		language: {
			required: 'Language cannot be empty.',
		},
		permissions: {
			get: 'You do not have permissions to get employees.',
			edit: 'You do not have permissions to edit employees.',
			add: 'You do not have permissions to add employees.',
			delete: 'You do not have permission to delete employees.',
		},
	},
	reservation: {
		permissions: {
			get: 'You do not have permissions to get reservations.',
			edit: 'You do not have permissions to edit reservations.',
			add: 'You do not have permissions to add reservations.',
			delete: 'You do not have permission to delete reservations.',
		},
	},
	schedule: {
		permissions: {
			get: 'You do not have permissions to get schedules.',
			edit: 'You do not have permissions to edit schedules.',
			add: 'You do not have permissions to add schedules.',
			delete: 'You do not have permission to delete schedules.',
		},
	},
	service: {
		permissions: {
			get: 'You do not have permissions to get services.',
			edit: 'You do not have permissions to edit services.',
			add: 'You do not have permissions to add services.',
			delete: 'You do not have permission to delete services.',
		},
	},
	vip_package: {
		permissions: {
			get: 'You do not have permissions to get vip packages.',
			edit: 'You do not have permissions to edit vip packages.',
			add: 'You do not have permissions to add vip packages.',
			delete: 'You do not have permission to delete vip packages.',
		},
	},
};

export default ERRORS;
