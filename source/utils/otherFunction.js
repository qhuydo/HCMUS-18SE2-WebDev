function isString(str) {
    return typeof (str) === "string" || str instanceof String;
}
module.exports = {
    async missingKeys(object, keys) {
        let errors = {
            "_error": "One or more keys are missing or null",
            "_missing": []
        };

        for (let each of keys) {
            if (
                // non-existent key
                !object.hasOwnProperty(each)
                // null value
                || object[each] === null
                // empty string
                || (isString(object[each]) && object[each].trim().length === 0)
            ) {
                errors._missing.push(each);
            }
        }

        if (errors._missing.length === 0) {
            errors = null
        }

        return errors;
    }
}