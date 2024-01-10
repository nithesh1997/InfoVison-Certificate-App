function inputValueChange(record, dataKey, dirtyValue, options, children) {
  if (typeof record === "object") {
    if (
      dataKey === "enabled" ||
      dataKey === "udpEnable" ||
      dataKey === "tagMutualAuth"
    ) {
      if (
        record[dataKey] === 0 ||
        record[dataKey] === 1 ||
        record[dataKey] === true ||
        record[dataKey] === false
      ) {
        if (Array.isArray(options)) {
          dirtyValue = String(options[Number(record[dataKey])]);
          if (Array.isArray(children)) {
            children = [children[0], options[Number(record[dataKey])]];
          }
        }
      }
    } else if (dataKey === "tcpTagging") {
      if (record[dataKey] === 1) {
        dirtyValue = "SEQ";
        if (Array.isArray(children)) {
          children = [children[0], "SEQ"];
        }
      } else if (record[dataKey] === 2) {
        dirtyValue = "SID";
        if (Array.isArray(children)) {
          children = [children[0], "SID"];
        }
      } else if (!record[dataKey]) {
        dirtyValue = "";
        if (Array.isArray(children)) {
          children = [children[0], ""];
        }
      }
    } else if (dataKey === "group") {
      if (dirtyValue.includes(",")) {
        let GroupNewFormatValue = dirtyValue
          .split(",")
          .map((e) => e.trim())
          .join(", ");
        dirtyValue = GroupNewFormatValue;
        if (Array.isArray(children)) {
          children = [children[0], GroupNewFormatValue];
        }
      }
    } else if (dataKey === "password") {
      if (record.id == "new_row") {
        dirtyValue = "";
      } else {
        dirtyValue = "********";
        children = [children[0], "********"];
      }
    }
  }

  return { newDirtyValue: dirtyValue, newChildren: children };
}

export default inputValueChange;
