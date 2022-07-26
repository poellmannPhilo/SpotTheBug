export const formatTimestamp = (date: Date): string => {
  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  return (
    date.toLocaleDateString("en-GB", options) +
    " " +
    date.getHours() +
    ":" +
    date.getMinutes()
  );
};
