import * as jsforce from 'jsforce';
import * as fs from "fs";

const username = 'taiting.li@cognizant.com-test';
const password = 'Ltt@1991'
var conn = new jsforce.Connection({
	loginUrl: 'https://test.salesforce.com'
});
conn.login(username, password, function (err, res) {
	console.log(res.id);
	console.log(res.organizationId);
}).then(userinfo => {

})