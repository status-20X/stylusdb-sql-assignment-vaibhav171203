// function parseQuery(query) {
//     const selectRegex = /SELECT (.+) FROM (.+)/i;
//     const match = query.match(selectRegex);

//     if (match) {
//         const [, fields, table] = match;
//         return {
//             fields: fields.split(',').map(field => field.trim()),
//             table: table.trim()
//         };
//     } else {
//         throw new Error('Invalid query format');
//     }
// }

// module.exports = parseQuery;


// function parseQuery(query) {
//     const selectRegex = /SELECT (.+?) FROM (.+?)(?: WHERE (.*))?$/i;
//     const match = query.match(selectRegex);

//     if (match) {
//         const [, fields, table, whereClause] = match;
//         return {
//             fields: fields.split(',').map(field => field.trim()),
//             table: table.trim(),
//             whereClause: whereClause ? whereClause.trim() : null
//         };
//     } else {
//         throw new Error('Invalid query format');
//     }
// }

// module.exports = parseQuery;

// function parseQuery(query) {
//     const selectRegex = /SELECT (.+?) FROM (.+?)(?: WHERE (.*))?$/i;
//     const match = query.match(selectRegex);

//     if (match) {
//         const [, fields, table, whereString] = match;
//         const whereClauses = whereString ? parseWhereClause(whereString) : [];
//         return {
//             fields: fields.split(',').map(field => field.trim()),
//             table: table.trim(),
//             whereClauses
//         };
//     } else {
//         throw new Error('Invalid query format');
//     }
// }





// function parseQuery(query) {
//     // First, let's trim the query to remove any leading/trailing whitespaces
//     query = query.trim();

//     // Initialize variables for different parts of the query
//     // let selectPart, fromPart;

//     // Split the query at the WHERE clause if it exists
//     const whereSplit = query.split(/\sWHERE\s/i);
//     query = whereSplit[0]; // Everything before WHERE clause

//     // WHERE clause is the second part after splitting, if it exists
//     const whereClause = whereSplit.length > 1 ? whereSplit[1].trim() : null;

//     // // Split the remaining query at the JOIN clause if it exists
//     // const joinSplit = query.split(/\sINNER JOIN\s/i);
//     // selectPart = joinSplit[0].trim(); // Everything before JOIN clause

//     // // JOIN clause is the second part after splitting, if it exists
//     // const joinPart = joinSplit.length > 1 ? joinSplit[1].trim() : null;
    
    
//     const joinSplit = queryWithoutWhere.split(/\s(INNER|LEFT|RIGHT) JOIN\s/i);
//     const selectPart = joinSplit[0].trim(); // Everything before JOIN clause

//     // Extract JOIN information
//     const { joinType, joinTable, joinCondition } = parseJoinClause(queryWithoutWhere);
    
    
    
//     // Parse the SELECT part
//     const selectRegex = /^SELECT\s(.+?)\sFROM\s(.+)/i;
//     const selectMatch = selectPart.match(selectRegex);
//     if (!selectMatch) {
//         throw new Error('Invalid SELECT format');
//     }

//     const [, fields, table] = selectMatch;

//     // Parse the JOIN part if it exists
//     // let joinTable = null, joinCondition = null;
//     if (joinPart) {
//         const joinRegex = /^(.+?)\sON\s([\w.]+)\s*=\s*([\w.]+)/i;
//         const joinMatch = joinPart.match(joinRegex);
//         if (!joinMatch) {
//             throw new Error('Invalid JOIN format');
//         }

//         joinTable = joinMatch[1].trim();
//         joinCondition = {
//             left: joinMatch[2].trim(),
//             right: joinMatch[3].trim()
//         };
//     }
    
//     // Parse the WHERE part if it exists
//     let whereClauses = [];
//     if (whereClause) {
//         whereClauses = parseWhereClause(whereClause);
//     }

//     return {
//         fields: fields.split(',').map(field => field.trim()),
//         table: table.trim(),
//         whereClauses,
//         joinTable,
//         joinCondition
//     };
// }
// function parseWhereClause(whereString) {
//     const conditionRegex = /(.*?)(=|!=|>|<|>=|<=)(.*)/;
//     return whereString.split(/ AND | OR /i).map(conditionString => {
//         const match = conditionString.match(conditionRegex);
//         if (match) {
//             const [, field, operator, value] = match;
//             return { field: field.trim(), operator, value: value.trim() };
//         }
//         throw new Error('Invalid WHERE clause format');
//     });
// }
// function parseJoinClause(query) {
//     const joinRegex = /\s(INNER|LEFT|RIGHT) JOIN\s(.+?)\sON\s([\w.]+)\s*=\s*([\w.]+)/i;
//     const joinMatch = query.match(joinRegex);

//     if (joinMatch) {
//         return {
//             joinType: joinMatch[1].trim(),
//             joinTable: joinMatch[2].trim(),
//             joinCondition: {
//                 left: joinMatch[3].trim(),
//                 right: joinMatch[4].trim()
//             }
//         };
//     }

//     return {
//         joinType: null,
//         joinTable: null,
//         joinCondition: null
//     };
// }


// module.exports = { parseQuery, parseJoinClause };
function parseQuery(query) {
query = query.trim();
const groupBySplit = query.split(/\sGROUP BY\s/i);
  const queryWithoutGroupBy = groupBySplit[0]; // Everything before GROUP BY clause
  let groupByFields =
    groupBySplit.length > 1
      ? groupBySplit[1]
          .trim()
          .split(",")
          .map((field) => field.trim())
      : null;
      const whereSplit = queryWithoutGroupBy.split(/\sWHERE\s/i);
  const queryWithoutWhere = whereSplit[0]; // Everything before WHERE clause
  const whereClause = whereSplit.length > 1 ? whereSplit[1].trim() : null;
  const joinSplit = queryWithoutWhere.split(/\s(INNER|LEFT|RIGHT) JOIN\s/i);
  const selectPart = joinSplit[0].trim(); // Everything before JOIN clause
  const selectRegex = /^SELECT\s(.+?)\sFROM\s(.+)/i;
  const selectMatch = selectPart.match(selectRegex);
  if (!selectMatch) {
    throw new Error("Invalid SELECT format");
  }
  const [, fields, table] = selectMatch;

  // Extract JOIN information
  const { joinType, joinTable, joinCondition } =
    parseJoinClause(queryWithoutWhere);

  // Parse the WHERE part if it exists
  let whereClauses = [];
  if (whereClause) {
    whereClauses = parseWhereClause(whereClause);
  }

  // Check for the presence of aggregate functions without GROUP BY
  const aggregateFunctionRegex =
    /(\bCOUNT\b|\bAVG\b|\bSUM\b|\bMIN\b|\bMAX\b)\s*\(\s*(\*|\w+)\s*\)/i;
  const hasAggregateWithoutGroupBy =
    aggregateFunctionRegex.test(query) && !groupByFields;

  return {
    fields: fields.split(",").map((field) => field.trim()),
    table: table.trim(),
    whereClauses,
    joinType,
    joinTable,
    joinCondition,
    groupByFields,
    hasAggregateWithoutGroupBy,
  };
}
function parseWhereClause(whereString) {
    const conditionRegex = /(.*?)(=|!=|>|<|>=|<=)(.*)/;
    return whereString.split(/ AND | OR /i).map((conditionString) => {
      const match = conditionString.match(conditionRegex);
      if (match) {
        const [, field, operator, value] = match;
        return { field: field.trim(), operator, value: value.trim() };
      }
      throw new Error("Invalid WHERE clause format");
    });
  }
  
  function parseJoinClause(query) {
    const joinRegex =
      /\s(INNER|LEFT|RIGHT) JOIN\s(.+?)\sON\s([\w.]+)\s*=\s*([\w.]+)/i;
    const joinMatch = query.match(joinRegex);
  
    if (joinMatch) {
      return {
        joinType: joinMatch[1].trim(),
      joinTable: joinMatch[2].trim(),
      joinCondition: {
        left: joinMatch[3].trim(),
        right: joinMatch[4].trim(),
      },
    };
}
return {
    joinType: null,
    joinTable: null,
    joinCondition: null,
  };
}

module.exports = { parseQuery, parseJoinClause };



