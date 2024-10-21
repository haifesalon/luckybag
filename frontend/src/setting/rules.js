// 表單規則
export const validators = {
  required: (message) => (v) =>
    (v !== null && v !== undefined && v !== "") || message,
};
