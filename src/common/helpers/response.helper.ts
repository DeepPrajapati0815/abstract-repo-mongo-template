export const successResponse = <T>(
  data: T,
  message = "Request successful",
  statusCode = 200,
) => {
  return {
    success: true,
    statusCode,
    message,
    data,
  };
};
