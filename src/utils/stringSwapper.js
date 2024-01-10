const ABBR = ["IEM", "TAC", "ID", "DIA", "DEV"];

const stringSwapper = (value) => {
  const abbrevations = ABBR.map((word) => word.toLocaleLowerCase());
  const str = `${value.toLocaleLowerCase()}`;

  if (str) {
    if (abbrevations.includes(str)) {
      return str.toLocaleUpperCase();
    } else {
      return str;
    }
  } else {
    return "";
  }
};

export default stringSwapper;
