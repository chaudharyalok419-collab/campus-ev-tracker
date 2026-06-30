// Input validation helpers

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidPhone = (phone) => {
  const regex = /^(\+?\d{1,3})?\d{10}$/;
  return regex.test(phone.replace(/[\s-]/g, ''));
};

export const isValidVehicleNumber = (number) => {
  return /^[A-Za-z0-9\s-]{4,}$/.test(number);
};

export const formatPhoneForCall = (phone) => {
  const cleaned = phone.replace(/[\s-]/g, '');
  return cleaned.startsWith('+') ? cleaned : `+91${cleaned}`;
};
