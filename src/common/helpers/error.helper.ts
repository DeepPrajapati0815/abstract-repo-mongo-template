export const errorResponse = ({
  statusCode,
  message,
  error,
  path,
}: {
  statusCode: number;
  message: string;
  error?: any;
  path: string;
}) => {
  return {
    success: false,
    statusCode,
    message,
    error: typeof error === "string" ? error : JSON.stringify(error),
    path,
    timestamp: new Date().toISOString(),
  };
};
