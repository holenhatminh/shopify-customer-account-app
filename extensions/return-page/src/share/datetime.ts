export const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const options: any = { month: "long", day: "numeric" };
  return new Intl.DateTimeFormat("en-US", options).format(date);
};
