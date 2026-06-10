exports.validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
exports.validatePhone = (phone) => /^(0|\+84)[0-9]{9,10}$/.test(phone);
exports.validateSlug = (slug) => /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
