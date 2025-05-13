export type Blog = {
  id: string;
  title: string;
  image: string;
  description: string;
};

export type RootStackParamList = {
  Login: undefined;
  Categories: undefined;
  Politics: undefined;
  Sports: undefined;
  International: undefined;
  Signup: undefined;
  Blog: undefined;
  AddBlog: undefined;
  BlogDetail: { blog: Blog };
};
