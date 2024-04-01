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


function parseQuery(query) {
    const selectRegex = /SELECT (.+?) FROM (.+?)(?: WHERE (.*))?$/i;
    const match = query.match(selectRegex);

    if (match) {
        const [, fields, table, whereClause] = match;
        let parsedWhereClause = null;
        if (whereClause) {
            const conditionRegex = /([a-zA-Z_]+)\s*=\s*('[^']*'|[^' ]+)/; // Matches field = value
            const whereMatch = whereClause.match(conditionRegex);
            if (!whereMatch) {
                throw new Error("Invalid WHERE clause format");
            }
            const field = whereMatch[1];
            const value = whereMatch[2].replace(/'/g, ""); // Remove single quotes if present
            parsedWhereClause = { field, value };
        }
        return {
            fields: fields.split(',').map(field => field.trim()),
            table: table.trim(),
            whereClause: parsedWhereClause
        };
    } else {
        throw new Error('Invalid query format');
    }
}

module.exports = parseQuery;

