let navigateFn: (path: string) => void;

export const setNavigate = (navigate: (path: string) => void) => {
  navigateFn = navigate;
};

export const navigateTo = (path: string) => {
  if (navigateFn) {
    navigateFn(path);
  } else {
    console.warn("Navigation function is not set!");
  }
};

export const urlRouters = {
  root: "/",
  login: "/login",
  peoples: "/peoples",
  createPeoples: "/peoples/create",
  editPeoples: "/peoples/edit/:id",
  categories: "/categories",
  createCategories: "/categories/create",
  editCategories: "/categories/edit/:id",
  error: "/error",
};
