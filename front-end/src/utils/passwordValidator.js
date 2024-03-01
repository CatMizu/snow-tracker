import passwordValidator from "password-validator";

const schema = new passwordValidator();

schema
  .is()
  .min(8, "The password should have a minimum length of 8")
  .has()
  .uppercase(1, "The password should contain at least 1 uppercase letter")
  .has()
  .lowercase(1, "The password should contain at least 1 lowercase letter")
  .has()
  .digits(1, "The password should contain at least 1 number")
  .has()
  .not()
  .symbols(0, "The password should not contain any special symbols");

export const validatePassword = (password) => {
  return schema.validate(password);
};

export const getInvalidDetails = (password) => {
  return schema.validate(password, { details: true }).map((invalidItem) => {
    return invalidItem.message;
  });
};
