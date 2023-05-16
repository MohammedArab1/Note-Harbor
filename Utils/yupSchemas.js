import * as Yup from 'yup'
export const registerSchema = Yup.object().shape({
  email: Yup.string().email().required(),
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  password: Yup.string()
    .required("Password is required")
    .min(4, "Password length should be at least 4 characters"),
  cpassword: Yup.string()
    .required("Confirm Password is required")
    .min(4, "Password length should be at least 4 characters")
    .oneOf([Yup.ref("password")], "Passwords do not match")
});

export const createGroupSchema = Yup.object().shape({
  groupName: Yup.string().required("Group name is required"),
  description: Yup.string()
});

export const JoinGroupSchema = Yup.object().shape({
  accessCode: Yup.string().required("Access code is required"),
});

export const createMeetupSchema = Yup.object().shape({
  name: Yup.string().required("Meetup name is required"),
  description: Yup.string(),
  dateToPickFrom: Yup.date().required("Date from is required")
  .typeError('you must specify a valid date'),
  dateToPickTo: Yup.date().required("Date to is required")
  .typeError('you must specify a valid date'),
  location: Yup.string(),
  minPplNeeded: Yup.number().required("Minimum people needed is required")
    .typeError('you must specify a number')
    .min(0, 'you must specify a number greater than 0'),
  numOfDatesToPick: Yup.number().required("Number of dates to pick is required")
    .typeError('you must specify a number')
    .min(0, 'you must specify a number greater than 0'),
  deadLine: Yup.date().required("Deadline is required")
    .typeError('you must specify a valid date'),
});