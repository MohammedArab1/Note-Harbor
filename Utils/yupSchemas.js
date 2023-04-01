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