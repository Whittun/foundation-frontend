type ServerError = {
  data?: {
    message?: string;
  };
};

export const getErrorMessage = (error: unknown) => {
  const serverError = error as ServerError;

  return serverError.data?.message || 'Something went wrong';
};
