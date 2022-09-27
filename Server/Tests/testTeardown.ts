import { scrubDatabase } from './testSetup';

// Call the function from testSetup with the teardown parameter to scrub the database
async function testTeardown() {

    await scrubDatabase('teardown')
    .then(message => console.log(message));

}

export default testTeardown;