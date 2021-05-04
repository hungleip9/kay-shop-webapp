export const VALIDATE_EMAIL_REGEX = /^[a-zA-Z][a-zA-Z0-9_.-]{1,}@[a-z0-9]{1,}(\.[a-z0-9]{1,}){1,2}$/
export const VALIDATE_PHONE_REGEX_RULE = /((^0|^84|^\+84|^\(\+84\))+([0-9]{2}))+([0-9]{7}|[0-9]{1}\.[0-9]{3}\.[0-9]{3}|[0-9]{1}-[0-9]{3}-[0-9]{3}|[0-9]{1}\s[0-9]{3}\s[0-9]{3}$)/
export const STATUS = {
    'PENDING': 1,
    'APPROVED': 2,
    'DELIVERED': 3,
    'SHIPPED': 4,
    'CANCELED': 5,
    'RETURNED': 6
};