const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const usernamePattern = /^[A-Za-z0-9_.-]+$/
const allowedFields = new Set(['username', 'email', 'password'])

export const validateRegisterData = (body) => {
	const errors = {}

	if (body === null || typeof body !== 'object' || Array.isArray(body)) {
		return { errors: { body: 'request body must be a JSON object' } }
	}

	const unexpectedFields = Object.keys(body).filter((field) => !allowedFields.has(field))
	const username = typeof body.username === 'string' ? body.username.trim() : ''
	const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
	const password = typeof body.password === 'string' ? body.password : ''

	if (unexpectedFields.length > 0) {
		errors.body = `unexpected field${unexpectedFields.length === 1 ? '' : 's'}: ${unexpectedFields.join(', ')}`
	}

	if (!username) {
		errors.username = 'username is required'
	} else if (username.length < 3 || username.length > 30) {
		errors.username = 'username must be between 3 and 30 characters'
	} else if (!usernamePattern.test(username)) {
		errors.username = 'username may contain only letters, numbers, dots, underscores, and hyphens'
	}

	if (!email) {
		errors.email = 'email is required'
	} else if (email.length > 254 || !emailPattern.test(email)) {
		errors.email = 'email must be a valid email address'
	}

	if (!password) {
		errors.password = 'password is required'
	} else if (password.length < 8 || password.length > 72) {
		errors.password = 'password must be between 8 and 72 characters'
	} else if (password.trim() !== password) {
		errors.password = 'password must not start or end with whitespace'
	}

	return {
		errors,
		data: { username, email, password }
	}
}

export const validateRegister = (req, res, next) => {
	const { errors, data } = validateRegisterData(req.body)

	if (Object.keys(errors).length > 0) {
		return res.status(400).json({
			message: 'validation failed',
			errors
		})
	}

	req.body = data
	next()
}
