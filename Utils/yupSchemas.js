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

export const createProjectSchema = Yup.object().shape({
  projectName: Yup.string().required("Project name is required"),
  description: Yup.string()
});

export const JoinProjectSchema = Yup.object().shape({
  accessCode: Yup.string().required("Access code is required"),
});

export const createSubSectionSchema = Yup.object().shape({
  name: Yup.string().required("Sub Section name is required"),
  description: Yup.string(),
});

export const createNoteSchema = Yup.object().shape({
  content: Yup.string().required("Note content is required"),
  addSource: Yup.boolean(),
  source: Yup.string().when("addSource", {
    is: true,
    then: () => Yup.string().required("Source is required"),
  }),
})

export const createTagSchema = Yup.object().shape({
  tagName: Yup.string().required("Tag name is required"),
})

export const createSourceSchema = Yup.object().shape({
  source: Yup.string().required("Source is required"),
})