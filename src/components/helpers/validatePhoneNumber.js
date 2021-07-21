export default function validatePhoneNumber(phoneNumberString) {
    const phoneRegex = new RegExp('^[+][1][0-9]{10}$');
    if (phoneNumberString !== undefined && phoneRegex.test(phoneNumberString)) {
        return true
    }
    return false
}