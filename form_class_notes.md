# Form class

**Input:**

CSS class prefix
fields array (spec)
	




A field includes
* key
* type


The compoennt also has a values array
with each key being the key so the form will have


form.spec = [{	// This always stays a prop
	key: email,
	type: email
	val: null (null if not set, use the val otherwise)
}, {
	key: pass,
	type: password
}]


this.state.(and then the keys above) with set to initial val if set


which will render the inputs
