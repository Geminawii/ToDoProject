import React from "react";

const ErrorCheck: React.FC = () => {
  throw new Error("Trigger error boundary");
};

export default ErrorCheck;
